"use client"

import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

import Dashboard from '@/components/dashboard/DashboardContent';
import RoadmapForm from '@/components/dashboard/RoadmapForm';
import MyRoadmaps from '@/components/dashboard/MyRoadmaps';

export default function DashboardPage() {

  const [activeSidebar, setActiveSidebar] = useState('dashboard');


  useEffect(() => {
      const healthCheck = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/roadmap/');
        const data = await response.json();
        toast.success(data.status);
      }
    healthCheck();
  }, []);



  return (
    <div className="min-h-screen bg-slate-50">

      <Header />

      <div className="flex">

        <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />

        <main className="flex-1 p-6">

          {activeSidebar === 'dashboard' && (
             <Dashboard />
         )}
          {activeSidebar === 'generate' && ( 
            <RoadmapForm />
        )}
          {activeSidebar === 'myRoadmaps' && (
            <MyRoadmaps />
        )}
        </main>
      </div>
    </div>
  );
}
