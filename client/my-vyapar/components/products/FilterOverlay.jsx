import { FiFilter, FiX, FiSliders } from 'react-icons/fi';
import { MdOutlineCategory, MdSort, MdCheck, MdRefresh } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed left-0 top-0 bottom-0 z-50 w-96 bg-white shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
              <div className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                    <FiFilter className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Refine your search results</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onReset}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <MdRefresh className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-8">
              {/* Categories Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <MdOutlineCategory className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base">Categories</span>
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {categories?.filter(c => c.id !== "All").length || 0} categories
                  </span>
                </div>
                
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {/* All Products Option */}
                  <button
                    onClick={() => {
                      onCategoryChange("All");
                      onClose();
                    }}
                    className={`group relative w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === "All"
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium shadow-sm"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        selectedCategory === "All" ? "bg-blue-500 scale-125" : "bg-gray-300"
                      }`} />
                      All Products
                    </span>
                    {selectedCategory === "All" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                      >
                        <MdCheck className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </button>
                  
                  {/* Category List */}
                  {categories && categories.filter(c => c.id !== "All").map((cat, index) => (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onCategoryChange(cat.id);
                        onClose();
                      }}
                      className={`group relative w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium shadow-sm"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          selectedCategory === cat.id ? "bg-blue-500 scale-125" : "bg-gray-300"
                        }`} />
                        {cat.name}
                      </span>
                      {selectedCategory === cat.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                        >
                          <MdCheck className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Sort By Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <MdSort className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base">Sort By</span>
                  </h3>
                  {sort && (
                    <button
                      onClick={() => onSortChange("")}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FiX className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {[
                    { value: "", label: "Default Sorting", icon: "🔄" },
                    { value: "low", label: "Price: Low to High", icon: "📈" },
                    { value: "high", label: "Price: High to Low", icon: "📉" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center justify-between group ${
                        sort === option.value
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium shadow-sm"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                      {sort === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                        >
                          <MdCheck className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedCategory !== "All" || sort) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 border-t border-gray-200"
                >
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiSliders className="w-3 h-3" />
                      Active Filters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== "All" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">
                          <MdOutlineCategory className="w-3 h-3" />
                          {categories?.find(c => c.id === selectedCategory)?.name || selectedCategory}
                          <button
                            onClick={() => {
                              onCategoryChange("All");
                              onClose();
                            }}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {sort && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm">
                          <MdSort className="w-3 h-3" />
                          {sort === "low" ? "Price: Low to High" : "Price: High to Low"}
                          <button
                            onClick={() => onSortChange("")}
                            className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer with Apply Button (optional) */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-5 mt-4">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <FiFilter className="w-4 h-4" />
                Apply Filters
                {(selectedCategory !== "All" || sort) && (
                  <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {[selectedCategory !== "All", !!sort].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add this CSS to your global styles or component
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export default FilterOverlay;