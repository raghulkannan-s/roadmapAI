'use client'

import { use, useEffect, useState, useRef } from "react";
import { get_roadmap_by_id } from "@/services/api";
import Loading from "@/components/UI/Loading";

export default function RoadmapTodo({ params }) {
  const { id } = use(params);

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [taskState, setTaskState] = useState({});
  const [expandedSegments, setExpandedSegments] = useState({});

  const saveTimerRef = useRef(null);

  const normalize = (raw) => {
    const inner = raw?.roadmap_json?.roadmap_json ?? raw?.roadmap_json ?? raw;
    return inner ?? {};
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    get_roadmap_by_id(id)
      .then((res) => {
        if (!isMounted) return;
        if (!res) throw new Error("Roadmap not found");

        setRoadmap(res);

        const data = normalize(res);
        const segments = data.segments ?? [];

        const initialTasks = {};
        const initialExpanded = {};

        segments.forEach((seg) => {
          const label = seg?.label ?? `segment-${Math.random().toString(36).slice(2, 7)}`;
          initialTasks[label] = {};
          (seg.tasks ?? []).forEach((task) => {
            const tid = task?.id ?? task?.task?.slice(0, 8) ?? Math.random().toString(36).slice(2, 8);
            initialTasks[label][tid] = false;
          });
          initialExpanded[label] = false;
        });

        try {
          const savedTasks = JSON.parse(localStorage.getItem(`roadmap_tasks_${id}`)) || {};
          const savedExpanded = JSON.parse(localStorage.getItem(`roadmap_expanded_${id}`)) || {};
          const mergedTasks = { ...initialTasks };
          Object.keys(savedTasks).forEach((label) => {
            mergedTasks[label] = { ...(mergedTasks[label] || {}), ...savedTasks[label] };
          });

          const mergedExpanded = { ...initialExpanded, ...savedExpanded };

          setTaskState(mergedTasks);
          setExpandedSegments(mergedExpanded);
        } catch (e) {
          setTaskState(initialTasks);
          setExpandedSegments(initialExpanded);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err?.message ?? "Failed to load roadmap");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`roadmap_tasks_${id}`, JSON.stringify(taskState));
        localStorage.setItem(`roadmap_expanded_${id}`, JSON.stringify(expandedSegments));
      } catch (e) {
        console.warn("Failed to save roadmap progress:", e);
      }
      saveTimerRef.current = null;
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [taskState, expandedSegments, id]);

  const toggleTask = (segmentLabel, taskId) => {
    setTaskState((prev) => {
      const prevSeg = prev[segmentLabel] ?? {};
      const newSeg = { ...prevSeg, [taskId]: !prevSeg[taskId] };
      return { ...prev, [segmentLabel]: newSeg };
    });
  };

  const toggleSegment = (segmentLabel) => {
    setExpandedSegments((prev) => ({ ...prev, [segmentLabel]: !prev[segmentLabel] }));
  };

  const expandAll = () => {
    setExpandedSegments((prev) => {
      const out = {};
      Object.keys(prev).forEach((k) => (out[k] = true));
      return out;
    });
  };
  const collapseAll = () => {
    setExpandedSegments((prev) => {
      const out = {};
      Object.keys(prev).forEach((k) => (out[k] = false));
      return out;
    });
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-red-500 font-medium">{error}</p>
      </div>
    );
  if (!roadmap)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-600">No roadmap available.</p>
      </div>
    );

  const data = normalize(roadmap);
  const segments = data.segments ?? [];

  const totalTasksCount = segments.reduce((acc, seg) => acc + ((seg.tasks ?? []).length || 0), 0);
  const totalCompleted = segments.reduce((acc, seg) => {
    const label = seg?.label ?? '';
    const segState = taskState[label] || {};
    return acc + Object.values(segState).filter(Boolean).length;
  }, 0);
  const overallProgress = totalTasksCount ? Math.round((totalCompleted / totalTasksCount) * 100) : 0;

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-[#f7f9fc] to-[#eef2fb] dark:from-[#0f1720]/60 dark:to-[#111318]/60 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              {data.goal ?? data.title ?? "Roadmap"}
            </h1>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="mr-2">Estimated: <span className="font-medium text-gray-800 dark:text-gray-100">{data.estimated_duration ?? data.meta?.time ?? "-"}</span></span>
              <span className="mx-2">•</span>
              <span>Created: <span className="text-gray-700 dark:text-gray-200 font-medium">{new Date(roadmap.created_at).toLocaleString()}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-2 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-95 transition"
              >
                Expand all
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition"
              >
                Collapse all
              </button>
            </div>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-3 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:scale-95 transition"
              aria-label="Go to dashboard"
            >
              Home
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 bg-white/70 dark:bg-[#111218]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overview</h3>
            <p className="mt-3 text-gray-800 dark:text-gray-200">{data.duration_reasoning ?? data.meta?.duration_reasoning ?? "No duration reasoning provided."}</p>

            {data.meta?.ai_advice && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-[#0b0f14]/50 border border-gray-100 dark:border-gray-800 rounded-lg">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">AI Advice</div>
                <div className="mt-2 text-gray-800 dark:text-gray-100">{data.meta.ai_advice}</div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.meta?.risks && Array.isArray(data.meta.risks) && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800">
                  <div className="text-xs font-semibold text-red-700 dark:text-red-300">Risks</div>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    {data.meta.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {data.meta?.assumptions && Array.isArray(data.meta.assumptions) && (
                <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800">
                  <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">Assumptions</div>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    {data.meta.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

        {data.meta?.references?.length > 0 && (
          <section className="bg-white/60 dark:bg-[#0b0f14]/60 backdrop-blur rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">References</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              {data.meta.references.map((ref, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">•</span>
                  <div>{ref}</div>
                </div>
              ))}
            </div>
          </section>
        )}
          <div className="bg-white/80 dark:bg-[#14151a]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col justify-center space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400 tracking-wide uppercase">Overall Progress</span>
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{overallProgress}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{totalCompleted}/{totalTasksCount} tasks completed</span>
          </div>

        <div className="w-full sm:w-2/3">
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow-sm">
              {overallProgress}%
            </div>
      </div>
    </div>
  </div>
</div>

        </section>

        <section className="space-y-4">
          {segments.map((seg, sidx) => {
            const label = seg.label ?? `Segment ${sidx + 1}`;
            const tasks = seg.tasks ?? [];
            if (!taskState[label]) {
              const initialSeg = {};
              tasks.forEach((t) => {
                const tid = t?.id ?? (t?.task?.slice(0, 8)) ?? Math.random().toString(36).slice(2, 8);
                initialSeg[tid] = false;
              });
            }

            const segState = taskState[label] || {};
            const segTotal = tasks.length;
            const segDone = Object.values(segState).filter(Boolean).length;
            const segProgress = segTotal ? Math.round((segDone / segTotal) * 100) : 0;
            const expanded = expandedSegments[label] ?? false;

            return (
              <article key={label} className="bg-white/70 dark:bg-[#0b1015]/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
                <header className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{segProgress}%</div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{seg.milestone ?? ""}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="w-36">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="h-2 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${segProgress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSegment(label)}
                        className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        aria-expanded={expanded}
                        aria-controls={`seg-${sidx}`}
                      >
                        {expanded ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>
                </header>

                <div
                  id={`seg-${sidx}`}
                  className={`mt-4 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="mt-2 grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasks</h4>
                      <ul className="space-y-2">
                        {tasks.map((taskRaw) => {
                          const tid = taskRaw?.id ?? (taskRaw?.task?.slice(0, 8)) ?? Math.random().toString(36).slice(2, 8);
                          const tLabel = taskRaw?.task ?? taskRaw?.title ?? "Untitled task";
                          const tType = taskRaw?.type ?? "task";
                          const timeEstimate = taskRaw?.time_estimate ?? taskRaw?.time ?? "";

                          const completed = (taskState[label] && taskState[label][tid]) || false;

                          return (
                            <li key={tid} className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${completed ? "bg-emerald-50 border-emerald-200" : "bg-white dark:bg-[#0b0f14]/30 border-gray-200 dark:border-gray-700"} transition-colors`}>
                              <div className="flex items-center gap-3">
                                <input
                                  id={`chk-${label}-${tid}`}
                                  type="checkbox"
                                  checked={completed}
                                  onChange={() => toggleTask(label, tid)}
                                  className="w-5 h-5 accent-emerald-500 rounded"
                                />
                                <div>
                                  <label htmlFor={`chk-${label}-${tid}`} className={`text-sm font-medium ${completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>{tLabel}</label>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{tType}{timeEstimate ? ` • ${timeEstimate}` : ""}</div>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                {Array.isArray(taskRaw?.dependencies) && taskRaw.dependencies.length > 0 ? (
                                  <div>Deps: {taskRaw.dependencies.join(", ")}</div>
                                ) : taskRaw?.parallel ? (
                                  <div>Parallel</div>
                                ) : (
                                  <div>&nbsp;</div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-6">
          <details className="bg-white/60 dark:bg-[#061018]/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
            <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200">Show full roadmap JSON (complete fidelity)</summary>
            <pre className="mt-3 max-h-72 overflow-auto text-xs bg-gray-50 dark:bg-[#071018] p-3 rounded-md border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200">
{JSON.stringify(roadmap, null, 2)}
            </pre>
          </details>
        </section>
      </div>
    </main>
  );
}
