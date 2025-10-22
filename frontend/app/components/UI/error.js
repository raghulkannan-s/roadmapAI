export default function Error({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-4 sm:p-6">
      <div className="max-w-xs sm:max-w-md w-full bg-slate-900/50 backdrop-blur border border-red-900/50 rounded-xl p-6 sm:p-8 text-center">
        {/* Error Icon */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Something went wrong</h3>
        <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">
          {message || "An unexpected error occurred. Please try again."}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}