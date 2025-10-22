function SkeletonRoadmapCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between h-full animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/6"></div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/6"></div>
      </div>

      {/* Button */}
      <div className="mt-auto h-7 sm:h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

// Grid wrapper for multiple skeletons
export default function SkeletonRoadmaps({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-3 sm:px-0">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRoadmapCard key={i} />
      ))}
    </div>
  );
}
