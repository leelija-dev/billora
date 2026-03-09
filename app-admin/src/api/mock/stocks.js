// Mock stocks data and functions
let mockStocksList = [
  {
    id: 1,
    user_id: 1,
    product_id: 1,
    quantity: 150,
    selling_price: 29.99,
    product_package_id: null,
    purchase_price: 15.50,
    unit_id: 1,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    product_id: 2,
    quantity: 75,
    selling_price: 79.99,
    product_package_id: null,
    purchase_price: 45.00,
    unit_id: 1,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    product_id: 1,
    quantity: 25,
    selling_price: 32.99,
    product_package_id: null,
    purchase_price: 18.00,
    unit_id: 1,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockStockMovements = [
  {
    id: 1,
    stock_id: 1,
    type: 'in',
    quantity: 50,
    reference: 'Purchase Order #PO001',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    stock_id: 1,
    type: 'out',
    quantity: 10,
    reference: 'Sale Order #SO001',
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 3,
    stock_id: 2,
    type: 'in',
    quantity: 25,
    reference: 'Purchase Order #PO002',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockStocks = {
  get: async (endpoint, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint === '/brands/stocks/') {
      let filteredStocks = [...mockStocksList];
      
      // Apply filters
      if (params.product_id) {
        filteredStocks = filteredStocks.filter(s => s.product_id == params.product_id);
      }
      if (params.user_id) {
        filteredStocks = filteredStocks.filter(s => s.user_id == params.user_id);
      }
      if (params.low_stock) {
        filteredStocks = filteredStocks.filter(s => s.quantity < params.low_stock);
      }

      return {
        data: {
          success: true,
          stocks: filteredStocks,
        }
      };
    }

    if (endpoint.startsWith('/brands/stocks/') && !endpoint.includes('/movements')) {
      const id = parseInt(endpoint.split('/')[3]);
      const stock = mockStocksList.find(s => s.id === id);
      
      if (!stock) {
        throw {
          response: {
            data: { message: 'Stock not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          stock: stock,
        }
      };
    }

    if (endpoint.includes('/movements')) {
      const stockId = parseInt(endpoint.split('/')[3]);
      const movements = mockStockMovements.filter(m => m.stock_id === stockId);

      return {
        data: {
          success: true,
          movements: movements,
        }
      };
    }

    if (endpoint === '/brands/stocks/low-stock') {
      const threshold = params.threshold || 10;
      const lowStockItems = mockStocksList.filter(s => s.quantity < threshold);

      return {
        data: {
          success: true,
          lowStockItems: lowStockItems,
          threshold: threshold,
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

    if (endpoint === '/brands/stocks/store') {
      const newStock = {
        id: mockStocksList.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockStocksList.push(newStock);

      // Add stock movement
      mockStockMovements.push({
        id: mockStockMovements.length + 1,
        stock_id: newStock.id,
        type: 'in',
        quantity: data.quantity,
        reference: 'Initial Stock',
        created_at: new Date().toISOString(),
      });

      return {
        data: {
          success: true,
          message: 'Stock created successfully',
          stock: newStock,
        }
      };
    }

    if (endpoint.includes('/add-stock/')) {
      const id = parseInt(endpoint.split('/')[4]);
      const stockIndex = mockStocksList.findIndex(s => s.id === id);

      if (stockIndex === -1) {
        throw {
          response: {
            data: { message: 'Stock not found' }
          }
        };
      }

      const { quantity, selling_price } = data;
      mockStocksList[stockIndex].quantity += quantity;
      if (selling_price) {
        mockStocksList[stockIndex].selling_price = selling_price;
      }
      mockStocksList[stockIndex].updated_at = new Date().toISOString();

      // Add stock movement
      mockStockMovements.push({
        id: mockStockMovements.length + 1,
        stock_id: id,
        type: 'in',
        quantity: quantity,
        reference: 'Stock Addition',
        created_at: new Date().toISOString(),
      });

      return {
        data: {
          success: true,
          message: 'Stock added successfully',
          stock: mockStocksList[stockIndex],
        }
      };
    }

    if (endpoint === '/brands/stocks/transfer') {
      const { from_stock_id, to_stock_id, quantity } = data;
      
      const fromStockIndex = mockStocksList.findIndex(s => s.id === from_stock_id);
      const toStockIndex = mockStocksList.findIndex(s => s.id === to_stock_id);

      if (fromStockIndex === -1 || toStockIndex === -1) {
        throw {
          response: {
            data: { message: 'Source or destination stock not found' }
          }
        };
      }

      if (mockStocksList[fromStockIndex].quantity < quantity) {
        throw {
          response: {
            data: { message: 'Insufficient stock quantity' }
          }
        };
      }

      mockStocksList[fromStockIndex].quantity -= quantity;
      mockStocksList[toStockIndex].quantity += quantity;
      mockStocksList[fromStockIndex].updated_at = new Date().toISOString();
      mockStocksList[toStockIndex].updated_at = new Date().toISOString();

      // Add stock movements
      mockStockMovements.push({
        id: mockStockMovements.length + 1,
        stock_id: from_stock_id,
        type: 'out',
        quantity: quantity,
        reference: `Transfer to Stock #${to_stock_id}`,
        created_at: new Date().toISOString(),
      });

      mockStockMovements.push({
        id: mockStockMovements.length + 2,
        stock_id: to_stock_id,
        type: 'in',
        quantity: quantity,
        reference: `Transfer from Stock #${from_stock_id}`,
        created_at: new Date().toISOString(),
      });

      return {
        data: {
          success: true,
          message: 'Stock transferred successfully',
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

    if (endpoint.startsWith('/brands/stocks/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const stockIndex = mockStocksList.findIndex(s => s.id === id);

      if (stockIndex === -1) {
        throw {
          response: {
            data: { message: 'Stock not found' }
          }
        };
      }

      const oldQuantity = mockStocksList[stockIndex].quantity;
      mockStocksList[stockIndex] = { 
        ...mockStocksList[stockIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      // Add stock movement if quantity changed
      if (data.quantity && data.quantity !== oldQuantity) {
        const quantityDiff = data.quantity - oldQuantity;
        mockStockMovements.push({
          id: mockStockMovements.length + 1,
          stock_id: id,
          type: quantityDiff > 0 ? 'in' : 'out',
          quantity: Math.abs(quantityDiff),
          reference: 'Stock Adjustment',
          created_at: new Date().toISOString(),
        });
      }

      return {
        data: {
          success: true,
          message: 'Stock updated successfully',
          stock: mockStocksList[stockIndex],
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

    if (endpoint.startsWith('/brands/stocks/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const stockIndex = mockStocksList.findIndex(s => s.id === id);

      if (stockIndex === -1) {
        throw {
          response: {
            data: { message: 'Stock not found' }
          }
        };
      }

      mockStocksList.splice(stockIndex, 1);

      return {
        data: {
          success: true,
          message: 'Stock deleted successfully',
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

export { mockStocks };
