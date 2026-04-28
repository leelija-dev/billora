import { FiGrid } from 'react-icons/fi';
import { MdOutlineCategory } from 'react-icons/md';

const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }) => {
  // Debug logging
  console.log("🏷️ CategoryTabs render:", {
    categories: categories?.length || 0,
    selectedCategory,
    categoryIds: categories?.map(c => ({ id: c.id, name: c.name }))
  });

  const handleCategoryClick = (categoryId) => {
    console.log("🏷️ Category clicked:", { categoryId, currentSelected: selectedCategory });
    onCategoryChange(categoryId);
  };

  return (
    <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-2">
      <button
        onClick={() => handleCategoryClick("All")}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
          selectedCategory === "All"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        <FiGrid className="w-4 h-4" />
        All Products
      </button>
      {categories && categories.filter(c => c.id !== "All").map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            selectedCategory === category.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <MdOutlineCategory className="w-4 h-4" />
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;