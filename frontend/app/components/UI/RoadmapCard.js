import Link from "next/link";

export default function RoadmapCard({ roadmap }) {
  if (!roadmap) return null;

  const { id, created_at, roadmap_json } = roadmap;
  const data = roadmap_json.roadmap_json || roadmap_json;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-3 sm:p-4 flex flex-col justify-between h-full">
      {/* Header: Goal and Date */}
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2" title={data.title}>
          {data.title}
        </h2>
        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{new Date(created_at).toLocaleDateString()}</span>
      </div>

      {/* Optional badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {data.estimated_duration && (
          <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-xs">
            Duration: {data.estimated_duration}
          </span>
        )}
        {data.segments?.length && (
          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 rounded-xs">
            Segments: {data.segments.length}
          </span>
        )}
      </div>

      {/* View Details Button */}
      <Link href={`/roadmap/${id}`}>
        <button className="mt-auto w-full py-1.5 sm:py-2 px-2 sm:px-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors text-sm">
          View Details
        </button>
      </Link>
    </div>
  );
}
