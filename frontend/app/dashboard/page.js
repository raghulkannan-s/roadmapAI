"use client"

import { useState } from 'react';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

import Dashboard from '@/components/dashboard/DashboardContent';
import RoadmapForm from '@/components/dashboard/RoadmapForm';
import MyRoadmaps from '@/components/dashboard/MyRoadmaps';

export default function DashboardPage() {

  const [activeSidebar, setActiveSidebar] = useState('dashboard');

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
