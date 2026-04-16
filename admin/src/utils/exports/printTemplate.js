export const printDashboard = (data) => {
  const { stats, revenueData, topProducts, recentOrders, company, timeRange } = data
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'processing': return '#3b82f6'
      default: return '#6b7280'
    }
  }
  
  const printWindow = window.open('', '_blank', 'width=1200,height=800')
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dashboard Report - ${company?.name || 'Business'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', 'Arial', sans-serif; background: white; padding: 40px; line-height: 1.6; }
        @media print { body { padding: 20px; } .page-break { page-break-before: always; } .no-break { page-break-inside: avoid; } }
        .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background: white; }
        .stat-value { font-size: 28px; font-weight: bold; color: #3b82f6; margin: 10px 0; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section-title { font-size: 20px; font-weight: 600; color: #3b82f6; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .footer { margin-top: 50px; padding-top: 20px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        @media print { .stats-grid { gap: 15px; } .stat-card { break-inside: avoid; } .section { break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${company?.name || 'Business'} - Dashboard Report</h1>
        <p style="margin-top: 10px;">Generated on: ${new Date().toLocaleString()}</p>
        <p>Report Period: ${timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : timeRange === '90d' ? 'Last 3 Months' : 'Last 12 Months'}</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div style="font-size: 12px; color: #6b7280;">TOTAL REVENUE</div>
          <div class="stat-value">$${Number(stats.revenue).toLocaleString()}</div>
          ${stats.revenueChange ? `<div style="font-size: 12px; color: ${stats.revenueChange > 0 ? '#10b981' : '#ef4444'}">${stats.revenueChange > 0 ? '↑' : '↓'} ${Math.abs(stats.revenueChange)}% vs last month</div>` : ''}
        </div>
        <div class="stat-card">
          <div style="font-size: 12px; color: #6b7280;">TOTAL ORDERS</div>
          <div class="stat-value">${Number(stats.orders).toLocaleString()}</div>
          ${stats.ordersChange ? `<div style="font-size: 12px; color: ${stats.ordersChange > 0 ? '#10b981' : '#ef4444'}">${stats.ordersChange > 0 ? '↑' : '↓'} ${Math.abs(stats.ordersChange)}% vs last month</div>` : ''}
        </div>
        <div class="stat-card">
          <div style="font-size: 12px; color: #6b7280;">ACTIVE PRODUCTS</div>
          <div class="stat-value">${Number(stats.products).toLocaleString()}</div>
          ${stats.productsChange ? `<div style="font-size: 12px; color: ${stats.productsChange > 0 ? '#10b981' : '#ef4444'}">${stats.productsChange > 0 ? '↑' : '↓'} ${Math.abs(stats.productsChange)}% vs last month</div>` : ''}
        </div>
        <div class="stat-card">
          <div style="font-size: 12px; color: #6b7280;">TOTAL CUSTOMERS</div>
          <div class="stat-value">${Number(stats.customers).toLocaleString()}</div>
          ${stats.customersChange ? `<div style="font-size: 12px; color: ${stats.customersChange > 0 ? '#10b981' : '#ef4444'}">${stats.customersChange > 0 ? '↑' : '↓'} ${Math.abs(stats.customersChange)}% vs last month</div>` : ''}
        </div>
      </div>
      
      ${stats.lowStock > 0 ? `
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 30px; border-radius: 8px;">
        <strong>⚠️ Low Stock Alert:</strong> ${stats.lowStock} products are running low on stock.
      </div>
      ` : ''}
      
      <div class="section">
        <h2 class="section-title">Revenue Trends</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th style="text-align: right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${revenueData.slice(0, 15).map(item => `
              <tr>
                <td>${item.date}</td>
                <td style="text-align: right; font-weight: 500;">$${Number(item.revenue).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2 class="section-title">Top Products</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product Name</th>
              <th style="text-align: center">Units Sold</th>
              <th style="text-align: right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${topProducts.slice(0, 10).map((product, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td style="text-align: center">${product.sales.toLocaleString()}</td>
                <td style="text-align: right; font-weight: 500;">$${Number(product.revenue).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2 class="section-title">Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th style="text-align: right">Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${recentOrders.slice(0, 15).map(order => `
              <tr>
                <td>#${order.orderNumber}</td>
                <td>${order.customer?.name || 'Unknown'}</td>
                <td style="text-align: right; font-weight: 500;">$${Number(order.total).toLocaleString()}</td>
                <td>
                  <span class="status-badge" style="background: ${getStatusColor(order.status)}20; color: ${getStatusColor(order.status)};">
                    ${order.status}
                  </span>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>This report was automatically generated by the Business Intelligence Dashboard System.</p>
        <p>© ${new Date().getFullYear()} ${company?.name || 'Business Name'} - All Rights Reserved</p>
      </div>
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.print()
  printWindow.close()
}