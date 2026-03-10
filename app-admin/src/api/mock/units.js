// Mock units data and functions
let mockUnitsList = [
  { id: 1, user_id: 1, code: 'PCS', name: 'Pieces', created_by: 1 },
  { id: 2, user_id: 1, code: 'KG', name: 'Kilograms', created_by: 1 },
  { id: 3, user_id: 1, code: 'L', name: 'Liters', created_by: 1 },
  { id: 4, user_id: 1, code: 'M', name: 'Meters', created_by: 1 },
  { id: 5, user_id: 1, code: 'BOX', name: 'Box', created_by: 1 },
];

const mockUnits = {
  get: async (endpoint, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));

    if (endpoint === '/brands/units') {
      let filteredUnits = [...mockUnitsList];
      
      // Apply filters
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
    await new Promise(resolve => setTimeout(resolve, 300));

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
    await new Promise(resolve => setTimeout(resolve, 300));

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
    await new Promise(resolve => setTimeout(resolve, 200));

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

export { mockUnits };
