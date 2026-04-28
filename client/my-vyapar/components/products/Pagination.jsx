import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange, loading }) => {
  if (!pagination || pagination.last_page <= 1) return null;

  const getPageNumbers = () => {
    const totalPages = pagination.last_page;
    const current = pagination.current_page;
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);
    
    if (endPage - startPage < 4) {
      if (startPage === 1) endPage = Math.min(totalPages, startPage + 4);
      if (endPage === totalPages) startPage = Math.max(1, endPage - 4);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-4">
      <button
        onClick={() => onPageChange(pagination.current_page - 1)}
        disabled={!pagination.prev_page_url || loading}
        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
          !pagination.prev_page_url || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <FiChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={loading}
            className={`w-10 h-10 rounded-lg font-medium transition ${
              pagination.current_page === pageNum
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(pagination.current_page + 1)}
        disabled={!pagination.next_page_url || loading}
        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
          !pagination.next_page_url || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Next
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;