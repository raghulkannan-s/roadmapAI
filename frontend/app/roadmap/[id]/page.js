'use client'

import { useEffect, useState } from "react";
import { get_roadmap_by_id } from "@/services/api";
import { use } from "react";
import Loading from "@/components/UI/Loading";

export default function RoadmapTodo({ params }) {
  const { id } = use(params);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskState, setTaskState] = useState({});
  const [expandedSegments, setExpandedSegments] = useState({});

  useEffect(() => {
    get_roadmap_by_id(id)
      .then((data) => {
        if (!data) throw new Error("Roadmap not found");
        setRoadmap(data);

        const segments = data.roadmap_json.roadmap_json || data.roadmap_json;
        const initialTaskState = {};
        const initialExpanded = {};
        segments.segments?.forEach(seg => {
          initialTaskState[seg.label] = {};
          seg.tasks.forEach(task => initialTaskState[seg.label][task.id] = false);
          initialExpanded[seg.label] = false;
        });

        const savedTasks = JSON.parse(localStorage.getItem(`roadmap_${id}`) || "{}");
        const savedExpanded = JSON.parse(localStorage.getItem(`roadmap_expanded_${id}`) || "{}");

        setTaskState({ ...initialTaskState, ...savedTasks });
        setExpandedSegments({ ...initialExpanded, ...savedExpanded });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleTask = (segmentLabel, taskId) => {
    setTaskState(prev => {
      const newState = {
        ...prev,
        [segmentLabel]: {
          ...prev[segmentLabel],
          [taskId]: !prev[segmentLabel][taskId]
        }
      };
      localStorage.setItem(`roadmap_${id}`, JSON.stringify(newState));
      return newState;
    });
  };

  const toggleSegment = (segmentLabel) => {
    setExpandedSegments(prev => {
      const newState = { ...prev, [segmentLabel]: !prev[segmentLabel] };
      localStorage.setItem(`roadmap_expanded_${id}`, JSON.stringify(newState));
      return newState;
    });
  };

  const expandAll = () => {
    const allExpanded = {};
    Object.keys(expandedSegments).forEach(key => allExpanded[key] = true);
    setExpandedSegments(allExpanded);
    localStorage.setItem(`roadmap_expanded_${id}`, JSON.stringify(allExpanded));
  };

  const collapseAll = () => {
    const allCollapsed = {};
    Object.keys(expandedSegments).forEach(key => allCollapsed[key] = false);
    setExpandedSegments(allCollapsed);
    localStorage.setItem(`roadmap_expanded_${id}`, JSON.stringify(allCollapsed));
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!roadmap) return null;

  const data = roadmap.roadmap_json.roadmap_json || roadmap.roadmap_json;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{data.goal}</h1>
        <div className="mt-2 sm:mt-0 flex space-x-2">
          <button
            onClick={expandAll}
            className="px-4 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Collapse All
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Home
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">Created: {new Date(roadmap.created_at).toLocaleDateString()}</p>

      {/* Roadmap meta */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
        <p><span className="font-semibold">Estimated Duration:</span> {data.estimated_duration}</p>
        <p><span className="font-semibold">Duration Reasoning:</span> {data.duration_reasoning}</p>
        <p><span className="font-semibold">AI Advice:</span> {data.meta?.ai_advice}</p>
        {data.meta?.references?.length > 0 && (
          <p><span className="font-semibold">References:</span> {data.meta.references.join(", ")}</p>
        )}
      </div>

      {/* Prerequisites */}
      {data.prerequisites?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">Prerequisites:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            {data.prerequisites.map((pre, idx) => <li key={idx}>{pre}</li>)}
          </ul>
        </div>
      )}

      {/* Segments */}
      {data.segments?.map(seg => {
        const completedTasks = Object.values(taskState[seg.label] || {}).filter(Boolean).length;
        const totalTasks = seg.tasks.length;
        const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

        return (
          <div key={seg.label} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <button
              onClick={() => toggleSegment(seg.label)}
              className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
            >
              <span className="font-medium text-gray-800">{seg.label}</span>
              <span className="text-sm text-gray-500">{completedTasks}/{totalTasks} done</span>
            </button>

            <div className={`transition-max-height duration-300 overflow-hidden ${expandedSegments[seg.label] ? "max-h-[1000px]" : "max-h-0"}`}>
              <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50">
                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Tasks */}
                <ul className="space-y-2 mt-2">
                  {seg.tasks.map(task => {
                    const completed = taskState[seg.label]?.[task.id] || false;
                    return (
                      <li
                        key={task.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          completed ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer select-none w-full">
                          {/* Hidden checkbox */}
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => toggleTask(seg.label, task.id)}
                            className="hidden"
                          />

                          {/* Custom checkbox */}
                          <div
                            className={`flex items-center justify-center w-5 h-5 border-2 rounded-lg transition-all ${
                              completed ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
                            }`}
                          >
                            {completed && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          <span
                            className={`transition-all ${completed ? "line-through text-gray-400 opacity-70" : "text-gray-800"}`}
                          >
                            {task.task}
                          </span>
                        </label>
                        <span className="text-xs text-gray-500">{task.time_estimate}</span>
                      </li>
                    );
                  })}
                </ul>


                {seg.milestone && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Milestone:</span> {seg.milestone}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
