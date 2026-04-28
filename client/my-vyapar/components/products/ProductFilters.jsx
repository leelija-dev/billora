import { MdSort } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';

const ProductFilters = ({ 
  selectedItemsCount, 
  crossCategoryCount, 
  sort, 
  onSortChange 
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {selectedItemsCount > 0 && (
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
            <FiCheck className="w-3 h-3" />
            {selectedItemsCount} selected
          </span>
        )}
        {crossCategoryCount > 0 && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            +{crossCategoryCount} from other categories
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <MdSort className="w-4 h-4 text-gray-500" />
        <label className="text-sm text-gray-500">Sort by:</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;