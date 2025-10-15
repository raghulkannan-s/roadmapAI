import Link from "next/link";

export default function RoadmapCard({ roadmap }) {
  if (!roadmap) return null;

  const { id, created_at, roadmap_json } = roadmap;
  const data = roadmap_json.roadmap_json || roadmap_json;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">{data.goal}</h2>
        <span className="text-sm text-gray-500">{new Date(created_at).toLocaleDateString()}</span>
      </div>

      {/* Meta */}
      <div className="mb-4 text-gray-600 text-sm space-y-1">
        <p><span className="font-semibold">Estimated Duration:</span> {data.estimated_duration}</p>
        <p><span className="font-semibold">Time Reasoning:</span> {data.duration_reasoning}</p>
        <p><span className="font-semibold">AI Advice:</span> {data.meta?.ai_advice}</p>
        {data.meta?.references?.length > 0 && (
          <p><span className="font-semibold">References:</span> {data.meta.references.join(", ")}</p>
        )}
      </div>

      {/* Prerequisites */}
      {data.prerequisites?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">Prerequisites:</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {data.prerequisites.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Segments */}
      {data.segments?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Segments / Milestones:</h3>
          {data.segments.map((segment, idx) => (
            <div key={idx} className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">{segment.label}</h4>
              <ul className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                {segment.tasks.map((task) => (
                  <li key={task.id} className="flex justify-between items-center">
                    <span className="font-semibold">{task.task}</span>
                    <span className="ml-2 text-gray-500 text-xs">({task.time_estimate})</span>
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
      )}

      {/* View Details Button */}
      <div className="mt-auto">
        <Link href={`/roadmap/${id}`}>
          <button className="w-full mt-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
