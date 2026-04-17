import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateProfessionalPDF = (data) => {
  const { stats, revenueData, topProducts, recentOrders, company, timeRange } = data
  
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

  const checkAndAddPage = (space = 20) => {
    if (yPosition + space > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Header
  doc.setFillColor(59, 130, 246)
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Business Intelligence Dashboard', margin, 25)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 35)

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

  // KPI Section
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

    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(metric.label, x + 4, yPosition + 10)

    doc.setFontSize(14)
    doc.setTextColor(31, 41, 55)

    const splitValue = doc.splitTextToSize(metric.value, cardWidth - 8)
    doc.text(splitValue, x + 4, yPosition + 22)

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

  // Low Stock Alert
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

  // Revenue Trends
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

  // Summary Statistics
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

  // Top Products
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

  // Recent Orders
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

  // Footer
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
}