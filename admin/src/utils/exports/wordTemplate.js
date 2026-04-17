export const generateProfessionalWord = (data) => {
  const { stats, revenueData, topProducts, recentOrders, company, timeRange } = data
  
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'processing': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Dashboard Report - ${company?.name || 'Business'}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', 'Arial', sans-serif; background: #ffffff; padding: 40px; line-height: 1.6; color: #1f2937; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; position: relative; overflow: hidden; }
        .header h1 { font-size: 28px; margin-bottom: 10px; font-weight: 600; }
        .header .subtitle { font-size: 14px; opacity: 0.9; }
        .header .company-info { margin-top: 15px; font-size: 12px; opacity: 0.8; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-icon { font-size: 32px; margin-bottom: 10px; }
        .stat-value { font-size: 28px; font-weight: bold; color: #3b82f6; margin: 10px 0; }
        .stat-label { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-change { font-size: 12px; margin-top: 8px; display: inline-block; padding: 2px 8px; border-radius: 12px; }
        .change-positive { background: #d1fae5; color: #065f46; }
        .change-negative { background: #fee2e2; color: #991b1b; }
        .alert-banner { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 8px; margin-bottom: 30px; display: flex; align-items: center; gap: 12px; }
        .alert-icon { font-size: 24px; }
        .alert-content { flex: 1; }
        .alert-title { font-weight: 600; color: #92400e; margin-bottom: 4px; }
        .alert-message { font-size: 13px; color: #b45309; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section-title { font-size: 20px; font-weight: 600; color: #3b82f6; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
        .section-subtitle { font-size: 14px; color: #6b7280; margin-bottom: 20px; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        .data-table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; border: 1px solid #e5e7eb; }
        .data-table td { padding: 10px 12px; border: 1px solid #e5e7eb; color: #4b5563; }
        .data-table tr:hover { background: #f9fafb; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; text-transform: capitalize; }
        .footer { margin-top: 50px; padding-top: 20px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        @media print { body { padding: 0; } .stat-card { break-inside: avoid; } .section { break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Business Intelligence Dashboard</h1>
        <div class="subtitle">Comprehensive Performance Report</div>
        <div class="company-info">
          <strong>${company?.name || 'Business Name'}</strong> | 
          Report Period: ${timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : timeRange === '90d' ? 'Last 3 Months' : 'Last 12 Months'} | 
          Generated: ${new Date().toLocaleString()}
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">$${Number(stats.revenue).toLocaleString()}</div>
          <div class="stat-label">Total Revenue</div>
          ${stats.revenueChange ? `<div class="stat-change ${stats.revenueChange > 0 ? 'change-positive' : 'change-negative'}">
            ${stats.revenueChange > 0 ? '↑' : '↓'} ${Math.abs(stats.revenueChange)}% vs last month
          </div>` : ''}
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-value">${Number(stats.orders).toLocaleString()}</div>
          <div class="stat-label">Total Orders</div>
          ${stats.ordersChange ? `<div class="stat-change ${stats.ordersChange > 0 ? 'change-positive' : 'change-negative'}">
            ${stats.ordersChange > 0 ? '↑' : '↓'} ${Math.abs(stats.ordersChange)}% vs last month
          </div>` : ''}
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div class="stat-value">${Number(stats.products).toLocaleString()}</div>
          <div class="stat-label">Active Products</div>
          ${stats.productsChange ? `<div class="stat-change ${stats.productsChange > 0 ? 'change-positive' : 'change-negative'}">
            ${stats.productsChange > 0 ? '↑' : '↓'} ${Math.abs(stats.productsChange)}% vs last month
          </div>` : ''}
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-value">${Number(stats.customers).toLocaleString()}</div>
          <div class="stat-label">Total Customers</div>
          ${stats.customersChange ? `<div class="stat-change ${stats.customersChange > 0 ? 'change-positive' : 'change-negative'}">
            ${stats.customersChange > 0 ? '↑' : '↓'} ${Math.abs(stats.customersChange)}% vs last month
          </div>` : ''}
        </div>
      </div>
      
      ${stats.lowStock > 0 ? `
      <div class="alert-banner">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <div class="alert-title">Low Stock Alert</div>
          <div class="alert-message">You have ${stats.lowStock} products that are running low on stock. Review them to avoid stockouts.</div>
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <h2 class="section-title">Revenue Trends Analysis</h2>
        <div class="section-subtitle">Daily revenue performance over the selected period</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th style="text-align: right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${revenueData.map(item => `
              <tr>
                <td>${item.date}</td>
                <td style="text-align: right; font-weight: 500;">$${Number(item.revenue).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 15px; padding: 15px; background: #f9fafb; border-radius: 8px;">
          <strong>Total Revenue:</strong> $${Number(stats.revenue).toLocaleString()} | 
          <strong>Average Daily:</strong> $${revenueData.length > 0 ? Math.floor(stats.revenue / revenueData.length).toLocaleString() : 0}
        </div>
      </div>
      
      ${topProducts.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Top Performing Products</h2>
        <div class="section-subtitle">Best selling products ranked by revenue</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product Name</th>
              <th style="text-align: center">Units Sold</th>
              <th style="text-align: right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${topProducts.map((product, index) => `
              <tr>
                <td><strong>${index + 1}.</strong></td>
                <td>${product.name}</td>
                <td style="text-align: center">${product.sales.toLocaleString()}</td>
                <td style="text-align: right; font-weight: 500;">$${Number(product.revenue).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
      
      ${recentOrders.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Recent Transactions</h2>
        <div class="section-subtitle">Latest orders and their current status</div>
        <table class="data-table">
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
            ${recentOrders.slice(0, 20).map(order => `
              <tr>
                <td>#${order.orderNumber}</td>
                <td>${order.customer?.name || 'Unknown'}</td>
                <td style="text-align: right; font-weight: 500;">$${Number(order.total).toLocaleString()}</td>
                <td>
                  <span class="status-badge" style="background: ${getStatusBadgeColor(order.status)}20; color: ${getStatusBadgeColor(order.status)};">
                    ${order.status}
                  </span>
                </td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
      
      <div class="footer">
        <p>This report was automatically generated by the Business Intelligence Dashboard System.</p>
        <p>© ${new Date().getFullYear()} ${company?.name || 'Business Name'} - All Rights Reserved</p>
        <p>For inquiries, please contact support@${company?.name?.toLowerCase().replace(/\s/g, '') || 'business'}.com</p>
      </div>
    </body>
    </html>
  `
  
  const blob = new Blob([content], { type: 'application/msword' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}