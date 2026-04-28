const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;