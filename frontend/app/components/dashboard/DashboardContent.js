import { useState, useEffect } from "react";
import RoadmapCard from "@/components/UI/RoadmapCard";
import { get_all_roadmaps } from "@/services/api";
import SkeletonRoadmaps from "../UI/skeletonCard";

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


  if (loading) return <SkeletonRoadmaps />;

  if (error) return <Error message={error} />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Roadmaps</h2>
      </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {roadmaps.length > 0 ? (
    roadmaps.map((roadmap) => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)
  ) : (
    <p className="text-black">No roadmaps available</p>
  )}
</div>


    </div>
  );
};

export default DashboardContent;
