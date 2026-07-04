import React from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  pagination,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize)
  
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const getPageUrl = (pageNumber) => {
    if (!pagination?.first_page_url) return null
    
    try {
      const url = new URL(pagination.first_page_url)
      url.searchParams.set('page', pageNumber)
      return url.toString()
    } catch (error) {
      // Fallback to simple string replacement if URL parsing fails
      return pagination.first_page_url.replace(/page=\d+/, `page=${pageNumber}`)
    }
  }

  const handlePageChange = (page) => {
    if (page === '...') return
    if (pagination) {
      const pageParam = typeof page === 'number' ? getPageUrl(page) : page
      onPageChange(pageParam)
    } else {
      onPageChange(page)
    }
  }

  // Calculate range for display
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* Mobile view */}
      <div className="flex items-center justify-between px-4 py-3 sm:hidden">
        <div className="flex flex-1 justify-between">
          <button
            onClick={() => handlePageChange(pagination?.prev_page_url)}
            disabled={!pagination?.prev_page_url}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination?.next_page_url)}
            disabled={!pagination?.next_page_url}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:items-center sm:justify-between px-6 py-4">
        {/* Results info */}
        <div className="flex items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {startItem}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {endItem}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalItems}
            </span>{' '}
            results
          </div>
          <div className="ml-4 text-xs text-gray-400 dark:text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          {/* First page button */}
          <button
            onClick={() => handlePageChange(getPageUrl(1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </button>

          {/* Previous page button */}
          <button
            onClick={() => handlePageChange(pagination?.prev_page_url)}
            disabled={!pagination?.prev_page_url}
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                disabled={page === '...'}
                className={`
                  relative inline-flex items-center justify-center min-w-[2rem] h-8 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${page === currentPage
                    ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-md hover:bg-primary-700 dark:hover:bg-primary-600'
                    : page === '...'
                    ? 'bg-transparent text-gray-400 dark:text-gray-500 cursor-default'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                `}
                style={{
                  boxShadow: page === currentPage ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next page button */}
          <button
            onClick={() => handlePageChange(pagination?.next_page_url)}
            disabled={!pagination?.next_page_url}
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>

          {/* Last page button */}
          <button
            onClick={() => handlePageChange(getPageUrl(totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination