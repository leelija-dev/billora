/**
 * Thermal Invoice Template - Reusable component for generating 3-inch thermal invoice HTML
 * Professional, compact layout optimized for 58mm/80mm thermal paper
 */

// Helper function to safely parse numbers
const parseNumber = (value) => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseFloat(value) || 0
  return 0
}

// Helper function to safely format currency
const formatCurrency = (value) => {
  const num = parseNumber(value)
  return `₹${num.toFixed(2)}`
}

// Helper function to truncate long product names for thermal paper
const truncateText = (text, maxLength = 20) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Calculate totals from invoice items
const calculateSubtotal = (items, packages) => {
  let subtotal = 0
  
  if (items && Array.isArray(items)) {
    subtotal += items.reduce((sum, item) => {
      const price = parseNumber(item.price)
      const quantity = parseNumber(item.quantity)
      return sum + (price * quantity)
    }, 0)
  }
  
  if (packages && Array.isArray(packages)) {
    subtotal += packages.reduce((sum, pkg) => {
      const price = parseNumber(pkg.price)
      const quantity = parseNumber(pkg.quantity)
      return sum + (price * quantity)
    }, 0)
  }
  
  return subtotal
}

const calculateTotalGST = (items) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    const price = parseNumber(item.price)
    const gstPercent = parseNumber(item.gst)
    const quantity = parseNumber(item.quantity)
    const subtotal = price * quantity
    const discount = parseNumber(item.discount)
    const afterDiscount = subtotal - (subtotal * discount / 100)
    return sum + (afterDiscount * gstPercent / 100)
  }, 0)
}

const calculateTotalDiscount = (items) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    const price = parseNumber(item.price)
    const discountPercent = parseNumber(item.discount)
    const quantity = parseNumber(item.quantity)
    const subtotal = price * quantity
    return sum + (subtotal * discountPercent / 100)
  }, 0)
}

const calculateGrandTotal = (invoice, subtotal, totalGST, totalDiscount) => {
  // Use invoice total if available, otherwise calculate
  if (invoice.total_amount) return parseNumber(invoice.total_amount)
  if (invoice.totalAmount) return parseNumber(invoice.totalAmount)
  return subtotal - totalDiscount + totalGST
}

