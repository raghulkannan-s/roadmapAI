import React from "react";

const Sidebar = ({ activeSidebar, setActiveSidebar, isSidebarOpen, closeSidebar }) => {
  const items = {
    Dashboard: "dashboard",
    Generate: "generate",
    MyRoadmaps: "myRoadmaps",
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`fixed md:static top-16 left-0 z-40 bg-white border-r border-slate-200 w-64 h-[calc(100vh-64px)] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-2">
          {Object.entries(items).map(([label, value]) => (
            <button
              key={value}
              onClick={() => {
                setActiveSidebar(value);
                closeSidebar();
              }}
              className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                activeSidebar === value
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="capitalize">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
