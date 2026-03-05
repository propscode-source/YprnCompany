const LoadingFallback = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
