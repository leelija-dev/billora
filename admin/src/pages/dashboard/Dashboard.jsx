import React, { useEffect, useState, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiClock,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiArrowRight,
  FiAlertCircle,
  FiPrinter,
  FiFileText,
  FiFile
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { dashboardAPI } from '../../services'
import OrderStatusChart from '../../components/charts/OrderStatusChart'
import RevenueChart from '../../components/charts/RevenueChart'
import TopProductsChart from '../../components/charts/TopProductsChart'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Import autoTable properly
import autoTable from 'jspdf-autotable'
import { FaFile } from 'react-icons/fa'

const Dashboard = () => {
  const { company, user } = useAuthStore()
  const [timeRange, setTimeRange] = useState('7d')
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    lowStock: 0,
    revenueChange: null,
    ordersChange: null,
    productsChange: null,
    customersChange: null,
  })
  const [revenueData, setRevenueData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [salesDistribution, setSalesDistribution] = useState([])
  const [orderStatus, setOrderStatus] = useState({})
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [exporting, setExporting] = useState(false)
  
  const dashboardRef = useRef(null)
  const exportDropdownRef = useRef(null)

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const response = await dashboardAPI.getOverview(user.id)
      const data = response.data
      const normalizedStats = {
        revenue: parseFloat(data?.stats?.totalRevenue || 0),
        orders: parseInt(data?.stats?.totalOrders || 0),
        products: parseInt(data?.stats?.totalProducts || 0),
        customers: parseInt(data?.stats?.totalCustomers || 0),
        lowStock: parseInt(data?.stats?.lowStock || 0),
        revenueChange: data?.stats?.revenueTrend ?? null,
        ordersChange: data?.stats?.ordersTrend ?? null,
        productsChange: data?.stats?.productsTrend ?? null,
        customersChange: data?.stats?.customersTrend ?? null,
      }

      // Process revenue data to ensure proper numeric values
      const processedRevenueData = (data?.revenueData?.daily || []).map(item => ({
        date: item.date || '',
        revenue: parseFloat(item.revenue || 0)
      }))

      // Process top products data
      const processedTopProducts = (data?.topProducts || []).map(item => ({
        id: item.id,
        name: item.name || '',
        sales: parseFloat(item.sales || 0),
        revenue: parseFloat(item.revenue || 0),
        trend: item.trend || '+0%'
      }))

      // Process recent orders
      const processedRecentOrders = (data?.recentOrders || []).map(item => ({
        ...item,
        total: parseFloat(item.total || 0)
      }))

      setStats(normalizedStats)
      setRevenueData(processedRevenueData)
      setRecentOrders(processedRecentOrders)
      setSalesDistribution(data?.salesDistribution || [])
      setOrderStatus(data?.orderStatus || {})
      setTopProducts(processedTopProducts)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setRevenueData([])
      setRecentOrders([])
      setSalesDistribution([])
      setOrderStatus({})
      setTopProducts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
  }

  // Professional PDF Template
  // Professional PDF Template - Updated version without emojis
