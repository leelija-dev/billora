import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl w-full">
        {/* Error Container */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft dark:shadow-none border border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="p-8 sm:p-10 md:p-12">
            {/* 404 Number */}
            <div className="text-center mb-8">
              <div className="inline-block">
                <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-primary-600 dark:text-primary-400 tracking-tight leading-none">
                  404
                </span>
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center max-w-lg mx-auto">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl mb-6">
                <FiSearch className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-3">
                Page not found
              </h1>
              
              <p className="text-secondary-600 dark:text-secondary-300 text-base sm:text-lg mb-8">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto shadow-soft hover:shadow-medium"
                >
                  <FiHome className="w-5 h-5" />
                  Back to Home
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 rounded-lg font-medium border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors duration-200 w-full sm:w-auto"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>

             
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}