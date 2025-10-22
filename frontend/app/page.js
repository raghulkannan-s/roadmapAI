"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/auth";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Loading from "./components/UI/Loading";

export default function LandingPage() {
  const router = useRouter();
  const { status } = useSession();
  const { user } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated" && user.provider_id) {
      router.push("/dashboard");
    }
  }, [status, user, router]);

  if (status === "loading") return <Loading />;

  if (!user.provider_id) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="pt-6 px-4 sm:pt-8 sm:px-8">
            <div className="flex items-center gap-3">
              <Image
                src="/prop.png"
                alt="Roadmap AI"
                width={36}
                height={36}
                className="rounded-lg sm:w-10 sm:h-10"
                priority
              />
              <span className="text-lg sm:text-xl font-semibold tracking-tight">Roadmap AI</span>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 md:py-12">
            <div className="w-full max-w-4xl">
              <div className="grid gap-8 md:gap-16 md:grid-cols-2 items-center">
                {/* Left side - Marketing copy */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                      Strategic roadmaps,
                      <span className="text-emerald-400"> powered by AI</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                      Transform complex project planning into clear, actionable roadmaps. 
                      Intelligent insights that adapt to your workflow.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>AI-driven project analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Intelligent milestone generation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>Real-time collaboration</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Sign in card */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 sm:p-8 mt-4 md:mt-0">
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Get started</h2>
                      <p className="text-slate-400 text-sm">Sign in to access your workspace</p>
                    </div>

                    <button 
                      onClick={() => signIn("google")}
                      className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 sm:py-8 px-4 sm:px-8 text-center text-xs sm:text-sm text-slate-500">
            © 2025 Roadmap AI. Built for teams that ship.
          </footer>
        </div>
      </div>
    );
  }

  return <Loading />;
}