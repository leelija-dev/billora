import { FiGrid, FiAlertCircle } from 'react-icons/fi';
import { MdOutlineCategory } from 'react-icons/md';
import { useState } from 'react';

const CategoryTabs = ({ categories, selectedCategory, onCategoryChange, products = [], allProducts = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // Debug logging
  console.log("🏷️ CategoryTabs render:", {
    categories: categories?.length || 0,
    selectedCategory,
    categoryIds: categories?.map(c => ({ id: c.id, name: c.name }))
  });

  // Use allProducts for checking if a category has products (not filtered products)
  const productsForCount = allProducts.length > 0 ? allProducts : products;
  
  // Get product counts per category (based on all products, not filtered)
  const getCategoryProductCount = (categoryId) => {
    if (categoryId === "All") {
      return productsForCount.length;
    }
    return productsForCount.filter(product => 
      product.category_id === categoryId || product.category === categoryId
    ).length;
  };

  // Check if category has products (based on all products)
  const hasProducts = (categoryId) => {
    if (categoryId === "All") return productsForCount.length > 0;
    return productsForCount.some(product => 
      product.category_id === categoryId || product.category === categoryId
    );
  };

  // Show all categories, not just those with products in current view
  const availableCategories = categories?.filter(category => {
    if (category.id === "All") return false;
    // Keep all categories that have at least one product in the complete product list
    return hasProducts(category.id);
  }) || [];

  const handleCategoryClick = (categoryId) => {
    // Allow clicking on any category that has products in the complete list
    if (hasProducts(categoryId)) {
      console.log("🏷️ Category clicked:", { categoryId, currentSelected: selectedCategory });
      onCategoryChange(categoryId);
    }
  };

  // Don't render anything if no categories have products
  if (availableCategories.length === 0 && productsForCount.length === 0) {
    return null;
  }

  return (
    <div className="mb-[10px]">
      {/* Desktop View */}
      <div className="hidden md:flex gap-3 overflow-x-auto p-[0px_14px_20px_14px] scrollbar-thin scrollbar-thumb-gray-300">
        {/* All Products Tab - Always visible */}
        <button
          onClick={() => handleCategoryClick("All")}
          onMouseEnter={() => setHoveredCategory("All")}
          onMouseLeave={() => setHoveredCategory(null)}
          className={`
            relative px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 
            flex items-center gap-2 font-medium text-sm
            ${selectedCategory === "All"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md"
            }
          `}
        >
          <FiGrid className={`w-4 h-4 ${selectedCategory === "All" ? "text-white" : "text-gray-500"}`} />
          <span>All Products</span>
          
          {hoveredCategory === "All" && selectedCategory !== "All" && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full"></div>
          )}
        </button>

        {/* All Categories - Always show all categories that have products */}
        {availableCategories.map((category) => {
          const productCount = getCategoryProductCount(category.id);
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`
                relative px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 
                flex items-center gap-2 font-medium text-sm
                ${isSelected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                }
              `}
            >
              <MdOutlineCategory className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-500"}`} />
              <span>{category.name}</span>
             
              {hoveredCategory === category.id && !isSelected && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile View - Scrollable horizontal tabs */}
      {/* <div className="md:hidden overflow-x-auto pb-3 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300">
  
        
          <button
            onClick={() => handleCategoryClick("All")}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 
              flex items-center gap-1.5 text-sm font-medium
              ${selectedCategory === "All"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200"
              }
            `}
          >
            <FiGrid className="w-3.5 h-3.5" />
            <span>All</span>
            
          </button>

        
          {availableCategories.map((category) => {
            const productCount = getCategoryProductCount(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 
                  flex items-center gap-1.5 text-sm font-medium
                  ${isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200"
                  }
                `}
              >
                <MdOutlineCategory className="w-3.5 h-3.5" />
                <span>{category.name}</span>
                
              </button>
            );
          })}
      
      </div> */}
    </div>
  );
};

export default CategoryTabs;