const generateProfessionalPDF = async () => {
  setExporting(true)
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)

    let yPosition = margin

    // ✅ Better page check
    const checkAndAddPage = (space = 20) => {
      if (yPosition + space > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }
    }

    // ================= HEADER =================
    doc.setFillColor(59, 130, 246)
    doc.rect(0, 0, pageWidth, 45, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Business Intelligence Dashboard', margin, 25)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 35)

    // ✅ Wrapped company text
    const companyText = doc.splitTextToSize(
      `${company?.name || 'Business Name'} | Report Period: ${
        timeRange === '7d' ? 'Last 7 Days' :
        timeRange === '30d' ? 'Last 30 Days' :
        timeRange === '90d' ? 'Last 3 Months' :
        'Last 12 Months'
      }`,
      contentWidth
    )

    doc.setFontSize(8)
    doc.setTextColor(240, 240, 240)
    doc.text(companyText, margin, 42)

    yPosition = 55

    // ================= KPI =================
    doc.setFontSize(14)
    doc.setTextColor(59, 130, 246)
    doc.setFont('helvetica', 'bold')
    doc.text('Key Performance Indicators', margin, yPosition)

    yPosition += 12

    const metrics = [
      { label: 'Total Revenue', value: `$${Number(stats.revenue).toLocaleString()}`, change: stats.revenueChange },
      { label: 'Total Orders', value: Number(stats.orders).toLocaleString(), change: stats.ordersChange },
      { label: 'Products', value: Number(stats.products).toLocaleString(), change: stats.productsChange },
      { label: 'Customers', value: Number(stats.customers).toLocaleString(), change: stats.customersChange }
    ]

    const gap = 5
    const cardWidth = (contentWidth - (gap * 3)) / 4

    metrics.forEach((metric, index) => {
      const x = margin + (index * (cardWidth + gap))

      doc.setFillColor(248, 250, 252)
      doc.setDrawColor(226, 232, 240)
      doc.roundedRect(x, yPosition, cardWidth, 38, 3, 3, 'FD')

      // Label
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(metric.label, x + 4, yPosition + 10)

      // ✅ Wrapped Value
      doc.setFontSize(14)
      doc.setTextColor(31, 41, 55)

      const splitValue = doc.splitTextToSize(metric.value, cardWidth - 8)
      doc.text(splitValue, x + 4, yPosition + 22)

      // Change %
      if (metric.change !== null && metric.change !== undefined) {
        const isPositive = metric.change > 0
        const color = isPositive ? [16, 185, 129] : [239, 68, 68]

        doc.setTextColor(...color)
        doc.setFontSize(7)
        doc.text(
          `${isPositive ? '+' : ''}${metric.change}%`,
          x + cardWidth - 12,
          yPosition + 34
        )
      }
    })

    yPosition += 48

    // ================= LOW STOCK =================
    if (stats.lowStock > 0) {
      checkAndAddPage(20)

      doc.setFillColor(254, 243, 199)
      doc.roundedRect(margin, yPosition, contentWidth, 12, 3, 3, 'F')

      doc.setTextColor(180, 83, 9)
      doc.setFontSize(9)
      doc.text(
        `Low Stock Alert: ${stats.lowStock} products are running low.`,
        margin + 5,
        yPosition + 8
      )

      yPosition += 18
    }

    // ================= REVENUE =================
    checkAndAddPage(60)

    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.text('Revenue Trends Analysis', margin, yPosition)

    yPosition += 8

    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('Daily revenue performance', margin, yPosition)

    yPosition += 10

    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'Revenue (USD)']],
      body: revenueData.map(item => [
        item.date,
        `$${Number(item.revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ]),
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      },
      tableWidth: 'auto',
      margin: { left: margin, right: margin }
    })

    yPosition = doc.lastAutoTable.finalY + 10

    // ================= SUMMARY =================
    checkAndAddPage(50)

    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.text('Summary Statistics', margin, yPosition)

    yPosition += 8

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value', 'Change']],
      body: [
        ['Total Revenue', `$${Number(stats.revenue).toLocaleString()}`, stats.revenueChange ?? 'N/A'],
        ['Total Orders', stats.orders, stats.ordersChange ?? 'N/A'],
        ['Products', stats.products, stats.productsChange ?? 'N/A'],
        ['Customers', stats.customers, stats.customersChange ?? 'N/A'],
        ['Low Stock', stats.lowStock, stats.lowStock > 0 ? 'Action Required' : 'OK']
      ],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      },
      tableWidth: 'auto',
      margin: { left: margin, right: margin }
    })

    yPosition = doc.lastAutoTable.finalY + 10

    // ================= TOP PRODUCTS =================
    if (topProducts.length > 0) {
      checkAndAddPage(60)

      doc.setFontSize(12)
      doc.setTextColor(59, 130, 246)
      doc.text('Top Performing Products', margin, yPosition)

      yPosition += 10

      autoTable(doc, {
        startY: yPosition,
        head: [['Product', 'Units', 'Revenue']],
        body: topProducts.map(p => [
          p.name,
          p.sales,
          `$${Number(p.revenue).toLocaleString()}`
        ]),
        theme: 'striped',
        styles: {
          fontSize: 9,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255
        },
        margin: { left: margin, right: margin }
      })

      yPosition = doc.lastAutoTable.finalY + 10
    }

    // ================= ORDERS =================
    if (recentOrders.length > 0) {
      checkAndAddPage(80)

      doc.setFontSize(12)
      doc.setTextColor(59, 130, 246)
      doc.text('Recent Transactions', margin, yPosition)

      yPosition += 10

      autoTable(doc, {
        startY: yPosition,
        head: [['Order ID', 'Customer', 'Amount', 'Status', 'Date']],
        body: recentOrders.slice(0, 15).map(o => [
          o.orderNumber,
          o.customer?.name || 'Unknown',
          `$${Number(o.total).toLocaleString()}`,
          o.status,
          new Date(o.createdAt).toLocaleDateString()
        ]),
        theme: 'striped',
        styles: {
          fontSize: 8,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255
        },
        margin: { left: margin, right: margin }
      })
    }

    // ================= FOOTER =================
    const pages = doc.internal.getNumberOfPages()

    for (let i = 1; i <= pages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150)

      doc.text(
        `Generated by ${company?.name || 'Business'} | Page ${i} of ${pages}`,
        margin,
        pageHeight - 10
      )
    }

    doc.save(`dashboard-${Date.now()}.pdf`)
    setShowExportDropdown(false)

  } catch (err) {
    console.error(err)
    alert('PDF generation failed')
  } finally {
    setExporting(false)
  }
}

  // Professional Word Template
  const generateProfessionalWord = () => {
    setExporting(true)
    try {
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
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Arial', sans-serif;
              background: #ffffff;
              padding: 40px;
              line-height: 1.6;
              color: #1f2937;
            }
            
            /* Header Section */
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 40px;
              border-radius: 12px;
              margin-bottom: 30px;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
              transform: rotate(30deg);
            }
            
            .header h1 {
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: 600;
            }
            
            .header .subtitle {
              font-size: 14px;
              opacity: 0.9;
            }
            
            .header .company-info {
              margin-top: 15px;
              font-size: 12px;
              opacity: 0.8;
            }
            
            /* Stats Grid */
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .stat-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 20px;
              transition: all 0.3s ease;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .stat-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            
            .stat-icon {
              font-size: 32px;
              margin-bottom: 10px;
            }
            
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #3b82f6;
              margin: 10px 0;
            }
            
            .stat-label {
              font-size: 14px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .stat-change {
              font-size: 12px;
              margin-top: 8px;
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
            }
            
            .change-positive {
              background: #d1fae5;
              color: #065f46;
            }
            
            .change-negative {
              background: #fee2e2;
              color: #991b1b;
            }
            
            /* Alert Banner */
            .alert-banner {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-left: 4px solid #f59e0b;
              padding: 15px 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .alert-icon {
              font-size: 24px;
            }
            
            .alert-content {
              flex: 1;
            }
            
            .alert-title {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 4px;
            }
            
            .alert-message {
              font-size: 13px;
              color: #b45309;
            }
            
            /* Section Styles */
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #3b82f6;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .section-subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 20px;
            }
            
            /* Table Styles */
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 13px;
            }
            
            .data-table th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              color: #374151;
              border: 1px solid #e5e7eb;
            }
            
            .data-table td {
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              color: #4b5563;
            }
            
            .data-table tr:hover {
              background: #f9fafb;
            }
            
            /* Status Badges */
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 500;
              text-transform: capitalize;
            }
            
            /* Footer */
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
            }
            
            /* Print Styles */
            @media print {
              body {
                padding: 0;
              }
              .stat-card {
                break-inside: avoid;
              }
              .section {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <h1>Business Intelligence Dashboard</h1>
            <div class="subtitle">Comprehensive Performance Report</div>
            <div class="company-info">
              <strong>${company?.name || 'Business Name'}</strong> | 
              Report Period: ${timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : timeRange === '90d' ? 'Last 3 Months' : 'Last 12 Months'} | 
              Generated: ${new Date().toLocaleString()}
            </div>
          </div>
          
          <!-- Key Metrics -->
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
          <!-- Low Stock Alert -->
          <div class="alert-banner">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <div class="alert-title">Low Stock Alert</div>
              <div class="alert-message">You have ${stats.lowStock} products that are running low on stock. Review them to avoid stockouts.</div>
            </div>
          </div>
          ` : ''}
          
          <!-- Revenue Trends -->
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
          <!-- Top Products -->
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
          <!-- Recent Orders -->
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
          
          <!-- Footer -->
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
      setShowExportDropdown(false)
    } catch (error) {
      console.error('Error exporting to Word:', error)
      alert('Failed to export to Word. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  // Export to Excel with Professional Formatting
  const exportToExcel = () => {
    setExporting(true)
    try {
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
      setShowExportDropdown(false)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Failed to export to Excel. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  // Print Dashboard with Professional Layout
  const printDashboard = async () => {
    setIsPrinting(true)
    try {
      const printWindow = window.open('', '_blank', 'width=1200,height=800')
      
      const getStatusColor = (status) => {
        switch(status) {
          case 'completed': return '#10b981'
          case 'pending': return '#f59e0b'
          case 'processing': return '#3b82f6'
          default: return '#6b7280'
        }
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Dashboard Report - ${company?.name || 'Business'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Arial', sans-serif;
              background: white;
              padding: 40px;
              line-height: 1.6;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              .page-break {
                page-break-before: always;
              }
              .no-break {
                page-break-inside: avoid;
              }
            }
            
            .header {
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              color: white;
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 30px;
            }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .stat-card {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 20px;
              background: white;
            }
            
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #3b82f6;
              margin: 10px 0;
            }
            
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #3b82f6;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            
            th {
              background: #f3f4f6;
              font-weight: 600;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
            }
            
            @media print {
              .stats-grid {
                gap: 15px;
              }
              .stat-card {
                break-inside: avoid;
              }
              .section {
                break-inside: avoid;
              }
            }
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
    } catch (error) {
      console.error('Error printing dashboard:', error)
      alert('Failed to print. Please try again.')
    } finally {
      setIsPrinting(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, change, color, delay }) => {
    const isPositive = change > 0
    const isNeutral = change === 0
    const TrendIcon = isNeutral ? FiMinus : (isPositive ? FiTrendingUp : FiTrendingDown)

    // Format revenue values with proper Indian formatting
    const formatValue = (val, title) => {
      if (title.includes('Revenue')) {
        const num = parseFloat(val)
        if (isNaN(num) || num === 0) {
          return 'Rs 0'
        }
        if (num >= 100000) {
          return `Rs ${(num / 100000).toFixed(1)}L`
        } else if (num >= 1000) {
          return `Rs ${(num / 1000).toFixed(1)}k`
        } else {
          return `Rs ${num.toLocaleString('en-IN')}`
        }
      }
      return val
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <div className={`h-1.5 bg-gradient-to-r ${color}`} />
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {title}
              </p>
              <motion.p 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mt-2 break-all"
              >
                {formatValue(value, title)}
              </motion.p>
              
              {change !== null && change !== undefined && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center mt-3 space-x-1"
                >
                  {!isNeutral && (
                    <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                  <span className={`text-sm font-medium ${
                    isNeutral ? 'text-gray-500' : (isPositive ? 'text-green-600' : 'text-red-600')
                  }`}>
                    {isNeutral ? 'No change' : `${Math.abs(change)}%`}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-shadow`}
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const lineChartOptions = {
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
      background: 'transparent'
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    title: {
      text: 'Revenue Trends',
      align: 'left',
      style: { fontSize: '16px', fontWeight: 600, color: '#374151' }
    },
    grid: {
      borderColor: '#e2e8f0',
      row: { colors: ['#f8fafc', 'transparent'], opacity: 0.5 },
    },
    xaxis: {
      categories: Array.isArray(revenueData) ? revenueData.map(item => item.date) : [],
      labels: { style: { colors: '#64748b', fontSize: '12px' } }
    },
    yaxis: {
      labels: {
        formatter: function (value) { return '$' + value.toLocaleString() },
        style: { colors: '#64748b', fontSize: '12px' }
      }
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: function (value) { return '$' + value.toLocaleString() } }
    },
    colors: ['#3b82f6']
  }

  const lineChartSeries = [{
    name: "Revenue",
    data: Array.isArray(revenueData) ? revenueData.map(item => item.revenue) : []
  }]

  const polarChartOptions = {
    chart: {
      type: 'polarArea',
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: { colors: ['#fff'] },
    fill: { opacity: 0.8 },
    labels: Array.isArray(salesDistribution) ? salesDistribution.map(item => item.category) : [],
    legend: {
      position: 'bottom',
      labels: { colors: '#64748b' }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' }
      }
    }],
    colors: COLORS,
    plotOptions: {
      polarArea: {
        rings: { strokeWidth: 1, strokeColor: '#e2e8f0' },
        spokes: { strokeWidth: 1, connectorColors: '#e2e8f0' }
      }
    }
  }

  const polarChartSeries = Array.isArray(salesDistribution) ? salesDistribution.map(item => item.value) : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={dashboardRef}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6"
      >
        {/* Welcome Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome back, {company?.name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiClock className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Time Range Selector */}
            <motion.select 
              whileHover={{ scale: 1.02 }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-transparent outline-none shadow-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="12m">Last 12 months</option>
            </motion.select>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={exporting}
                className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload className={`w-4 h-4 ${exporting ? 'animate-pulse' : ''}`} />
                <span>{exporting ? 'Exporting...' : 'Export'}</span>
              </motion.button>

              <AnimatePresence>
                {showExportDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    <button
                      onClick={generateProfessionalPDF}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                    >
                      <FaFile className="w-4 h-4 text-red-500" />
                      <div className="flex-1">
                        <span>Export as PDF</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Professional report format</p>
                      </div>
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                      <FiFileText className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <span>Export as Excel</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Spreadsheet with multiple sheets</p>
                      </div>
                    </button>
                    <button
                      onClick={generateProfessionalWord}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                      <FiFile className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <span>Export as DOC</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Editable document format</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Print Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printDashboard}
              disabled={isPrinting}
              className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg shadow-gray-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPrinter className="w-4 h-4" />
              <span>{isPrinting ? 'Printing...' : 'Print'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={stats.revenue || 0}
            icon={FiDollarSign}
            change={stats.revenueChange}
            color="from-green-500 to-emerald-500"
            delay={0.1}
          />
          <StatCard
            title="Total Orders"
            value={Number(stats.orders || 0).toLocaleString()}
            icon={FiShoppingBag}
            change={stats.ordersChange}
            color="from-blue-500 to-cyan-500"
            delay={0.2}
          />
          <StatCard
            title="Products"
            value={Number(stats.products || 0).toLocaleString()}
            icon={FiPackage}
            change={stats.productsChange}
            color="from-purple-500 to-pink-500"
            delay={0.3}
          />
          <StatCard
            title="Customers"
            value={Number(stats.customers || 0).toLocaleString()}
            icon={FiUsers}
            change={stats.customersChange}
            color="from-orange-500 to-red-500"
            delay={0.4}
          />
        </div>

        {/* Low Stock Alert */}
        <AnimatePresence>
          {stats.lowStock > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                      Low Stock Alert!
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      You have <span className="font-bold">{stats.lowStock}</span> products that are running low on stock. 
                      Review them to avoid stockouts.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-600"
                >
                  <span>View products</span>
                  <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">vs previous period</span>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FiMoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <RevenueChart data={revenueData} height={320} />
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Order Status
            </h3>
            
            <OrderStatusChart data={orderStatus} height={256} />
          </motion.div>
        </div>

        {/* Top Products Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Products
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Best performing products</span>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiMoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <TopProductsChart data={topProducts} height={320} />
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You have {recentOrders.length} orders this period
                </p>
              </div>
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                <span>View all orders</span>
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date', ''].map((header) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order, index) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.02)' }}
                    className="group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                          {order.customer?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                          {order.customer?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Rs {parseFloat(order.total || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiCalendar className="w-3 h-3 mr-2" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <FiMoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing 1 to {recentOrders.length} of {recentOrders.length} results
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Previous
                </button>
                <button className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard