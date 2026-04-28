import { FiFilter, FiX } from 'react-icons/fi';
import { MdOutlineCategory, MdSort } from 'react-icons/md';

const FilterOverlay = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  sort, 
  onSortChange,
  onReset 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter className="w-5 h-5" />
            Filters
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={onReset} className="text-sm text-blue-600 hover:text-blue-700">
              Reset
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <MdOutlineCategory className="w-5 h-5" />
              Categories
            </h3>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              <button
                onClick={() => {
                  onCategoryChange("All");
                  onClose();
                }}
                className={`flex justify-between items-center w-full px-3 py-2 rounded-lg text-left transition-all ${
                  selectedCategory === "All"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <span>All Products</span>
              </button>
              {categories && categories.filter(c => c.id !== "All").map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    onClose();
                  }}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg text-left transition-all ${
                    selectedCategory === cat.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <MdSort className="w-5 h-5" />
              Sort By
            </h3>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
            >
              <option value="">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterOverlay;