import Image from "next/image";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <Image
            src="/prop.png"
            alt="Roadmap AI"
            width={48}
            height={48}
            className="rounded-lg"
            priority
          />
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Roadmap AI
          </h1>
        </div>

        {/* Minimalist spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-emerald-400 rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <p className="text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md", color = "emerald" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-2"
  };

  const colorClasses = {
    emerald: "border-slate-800 border-t-emerald-400",
    white: "border-slate-700 border-t-white",
    gray: "border-slate-800 border-t-slate-400"
  };

  return (
    <div className="relative" style={{ width: sizeClasses[size].split(' ')[0].replace('w-', '') + 'px', height: sizeClasses[size].split(' ')[1].replace('h-', '') + 'px' }}>
      <div className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="h-3 bg-slate-800 rounded w-1/4"></div>
      </div>
      <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
      <div className="h-3 bg-slate-800 rounded w-2/3 mb-4"></div>
      <div className="h-8 bg-slate-800 rounded w-full"></div>
    </div>
  );
}

export function LoadingOverlay({ message = "Processing..." }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 flex flex-col items-center space-y-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-emerald-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-300 text-sm">{message}</p>
      </div>
    </div>
  );
}