import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange, loading }) => {
  // Don't render pagination if no data or only one page
  if (!pagination || !pagination.last_page || pagination.last_page <= 1) {
    return null;
  }

  const { current_page = 1, last_page = 1, total = 0, per_page = 12 } = pagination;
  
  // Calculate total items and range
  const startItem = ((current_page - 1) * per_page) + 1;
  const endItem = Math.min(current_page * per_page, total);

  // Get page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= last_page; i++) {
      if (i === 1 || i === last_page || (i >= current_page - delta && i <= current_page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  // Handle page change with validation
  const handlePageChange = (page) => {
    if (loading) return;
    if (page === current_page) return;
    if (page < 1 || page > last_page) return;
    
    onPageChange(page);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-12 mb-4">
      {/* Items info */}
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-700">{startItem}</span> 
        {' '}-{' '}
        <span className="font-medium text-gray-700">{endItem}</span>
        {' '}of{' '}
        <span className="font-medium text-gray-700">{total}</span>
        {' '}items
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        {/* First page button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={current_page === 1 || loading}
          className={`
            hidden sm:flex w-10 h-10 rounded-lg font-medium transition-all duration-200
            items-center justify-center
            ${current_page === 1 || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
            }
          `}
          aria-label="First page"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous button */}
        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1 || loading}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 
            flex items-center gap-2
            ${current_page === 1 || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
            }
          `}
        >
          <FiChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {pageNumbers.map((pageNum, index) => (
            pageNum === '...' ? (
              <span 
                key={`dots-${index}`} 
                className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`
                  w-10 h-10 rounded-lg font-medium transition-all duration-200
                  ${current_page === pageNum
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                  }
                  ${loading ? 'cursor-wait opacity-50' : ''}
                `}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === last_page || loading}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200 
            flex items-center gap-2
            ${current_page === last_page || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
            }
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => handlePageChange(last_page)}
          disabled={current_page === last_page || loading}
          className={`
            hidden sm:flex w-10 h-10 rounded-lg font-medium transition-all duration-200
            items-center justify-center
            ${current_page === last_page || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
            }
          `}
          aria-label="Last page"
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;