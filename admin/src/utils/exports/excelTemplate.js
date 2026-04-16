import * as XLSX from 'xlsx'

export const exportToExcel = (data) => {
  const { stats, revenueData, topProducts, recentOrders, company, timeRange } = data
  
  const wb = XLSX.utils.book_new()
  
  // Summary Sheet
  const summaryData = [
    ['DASHBOARD PERFORMANCE REPORT'],
    [`Generated on: ${new Date().toLocaleString()}`],
    [`Company: ${company?.name || 'N/A'}`],
    [`Report Period: ${timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : timeRange === '90d' ? 'Last 3 Months' : 'Last 12 Months'}`],
    [],
    ['KEY METRICS'],
    ['Metric', 'Value', 'Change vs Last Month'],
    ['Total Revenue', `$${Number(stats.revenue).toLocaleString()}`, stats.revenueChange ? `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%` : 'N/A'],
    ['Total Orders', Number(stats.orders).toLocaleString(), stats.ordersChange ? `${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%` : 'N/A'],
    ['Total Products', Number(stats.products).toLocaleString(), stats.productsChange ? `${stats.productsChange > 0 ? '+' : ''}${stats.productsChange}%` : 'N/A'],
    ['Total Customers', Number(stats.customers).toLocaleString(), stats.customersChange ? `${stats.customersChange > 0 ? '+' : ''}${stats.customersChange}%` : 'N/A'],
    ['Low Stock Items', Number(stats.lowStock).toLocaleString(), 'N/A'],
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{wch: 25}, {wch: 20}, {wch: 20}]
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary')
  
  // Revenue Sheet
  const revenueSheetData = [
    ['REVENUE TRENDS'],
    ['Date', 'Revenue ($)'],
    ...revenueData.map(item => [item.date, Number(item.revenue)])
  ]
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData)
  revenueSheet['!cols'] = [{wch: 15}, {wch: 15}]
  XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenue Analysis')
  
  // Top Products Sheet
  const productsSheetData = [
    ['TOP PERFORMING PRODUCTS'],
    ['Rank', 'Product Name', 'Units Sold', 'Revenue ($)'],
    ...topProducts.map((product, index) => [index + 1, product.name, product.sales, Number(product.revenue)])
  ]
  const productsSheet = XLSX.utils.aoa_to_sheet(productsSheetData)
  productsSheet['!cols'] = [{wch: 8}, {wch: 30}, {wch: 12}, {wch: 15}]
  XLSX.utils.book_append_sheet(wb, productsSheet, 'Top Products')
  
  // Orders Sheet
  const ordersSheetData = [
    ['RECENT ORDERS'],
    ['Order ID', 'Customer', 'Amount ($)', 'Status', 'Date'],
    ...recentOrders.map(order => [
      order.orderNumber,
      order.customer?.name || 'Unknown',
      Number(order.total),
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ])
  ]
  const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData)
  ordersSheet['!cols'] = [{wch: 15}, {wch: 25}, {wch: 12}, {wch: 12}, {wch: 15}]
  XLSX.utils.book_append_sheet(wb, ordersSheet, 'Recent Orders')
  
  // Save Excel file
  XLSX.writeFile(wb, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`)
}