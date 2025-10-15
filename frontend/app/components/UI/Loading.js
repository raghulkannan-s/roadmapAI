import Image from "next/image";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 15%, rgba(20, 184, 166, 0.6) 0.5%, transparent 6%),
                            radial-gradient(circle at 85% 85%, rgba(20, 184, 166, 0.4) 0.5%, transparent 12%)`,
            backgroundSize: "100% 100%"
          }}>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="flex items-center gap-4 animate-pulse">
          <Image
            src="/prop.png"
            alt="Roadmap AI"
            width={64}
            height={64}
            className="rounded-xl"
            priority
          />
          <h1 className="text-4xl font-bold">
            Roadmap <span className="text-emerald-400">AI</span>
          </h1>
        </div>

        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-200/20 border-t-emerald-400 rounded-full animate-spin"></div>
          
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-emerald-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>

        <div className="text-center">
          <p className="text-xl text-emerald-100/80 mb-2">{message}</p>
          
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        <div className="w-64 h-1 bg-emerald-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-pulse"></div>
        </div>

        <p className="text-emerald-100/50 text-sm animate-fade-in">
          Generating your intelligent roadmap...
        </p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md", color = "emerald" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4"
  };

  const colorClasses = {
    emerald: "border-emerald-200/20 border-t-emerald-400",
    white: "border-white/20 border-t-white",
    gray: "border-gray-200/20 border-t-gray-400"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-8 bg-emerald-100 rounded w-full"></div>
    </div>
  );
}

