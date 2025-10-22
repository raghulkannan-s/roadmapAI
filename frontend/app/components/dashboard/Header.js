"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";

const Header = ({ toggleSidebar }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      if (!session?.user?.provider_id) return;

      const baseUserData = {
        provider_id: session.user.provider_id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        limit: session.user.limit ?? 3,
      };

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session.user.provider_id}`
        );
        if (res.ok) {
          const userData = await res.json();
          setUser({ ...baseUserData, limit: userData.limit ?? 3 });
        } else {
          setUser(baseUserData);
        }
      } catch {
        setUser(baseUserData);
      }
    };

    if (status === "authenticated") fetchAndSetUser();
  }, [session, status, setUser]);

  if (status === "loading") return null;

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm h-16 flex items-center">
      <div className="flex justify-between items-center w-full px-4 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight">
            Roadmap<span className="text-slate-800">AI</span>
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Profile */}
          <div className="flex items-center sm:gap-3 bg-slate-50 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl border border-slate-200 shadow-sm">
            {user?.image ? (
              <img
                src={user.image}
                alt="User"
                className="w-9 h-9 rounded-full border border-emerald-500 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 border" />
            )}

            {/* Text hidden on mobile, shown on sm screens and up */}
            <div className="flex flex-col pl-2 leading-tight">
              <span className="text-sm font-semibold text-slate-800">
                {user?.name || "Guest"}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {user?.limit ?? 0} gens left
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center sm:gap-2 p-2 sm:px-3 sm:py-1.5 rounded-md text-slate-600 border border-slate-200 text-sm font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            {/* Text hidden on mobile, shown on sm screens and up */}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;