import { useState, useEffect } from "react";
import RoadmapCard from "@/components/UI/RoadmapCard";
import { get_all_roadmaps } from "@/services/api";
import SkeletonRoadmaps from "../UI/skeletonCard";
import Error from "../UI/error";

const DashboardContent = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get_all_roadmaps()
      .then((data) => setRoadmaps(data))
      .catch(() => setError("Failed to fetch roadmaps. Please try again later."))
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <SkeletonRoadmaps count={8} />;

  if (error) return <Error message={error} />;

  return (
    <div className="px-3 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Roadmaps</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {roadmaps.length > 0 ? (
          roadmaps.map((roadmap) => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)
        ) : (
          <p className="text-black col-span-full text-center py-8">No roadmaps available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
