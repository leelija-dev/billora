// Central export for all mock data
export * from './mockAuth';
export * from './mockProducts';
export * from './mockOrders';
export * from './mockCustomers';
export * from './mockInventory';
export * from './mockInvoices';
export * from './mockDashboard';
export * from './mockBilling';

// Re-export for convenience
import { mockAuth } from './mockAuth';
import { mockProductService } from './mockProducts';
import { mockOrderService } from './mockOrders';
import { mockCustomerService } from './mockCustomers';
import { mockInventoryService } from './mockInventory';
import { mockInvoiceService } from './mockInvoices';
import { mockDashboardService } from './mockDashboard';
import { mockBillingService } from './mockBilling';

export const mockServices = {
  auth: mockAuth,
  products: mockProductService,
  orders: mockOrderService,
  customers: mockCustomerService,
  inventory: mockInventoryService,
  invoices: mockInvoiceService,
  dashboard: mockDashboardService,
  billing: mockBillingService,
};

export default mockServices;