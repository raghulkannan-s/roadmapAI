"use client"

import { useState } from 'react';

export default function Dashboard() {
  const [activeSidebar, setActiveSidebar] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-emerald-600">Roadmap AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 text-slate-500 hover:text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
            </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-65px)] bg-white border-r border-slate-200 p-4">
          <nav className="space-y-1">
            {['dashboard', 'roadmaps', 'templates', 'analytics', 'settings'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveSidebar(item)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeSidebar === item
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="capitalize">{item}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500">Welcome back! Here's an overview of your roadmaps.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
