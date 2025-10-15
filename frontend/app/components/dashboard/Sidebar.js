


const Sidebar = ({ activeSidebar, setActiveSidebar }) => {

  const sidebars = {
    Dashboard : "dashboard",
    Generate : "generate",
    MyRoadmaps : "myRoadmaps"
  }

  return (
        <aside className="w-64 h-[calc(100vh-65px)] bg-white border-r border-slate-200 p-4">
          <nav className="space-y-1">
            {Object.entries(sidebars).map(([label, value]) => (
              <button
                key={value}
                onClick={() => setActiveSidebar(value)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeSidebar === value
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="capitalize">{label}</span>
              </button>
            ))}
          </nav>
        </aside>
  )
}

export default Sidebar