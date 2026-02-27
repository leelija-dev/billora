import React from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import Button from '../../common/Button/Button'

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value })
  }

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value })
  }

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value })
  }

  const hasActiveFilters = filters.search || filters.category || filters.status

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Select
            options={[
              { value: '', label: 'All Categories' },
              { value: 'electronics', label: 'Electronics' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'books', label: 'Books' },
              { value: 'food', label: 'Food' },
              { value: 'other', label: 'Other' },
            ]}
            value={filters.category || ''}
            onChange={handleCategoryChange}
            className="min-w-[150px]"
          />
          
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="min-w-[120px]"
          />
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              icon={FiX}
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductFilters