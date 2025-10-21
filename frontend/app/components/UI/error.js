export default function Error({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur border border-red-900/50 rounded-xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-slate-400 text-sm mb-6">
          {message || "An unexpected error occurred. Please try again."}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}