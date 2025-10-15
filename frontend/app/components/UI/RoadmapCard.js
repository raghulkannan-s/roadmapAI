import Link from "next/link";

export default function RoadmapCard({ roadmap }) {
  if (!roadmap) return null;

  const { id, created_at, roadmap_json } = roadmap;
  const data = roadmap_json.roadmap_json || roadmap_json;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-4 flex flex-col justify-between h-full">
      {/* Header: Goal and Date */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2" title={data.goal}>
          {data.goal}
        </h2>
        <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(created_at).toLocaleDateString()}</span>
      </div>

      {/* AI Advice */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3" title={data.meta?.ai_advice}>
        {data.meta?.ai_advice || "No AI advice"}
      </p>

      {/* Optional badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.estimated_duration && (
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Duration: {data.estimated_duration}
          </span>
        )}
        {data.segments?.length && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Segments: {data.segments.length}
          </span>
        )}
      </div>

      {/* View Details Button */}
      <Link href={`/roadmap/${id}`}>
        <button className="mt-auto w-full py-2 px-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors">
          View Details
        </button>
      </Link>
    </div>
  );
}
