


const Header = () => {
  return (
    <div>
        <header className="bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-emerald-600">Roadmap AI</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 cursor-pointer text-slate-500 hover:text-slate-700" onClick={() => {
                localStorage.removeItem("google_id");
                window.location.href = "/";
              }}>
                Log out
              </button>
            </div>
            </div>
        </div>
      </header>
    </div>
  )
}

export default Header