"use client";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${session.user.provider_id}`
        );
        
        if (response.ok) {
          const userData = await response.json();
          setUser({ ...baseUserData, limit: userData.limit ?? 3 });
        } else {
          setUser(baseUserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(baseUserData);
      }
    };

    if (status === "authenticated") {
      fetchAndSetUser();
    }
  }, [session, status, setUser]);

  if (status === "loading") return null;

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-emerald-600">Roadmap AI</h1>
        
        <div className="flex items-center gap-6">
          <button
            className="px-4 py-2 rounded-lg hover:bg-red-400 cursor-pointer hover:text-white text-sm font-medium text-slate-600 transition-colors border border-slate-200"
            onClick={handleLogout}
          >
            Log out
          </button>

          <div className="flex items-center gap-4 bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
            {user?.image && (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover"
              />
            )}
            
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800">
                {user?.name || "Guest"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Generations:</span>
                <span className="text-base font-bold text-emerald-600">{user?.limit ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;