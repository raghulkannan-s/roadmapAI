
function SkeletonRoadmapCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between h-full animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/6"></div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>

      {/* Button */}
      <div className="mt-auto h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

// Grid wrapper for multiple skeletons
export default function SkeletonRoadmaps({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRoadmapCard key={i} />
      ))}
    </div>
  );
}
