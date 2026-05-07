// components/common/SearchSelect/SearchSelect.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiChevronDown } from 'react-icons/fi'

const SearchSelect = ({
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Search...',
  required = false,
  disabled = false,
  className = '',
  displayKey = 'label',
  valueKey = 'value',
  onSearchChange,
  isLoading = false,
  renderOption,
  minSearchLength = 0,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const searchInputRef = useRef(null)

  // Find selected option
  const selectedOption = Array.isArray(options) 
    ? options.find(opt => opt[valueKey] === value)
    : null
  
  const displayValue = selectedOption ? selectedOption[displayKey] : ''

  // Filter options based on search term - use parent filtered options when provided
  const filteredOptions = React.useMemo(() => {
    // If onSearchChange is provided, use parent's filtered options
    if (onSearchChange) {
      return options
    }
    
    if (!Array.isArray(options)) return []
    
    if (!searchTerm.trim()) {
      return options
    }
    
    const searchLower = searchTerm.toLowerCase()
    return options.filter(option => {
      const labelMatch = option[displayKey]?.toLowerCase().includes(searchLower)
      const descriptionMatch = option.description?.toLowerCase().includes(searchLower)
      const subtextMatch = option.subtext?.toLowerCase().includes(searchLower)
      
      return labelMatch || descriptionMatch || subtextMatch
    })
  }, [options, searchTerm, displayKey, onSearchChange])

  // Handle option selection
  const handleSelect = (selectedValue, selectedOption) => {
    onChange(selectedValue, selectedOption)
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(-1)
  }

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation()
    onChange('', null)
    setSearchTerm('')
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearchChange && value.length >= minSearchLength) {
      onSearchChange(value)
    }
    setHighlightedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const option = filteredOptions[highlightedIndex]
          handleSelect(option[valueKey], option)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Default option renderer
  const defaultRenderOption = (option, index, isHighlighted, isSelected) => (
    <div
      key={option[valueKey]}
      className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
        isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      } ${isHighlighted ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {option[displayKey]}
          </div>
          {option.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {option.description}
            </div>
          )}
          {option.subtext && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {option.subtext}
            </div>
          )}
        </div>
        {option.rightContent && (
          <div className="text-right ml-3">
            {option.rightContent}
          </div>
        )}
      </div>
    </div>
  )

  const renderOptionContent = renderOption || defaultRenderOption

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <div
          className={`relative w-full bg-white dark:bg-gray-700 border ${
            error
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          } rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
            disabled 
              ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800' 
              : 'hover:border-blue-400 dark:hover:border-blue-500'
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between px-4 py-2.5 min-h-[42px]">
            <span className={`flex-1 truncate ${
              !displayValue ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
            }`}>
              {displayValue || placeholder}
            </span>
            <div className="flex items-center space-x-1">
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <FiX className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
              <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} />
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    placeholder={`Search ${label?.toLowerCase() || ''}...`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                  </div>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isHighlighted = index === highlightedIndex
                    const isSelected = option[valueKey] === value
                    return (
                      <div
                        key={option[valueKey]}
                        onClick={() => handleSelect(option[valueKey], option)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {renderOptionContent(option, index, isHighlighted, isSelected)}
                      </div>
                    )
                  })
                ) : (
                  <div className="px-4 py-8 text-center">
                    {searchTerm ? (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          No results found for "{searchTerm}"
                        </p>
                        {props.onCreateNew && (
                          <button
                            type="button"
                            onClick={() => props.onCreateNew(searchTerm)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          >
                            <FiSearch className="w-4 h-4 mr-2" />
                            Create "{searchTerm}"
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          No {label?.toLowerCase() || 'options'} available
                        </p>
                        {props.onCreateNew && (
                          <button
                            type="button"
                            onClick={() => props.onCreateNew('')}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          >
                            <FiSearch className="w-4 h-4 mr-2" />
                            Add New {label}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default SearchSelect