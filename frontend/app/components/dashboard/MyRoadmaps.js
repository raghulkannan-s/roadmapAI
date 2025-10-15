import { useState, useEffect } from "react";
import RoadmapCard from "@/components/UI/RoadmapCard";
import { get_my_roadmaps } from "@/services/api";

const MyRoadmaps = () => {
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await get_my_roadmaps();
        setMyRoadmaps(data || []);
      } catch (err) {
        console.error("Error fetching roadmaps:", err);
        setError("Failed to fetch roadmaps. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRoadmaps();
  }, []);

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Roadmaps</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myRoadmaps.length > 0 ? (
          myRoadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))
        ) : (
          <p className="text-black">No roadmaps available</p>
        )}
      </div>
    </div>
  );
};

export default MyRoadmaps;
