// Mock products data and functions
let mockProductsList = [
  {
    id: 1,
    user_id: 1,
    sku: 'PRD001',
    name: 'Classic White T-Shirt',
    brand_id: 1,
    category_id: 1,
    unit_amount: 1,
    unit_id: 1,
    selling_price: 29.99,
    purchase_price: 15.50,
    gst_percentage: 5,
    discount_percentage: 0,
    description: 'High quality cotton t-shirt',
    is_active: true,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    sku: 'PRD002',
    name: 'Blue Denim Jeans',
    brand_id: 2,
    category_id: 2,
    unit_amount: 1,
    unit_id: 1,
    selling_price: 79.99,
    purchase_price: 45.00,
    gst_percentage: 5,
    discount_percentage: 10,
    description: 'Comfortable denim jeans',
    is_active: true,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockBrands = [
  { id: 1, user_id: 1, name: 'Nike', is_active: true, description: 'Sports brand', created_by: 1 },
  { id: 2, user_id: 1, name: 'Levis', is_active: true, description: 'Denim brand', created_by: 1 },
];

let mockCategories = [
  { id: 1, user_id: 1, name: 'T-Shirts', is_active: true, description: 'Cotton t-shirts', created_by: 1 },
  { id: 2, user_id: 1, name: 'Jeans', is_active: true, description: 'Denim jeans', created_by: 1 },
];

let mockUnits = [
  { id: 1, user_id: 1, code: 'PCS', name: 'Pieces', created_by: 1 },
  { id: 2, user_id: 1, code: 'KG', name: 'Kilograms', created_by: 1 },
];

const mockProducts = {
  get: async (endpoint, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint === '/products') {
      let filteredProducts = [...mockProductsList];
      
      // Apply filters
      if (params.brand_id) {
        filteredProducts = filteredProducts.filter(p => p.brand_id == params.brand_id);
      }
      if (params.category_id) {
        filteredProducts = filteredProducts.filter(p => p.category_id == params.category_id);
      }
      if (params.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(params.search.toLowerCase()) ||
          p.sku.toLowerCase().includes(params.search.toLowerCase())
        );
      }

      return {
        data: {
          success: true,
          products: filteredProducts,
          brands: mockBrands,
          categories: mockCategories,
          units: mockUnits,
        }
      };
    }

    if (endpoint.startsWith('/products/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const product = mockProductsList.find(p => p.id === id);
      
      if (!product) {
        throw {
          response: {
            data: { message: 'Product not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          product: { ...product, brand: mockBrands.find(b => b.id === product.brand_id) },
        }
      };
    }

    if (endpoint === '/products/categories') {
      return {
        data: {
          success: true,
          categories: mockCategories,
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

    if (endpoint === '/products/store') {
      const newProduct = {
        id: mockProductsList.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockProductsList.push(newProduct);

      return {
        data: {
          success: true,
          message: 'Product created successfully',
          product: newProduct,
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

    if (endpoint.startsWith('/products/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const productIndex = mockProductsList.findIndex(p => p.id === id);

      if (productIndex === -1) {
        throw {
          response: {
            data: { message: 'Product not found' }
          }
        };
      }

      mockProductsList[productIndex] = { 
        ...mockProductsList[productIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      return {
        data: {
          success: true,
          message: 'Product updated successfully',
          product: mockProductsList[productIndex],
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

    if (endpoint.startsWith('/products/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const productIndex = mockProductsList.findIndex(p => p.id === id);

      if (productIndex === -1) {
        throw {
          response: {
            data: { message: 'Product not found' }
          }
        };
      }

      mockProductsList.splice(productIndex, 1);

      return {
        data: {
          success: true,
          message: 'Product deleted successfully',
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

export { mockProducts };
