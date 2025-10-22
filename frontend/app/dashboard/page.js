"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Dashboard from "@/components/dashboard/DashboardContent";
import RoadmapForm from "@/components/dashboard/RoadmapForm";
import MyRoadmaps from "@/components/dashboard/MyRoadmaps";

export default function DashboardPage() {
  const [activeSidebar, setActiveSidebar] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 pt-16 relative">
        <Sidebar
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeSidebar === "dashboard" && <Dashboard />}
          {activeSidebar === "generate" && <RoadmapForm />}
          {activeSidebar === "myRoadmaps" && <MyRoadmaps />}
        </main>
      </div>
    </div>
  );
}
