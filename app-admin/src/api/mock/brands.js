// Mock brands, categories, and units data and functions
let mockBrandsList = [
  {
    id: 1,
    user_id: 1,
    name: 'Nike',
    is_active: true,
    description: 'Sports and athletic wear brand',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    name: 'Levis',
    is_active: true,
    description: 'Denim and casual wear brand',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    name: 'Adidas',
    is_active: true,
    description: 'Sports and lifestyle brand',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockCategoriesList = [
  {
    id: 1,
    user_id: 1,
    name: 'T-Shirts',
    is_active: true,
    description: 'Cotton and blended t-shirts',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    name: 'Jeans',
    is_active: true,
    description: 'Denim jeans and trousers',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    name: 'Sports Shoes',
    is_active: true,
    description: 'Athletic and sports footwear',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockUnitsList = [
  {
    id: 1,
    user_id: 1,
    code: 'PCS',
    name: 'Pieces',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    code: 'KG',
    name: 'Kilograms',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    code: 'MTR',
    name: 'Meters',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    user_id: 1,
    code: 'LTR',
    name: 'Liters',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockBrands = {
  get: async (endpoint, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint === '/brands') {
      let filteredBrands = [...mockBrandsList];
      
      if (params.search) {
        filteredBrands = filteredBrands.filter(b => 
          b.name.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      return {
        data: {
          success: true,
          brands: filteredBrands,
        }
      };
    }

    if (endpoint.startsWith('/brands/') && endpoint.endsWith('/')) {
      // Handle /brands/categories/ and /brands/units/
      const resource = endpoint.split('/')[2];
      
      if (resource === 'categories') {
        let filteredCategories = [...mockCategoriesList];
        
        if (params.search) {
          filteredCategories = filteredCategories.filter(c => 
            c.name.toLowerCase().includes(params.search.toLowerCase())
          );
        }

        return {
          data: {
            success: true,
            categories: filteredCategories,
          }
        };
      }

      if (resource === 'units') {
        let filteredUnits = [...mockUnitsList];
        
        if (params.search) {
          filteredUnits = filteredUnits.filter(u => 
            u.name.toLowerCase().includes(params.search.toLowerCase()) ||
            u.code.toLowerCase().includes(params.search.toLowerCase())
          );
        }

        return {
          data: {
            success: true,
            units: filteredUnits,
          }
        };
      }
    }

    if (endpoint.startsWith('/brands/') && !endpoint.includes('/categories') && !endpoint.includes('/units')) {
      const id = parseInt(endpoint.split('/')[2]);
      const brand = mockBrandsList.find(b => b.id === id);
      
      if (!brand) {
        throw {
          response: {
            data: { message: 'Brand not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          brand: brand,
        }
      };
    }

    if (endpoint.startsWith('/brands/categories/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const category = mockCategoriesList.find(c => c.id === id);
      
      if (!category) {
        throw {
          response: {
            data: { message: 'Category not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          category: category,
        }
      };
    }

    if (endpoint.startsWith('/brands/units/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const unit = mockUnitsList.find(u => u.id === id);
      
      if (!unit) {
        throw {
          response: {
            data: { message: 'Unit not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          unit: unit,
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  post: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (endpoint === '/brands/store') {
      const newBrand = {
        id: mockBrandsList.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockBrandsList.push(newBrand);

      return {
        data: {
          success: true,
          message: 'Brand created successfully',
          brand: newBrand,
        }
      };
    }

    if (endpoint === '/brands/categories/store') {
      const newCategory = {
        id: mockCategoriesList.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockCategoriesList.push(newCategory);

      return {
        data: {
          success: true,
          message: 'Category created successfully',
          category: newCategory,
        }
      };
    }

    if (endpoint === '/brands/units/store') {
      const newUnit = {
        id: mockUnitsList.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockUnitsList.push(newUnit);

      return {
        data: {
          success: true,
          message: 'Unit created successfully',
          unit: newUnit,
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  put: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (endpoint.startsWith('/brands/') && !endpoint.includes('/categories') && !endpoint.includes('/units')) {
      const id = parseInt(endpoint.split('/')[2]);
      const brandIndex = mockBrandsList.findIndex(b => b.id === id);

      if (brandIndex === -1) {
        throw {
          response: {
            data: { message: 'Brand not found' }
          }
        };
      }

      mockBrandsList[brandIndex] = { 
        ...mockBrandsList[brandIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      return {
        data: {
          success: true,
          message: 'Brand updated successfully',
          brand: mockBrandsList[brandIndex],
        }
      };
    }

    if (endpoint.startsWith('/brands/categories/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const categoryIndex = mockCategoriesList.findIndex(c => c.id === id);

      if (categoryIndex === -1) {
        throw {
          response: {
            data: { message: 'Category not found' }
          }
        };
      }

      mockCategoriesList[categoryIndex] = { 
        ...mockCategoriesList[categoryIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      return {
        data: {
          success: true,
          message: 'Category updated successfully',
          category: mockCategoriesList[categoryIndex],
        }
      };
    }

    if (endpoint.startsWith('/brands/units/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const unitIndex = mockUnitsList.findIndex(u => u.id === id);

      if (unitIndex === -1) {
        throw {
          response: {
            data: { message: 'Unit not found' }
          }
        };
      }

      mockUnitsList[unitIndex] = { 
        ...mockUnitsList[unitIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      return {
        data: {
          success: true,
          message: 'Unit updated successfully',
          unit: mockUnitsList[unitIndex],
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  delete: async (endpoint) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.startsWith('/brands/') && !endpoint.includes('/categories') && !endpoint.includes('/units')) {
      const id = parseInt(endpoint.split('/')[2]);
      const brandIndex = mockBrandsList.findIndex(b => b.id === id);

      if (brandIndex === -1) {
        throw {
          response: {
            data: { message: 'Brand not found' }
          }
        };
      }

      mockBrandsList.splice(brandIndex, 1);

      return {
        data: {
          success: true,
          message: 'Brand deleted successfully',
        }
      };
    }

    if (endpoint.startsWith('/brands/categories/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const categoryIndex = mockCategoriesList.findIndex(c => c.id === id);

      if (categoryIndex === -1) {
        throw {
          response: {
            data: { message: 'Category not found' }
          }
        };
      }

      mockCategoriesList.splice(categoryIndex, 1);

      return {
        data: {
          success: true,
          message: 'Category deleted successfully',
        }
      };
    }

    if (endpoint.startsWith('/brands/units/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const unitIndex = mockUnitsList.findIndex(u => u.id === id);

      if (unitIndex === -1) {
        throw {
          response: {
            data: { message: 'Unit not found' }
          }
        };
      }

      mockUnitsList.splice(unitIndex, 1);

      return {
        data: {
          success: true,
          message: 'Unit deleted successfully',
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },
};

export { mockBrands };
