"use client"

import useAuthStore from "@/store/auth"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect } from "react"
export default function LandingPage() {

  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
  if (user) {
    router.push("/dashboard")
  }
  },[user, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 to-slate-900 text-white p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 15%, rgba(20, 184, 166, 0.6) 0.5%, transparent 6%),
                            radial-gradient(circle at 85% 85%, rgba(20, 184, 166, 0.4) 0.5%, transparent 12%)`,
            backgroundSize: "100% 100%"
          }}>
        </div>
      </div>
      
      <div className="relative z-10 max-w-xl w-full mx-auto text-center">

        <div className="mb-12 animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/prop.png"
              alt="Roadmap AI"
              width={96}
              height={96}
              className="rounded-xl"
              priority
            />
            <h1 className="text-5xl md:text-7xl font-bold">
              Roadmap <span className="text-emerald-400">AI</span>
            </h1>
          </div>
          <div className="h-1.5 w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent mt-4"></div>
          <p className="mt-6 text-xl text-emerald-100/70">
            Transform your project planning with intelligent, data-driven roadmaps
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/20 shadow-[0_8px_40px_rgba(16,185,129,0.15)] animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
          <h2 className="text-3xl font-bold text-white mb-6">Welcome</h2>
          <p className="text-emerald-100/70 mb-8">Sign in to access your premium roadmap tools</p>

          <button onClick={() => signIn("google") }
            className="w-full p-4 font-medium rounded-xl cursor-pointer text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-0.5">
            <div className="flex items-center justify-center">
              <span>Sign in with Google</span>
            </div>
          </button>
        </div>

        <p className="mt-10 text-emerald-100/50 text-sm animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
          Enterprise-grade roadmap planning • AI-powered insights
        </p>
      </div>
    </div>
  )
}