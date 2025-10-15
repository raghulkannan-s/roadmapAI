"use client";

import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
import RoadmapCard from "@/components/UI/RoadmapCard";
import { useParams } from "next/navigation";

export default function RoadmapDetail() {

  const params = useParams();
  const { id } = params;

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;

    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roadmap/get/${id}`);
        const data = await response.json();

        if (!data) {
          throw new Error("Roadmap not found");
        }

        setRoadmap(data);
      } catch (err) {
        throw new Error("Failed to fetch roadmap");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!roadmap) return <div className="p-6 text-red-500">Roadmap not found.</div>;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Roadmap Details</h1>

      <RoadmapCard roadmap={roadmap} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">All Segments & Tasks</h2>
        {roadmap.roadmap_json.segments.map((segment, idx) => (
          <div key={idx} className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{segment.label}</h3>
            <ul className="list-decimal list-inside text-gray-600 text-sm space-y-1">
              {segment.tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center">
                  <span>{task.task}</span>
                  <span className="text-gray-500 text-xs">({task.time_estimate})</span>
                </li>
              ))}
            </ul>
            {segment.milestone && (
              <p className="mt-2 text-gray-500 text-sm">
                <span className="font-semibold">Milestone:</span> {segment.milestone}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
