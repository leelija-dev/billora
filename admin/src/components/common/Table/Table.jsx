import React from 'react'
import Spinner from '../Spinner/Spinner'
import { ChevronUp, ChevronDown } from 'lucide-react'

const Table = ({ 
  columns, 
  data, 
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  stickyHeader = true,
  bordered = false,
  compact = false,
  className = ''
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <Spinner size="lg" />
      </div>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <svg 
            className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 10h18M3 14h18M3 18h18M3 6h18" 
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            {emptyMessage}
          </p>
        </div>
      </div>
    )
  }

  // console.log("Table data:", data)

  const handleSort = (column) => {
    if (!sortable || !onSort || !column.sortable) return
    
    const newDirection = 
      sortColumn === column.accessor && sortDirection === 'asc' 
        ? 'desc' 
        : 'asc'
    
    onSort(column.accessor, newDirection)
  }

  const getSortIcon = (column) => {
    if (!sortable || !column.sortable) return null
    
    if (sortColumn !== column.accessor) {
      return (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronUp className="w-4 h-4 text-gray-400" />
        </div>
      )
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      : <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
  }

  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-xl shadow-sm 
      border ${bordered ? 'border-gray-200 dark:border-gray-700' : 'border-transparent'}
      overflow-hidden
      ${className}
    `}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className={`
            overflow-hidden 
            ${stickyHeader ? 'max-h-[600px] overflow-y-auto' : ''}
          `}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`
                bg-gray-50 dark:bg-gray-700/50
                ${stickyHeader ? 'sticky top-0 z-10' : ''}
              `}>
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.accessor || index}
                      onClick={() => handleSort(column)}
                      className={`
                        group
                        px-6 
                        ${compact ? 'py-2' : 'py-3.5'} 
                        text-left 
                        text-xs 
                        font-semibold 
                        text-gray-700 dark:text-gray-300 
                        uppercase 
                        tracking-wider
                        whitespace-nowrap
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : ''}
                        ${sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors' : ''}
                      `}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.header}</span>
                        {sortable && column.sortable && (
                          <div className="flex flex-col">
                            {getSortIcon(column)}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {data.map((row, rowIndex) => (
                  <tr
                    key={row.id || rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`
                      group
                      ${onRowClick ? 'cursor-pointer' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-700/30 
                      transition-all duration-150
                    `}
                  >
                    {columns.map((column, colIndex) => {
                      const value = column.accessor 
                        ? row[column.accessor] 
                        : null
                      
                      return (
                        <td
                          key={column.accessor || colIndex}
                          className={`
                            px-6 
                            ${compact ? 'py-2' : 'py-4'} 
                            text-sm 
                            text-gray-900 dark:text-gray-100
                            ${column.align === 'center' ? 'text-center' : ''}
                            ${column.align === 'right' ? 'text-right' : ''}
                            ${column.wrap ? 'whitespace-normal' : 'whitespace-nowrap'}
                          `}
                        >
                          {column.cell
                            ? column.cell(value, row, rowIndex)
                            : value
                          }
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Optional Footer */}
      {data.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">{data.length}</span> results
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table