export const generateThermalInvoiceHTML = (invoice, isOrderDetails = false) => {
  if (!invoice) return ''

  const subtotal = calculateSubtotal(invoice.items, invoice.packages)
  const totalGST = calculateTotalGST(invoice.items)
  const totalDiscount = calculateTotalDiscount(invoice.items)
  const totalAmount = calculateGrandTotal(invoice, subtotal, totalGST, totalDiscount)
  const paidAmount = parseNumber(invoice.paid_amount || invoice.paidAmount)
  const changeAmount = paidAmount > totalAmount ? paidAmount - totalAmount : 0
  const dueAmount = paidAmount < totalAmount ? totalAmount - paidAmount : 0

  // Format date for thermal invoice
  const formatDate = (date) => {
    if (!date) return new Date().toLocaleString('en-GB')
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Render store header conditionally
  const renderStoreHeader = () => {
     if (isOrderDetails) {
      return `
        <div style="text-align: center; margin-bottom: 12px; margin-top:5px; padding-bottom: 8px; border-bottom: 2px solid #000;">
          <div style="font-size: 18px; font-weight: bold; letter-spacing: 2px; margin-bottom: 6px; text-transform: uppercase;  ">
            🧾 ORDER RECEIPT
          </div>
          <div style="font-size: 10px; color: #2c5f8a; margin-top: 4px;">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
          
        </div>
      `
    }
    
    return `
    <div class="store-header">
      <div class="store-name">${truncateText(invoice.store_name || 'YOUR STORE', 30)}</div>
      <div class="store-details">
        ${invoice.store_address ? truncateText(invoice.store_address, 35) + '<br>' : ''}
        ${invoice.store_phone ? `Tel: ${invoice.store_phone}` : ''}
        ${invoice.store_gst ? `<br>GST: ${invoice.store_gst}` : ''}
      </div>
    </div>
    `
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${isOrderDetails ? 'Order Details' : 'Thermal Invoice'} #${invoice.invoice_number || invoice.id}</title>
  <meta charset="utf-8">
  <style>
    @page {
      margin: 3mm 2mm;
      size: 80mm auto;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Courier New', 'Fira Code', monospace;
      margin: 0;
      padding: 4px;
      background: #ffffff;
      color: #000000;
      font-size: 11px;
      line-height: 1.25;
      width: 100%;
      max-width: 80mm;
    }
    
    .thermal-container {
      width: 100%;
      margin: 0 auto;
    }
    
    /* Header Styles */
    .store-header {
      text-align: center;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px dashed #000;
    }
    
    .store-name {
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .store-details {
      font-size: 9px;
      line-height: 1.3;
      color: #333;
    }
    
    /* Divider */
    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    
    .divider-double {
      border-top: 2px solid #000;
      margin: 6px 0;
    }
    
    /* Info Rows */
    .info-grid {
      margin: 8px 0;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 10px;
    }
    
    .info-label {
      font-weight: normal;
      letter-spacing: 0.5px;
    }
    
    .info-value {
      font-weight: bold;
    }
    
    /* Customer Section */
    .customer-section {
      margin: 8px 0;
      padding: 5px;
      background: #f9f9f9;
      border-left: 2px solid #000;
      font-size: 9px;
    }
    
    .customer-label {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 8px;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }
    
    /* Items Table */
    .items-header {
      display: flex;
      margin: 6px 0 4px;
      padding-bottom: 3px;
      border-bottom: 1px solid #000;
      font-weight: bold;
      font-size: 9px;
      text-transform: uppercase;
    }
    
    .col-item { flex: 3; text-align: left; }
    .col-qty { flex: 1; text-align: center; }
    .col-price { flex: 1.5; text-align: right; }
    .col-total { flex: 1.5; text-align: right; }
    
    .item-row {
      display: flex;
      margin: 3px 0;
      font-size: 9px;
    }
    
    .item-name {
      flex: 3;
      word-break: break-word;
      padding-right: 4px;
    }
    
    .item-qty {
      flex: 1;
      text-align: center;
    }
    
    .item-price {
      flex: 1.5;
      text-align: right;
      padding-right: 4px;
    }
    
    .item-total {
      flex: 1.5;
      text-align: right;
    }
    
    .package-item {
      background: #f5f5f5;
      margin: 2px 0;
      padding: 2px 0;
    }
    
    /* Summary Section */
    .summary-section {
      margin: 10px 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 10px;
    }
    
    .summary-total {
      font-weight: bold;
      font-size: 12px;
      margin-top: 6px;
      padding-top: 4px;
      border-top: 1px solid #000;
    }
    
    .grand-total {
      font-size: 14px;
      font-weight: bold;
      color: #000;
    }
    
    /* Payment Section */
    .payment-section {
      margin: 8px 0;
      padding: 6px;
      background: #f0f0f0;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 10px;
    }
    
    .paid-status {
      color: #2d6a4f;
      font-weight: bold;
    }
    
    .due-status {
      color: #c2412c;
      font-weight: bold;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      margin-top: 12px;
      padding-top: 6px;
      border-top: 1px dashed #000;
      font-size: 8px;
      color: #555;
    }
    
    .thankyou {
      font-size: 10px;
      font-weight: bold;
      margin: 5px 0;
      text-transform: uppercase;
    }
    
    /* Print optimizations */
    @media print {
      body {
        margin: 0;
        padding: 2px;
      }
      .no-break {
        page-break-inside: avoid;
      }
    }
    
    /* Small adjustments for 58mm paper */
    @media (max-width: 60mm) {
      body {
        font-size: 9px;
      }
      .store-name {
        font-size: 13px;
      }
      .item-name {
        font-size: 8px;
      }
    }
  </style>
</head>
<body>
<div class="thermal-container">
  
  ${renderStoreHeader()}

  <!-- Invoice/Order Info -->
  <div class="info-grid">
    <div class="info-row">
      <span class="info-label">${isOrderDetails ? 'ORDER #:' : 'INVOICE #:'}</span>
      <span class="info-value">${invoice.invoice_number || invoice.id || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">${isOrderDetails ? 'ORDER DATE:' : 'DATE & TIME:'}</span>
      <span class="info-value">${formatDate(invoice.created_at)}</span>
    </div>
    ${invoice.order_id ? `
    <div class="info-row">
      <span class="info-label">ORDER #:</span>
      <span class="info-value">${invoice.order_id}</span>
    </div>
    ` : ''}
  </div>

  <div class="divider"></div>

  <!-- Customer Info -->
  <div class="customer-section">
    <div class="customer-label">CUSTOMER</div>
    <div><strong>${invoice.customer_name ? truncateText(invoice.customer_name, 30) : 'Walk-in Customer'}</strong></div>
    ${invoice.customer_phone ? `<div>${invoice.customer_phone}</div>` : ''}
    ${invoice.customer_email ? `<div style="font-size: 8px;">${truncateText(invoice.customer_email, 30)}</div>` : ''}
    ${invoice.customer_gst ? `<div>GST: ${invoice.customer_gst}</div>` : ''}
  </div>

  <div class="divider"></div>

  <!-- Items Header -->
  <div class="items-header">
    <div class="col-item">ITEM</div>
    <div class="col-qty">QTY</div>
    <div class="col-price">PRICE</div>
    <div class="col-total">TOTAL</div>
  </div>

  <!-- Products List -->
  ${invoice.items && invoice.items.length > 0 ? invoice.items.map((item, index) => {
    const itemPrice = parseNumber(item.price)
    const itemTotal = parseNumber(item.total_price)
    const quantity = parseNumber(item.quantity)
    const productName = item.product?.name || item.product_name || item.name || `Product`
    const discount = parseNumber(item.discount)
    const gst = parseNumber(item.gst)
    
    return `
      <div class="item-row">
        <div class="item-name">${truncateText(productName, 25)}${discount > 0 ? ` (-${discount}%)` : ''}${gst > 0 ? ` [+${gst}%]` : ''}</div>
        <div class="item-qty">${quantity}</div>
        <div class="item-price">${formatCurrency(itemPrice)}</div>
        <div class="item-total">${formatCurrency(itemTotal)}</div>
      </div>
    `
  }).join('') : ''}

  <!-- Packages List -->
  ${invoice.packages && invoice.packages.length > 0 ? `
    <div style="margin: 5px 0 2px; font-weight: bold; font-size: 9px;">--- PACKAGES ---</div>
    ${invoice.packages.map((pkg, index) => {
      const pkgPrice = parseNumber(pkg.price)
      const pkgTotal = parseNumber(pkg.total_price)
      const quantity = parseNumber(pkg.quantity)
      const packageName = pkg.package_name || pkg.name || pkg.product_name || `Package`
      
      return `
        <div class="item-row package-item">
          <div class="item-name">📦 ${truncateText(packageName, 23)}</div>
          <div class="item-qty">${quantity}</div>
          <div class="item-price">${formatCurrency(pkgPrice)}</div>
          <div class="item-total">${formatCurrency(pkgTotal)}</div>
        </div>
      `
    }).join('')}
  ` : ''}

  <!-- No items message -->
  ${(!invoice.items || invoice.items.length === 0) && (!invoice.packages || invoice.packages.length === 0) ? `
    <div style="text-align: center; padding: 10px; font-style: italic;">No items in ${isOrderDetails ? 'order' : 'invoice'}</div>
  ` : ''}

  <div class="divider-double"></div>

  <!-- Summary -->
  <div class="summary-section">
    <div class="summary-row">
      <span>Subtotal:</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
    ${totalDiscount > 0 ? `
    <div class="summary-row">
      <span>Discount:</span>
      <span>-${formatCurrency(totalDiscount)}</span>
    </div>
    ` : ''}
    ${totalGST > 0 ? `
    <div class="summary-row">
      <span>GST:</span>
      <span>${formatCurrency(totalGST)}</span>
    </div>
    ` : ''}
    <div class="summary-row summary-total">
      <span><strong>TOTAL AMOUNT</strong></span>
      <span class="grand-total"><strong>${formatCurrency(totalAmount)}</strong></span>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Payment Section -->
  <div class="payment-section">
    <div class="payment-row">
      <span>PAID:</span>
      <span class="paid-status">${formatCurrency(paidAmount)}</span>
    </div>
    ${changeAmount > 0 ? `
    <div class="payment-row">
      <span>CHANGE:</span>
      <span>${formatCurrency(changeAmount)}</span>
    </div>
    ` : ''}
    ${dueAmount > 0 ? `
    <div class="payment-row">
      <span>DUE:</span>
      <span class="due-status">${formatCurrency(dueAmount)}</span>
    </div>
    ` : ''}
    <div class="payment-row">
      <span>MODE:</span>
      <span>${invoice.payment_mode || invoice.payment_method || 'CASH'}</span>
    </div>
    ${invoice.transaction_id ? `
    <div class="payment-row" style="font-size: 8px;">
      <span>TXN ID:</span>
      <span>${truncateText(invoice.transaction_id, 20)}</span>
    </div>
    ` : ''}
  </div>

  <div class="divider"></div>

  <!-- Footer -->
  <div class="footer">
    <div class="thankyou">Thank You!</div>
    <div>Visit Again</div>
    <div style="font-size: 7px; margin-top: 5px;">
      ${invoice.store_email ? truncateText(invoice.store_email, 30) + '<br>' : ''}
      ${new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
    </div>
    ${paidAmount >= totalAmount ? '<div style="margin-top: 4px;">✅ PAID</div>' : '<div style="margin-top: 4px;">⚠️ PENDING</div>'}
  </div>
  
</div>
</body>
</html>`
}

export default generateThermalInvoiceHTML