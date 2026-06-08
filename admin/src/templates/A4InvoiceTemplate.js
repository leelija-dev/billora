/**
 * A4 Invoice Template - Reusable component for generating A4 invoice HTML
 * Professional, compact layout optimized for printing
 */
export const generateA4InvoiceHTML = (invoice, isOrderDetails = false) => {
  if (!invoice) return ''

  // Helper function to safely parse numeric values
  const parseNumeric = (value, defaultValue = 0) => {
    if (typeof value === 'string') return parseFloat(value) || defaultValue
    if (typeof value === 'number') return value
    return defaultValue
  }

  // Calculate totals from invoice items and packages
  const calculateSubtotal = () => {
    let subtotal = 0
    if (Array.isArray(invoice.items)) {
      invoice.items.forEach(item => {
        const price = parseNumeric(item.price)
        const qty = parseNumeric(item.quantity, 1)
        subtotal += price * qty
      })
    }
    if (Array.isArray(invoice.packages)) {
      invoice.packages.forEach(pkg => {
        const price = parseNumeric(pkg.price)
        const qty = parseNumeric(pkg.quantity, 1)
        subtotal += price * qty
      })
    }
    return subtotal
  }

  const calculateTotalDiscount = () => {
    let discount = 0
    if (Array.isArray(invoice.items)) {
      invoice.items.forEach(item => {
        const price = parseNumeric(item.price)
        const qty = parseNumeric(item.quantity, 1)
        const discPercent = parseNumeric(item.discount)
        const subtotal = price * qty
        discount += subtotal * (discPercent / 100)
      })
    }
    return discount
  }

  const calculateTotalGST = () => {
    let gst = 0
    if (Array.isArray(invoice.items)) {
      invoice.items.forEach(item => {
        const price = parseNumeric(item.price)
        const qty = parseNumeric(item.quantity, 1)
        const discPercent = parseNumeric(item.discount)
        const gstPercent = parseNumeric(item.gst)
        const subtotal = price * qty
        const afterDisc = subtotal - (subtotal * discPercent / 100)
        gst += afterDisc * (gstPercent / 100)
      })
    }
    return gst
  }

  const subtotal = calculateSubtotal()
  const totalDiscount = calculateTotalDiscount()
  const totalGST = calculateTotalGST()
  const totalAmount = parseNumeric(invoice.total_amount || invoice.totalAmount, subtotal - totalDiscount + totalGST)
  const paidAmount = parseNumeric(invoice.paid_amount || invoice.paidAmount, 0)
  const changeAmount = paidAmount > totalAmount ? paidAmount - totalAmount : 0
  const dueAmount = paidAmount < totalAmount ? totalAmount - paidAmount : 0

  // Format currency
  const formatCurrency = (amount) => `₹${amount.toFixed(2)}`

  // Format date
  const formatDate = (date) => {
    if (!date) return new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    return new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Render header conditionally
  const renderHeader = () => {
    if (isOrderDetails) return ''
    
    return `
    <div class="header-row">
      <div class="brand-section">
        <div class="brand-name">${escapeHtml(invoice.store_name) || 'Deleted'}</div>
        <div class="store-meta">
          ${escapeHtml(invoice.store_address) || 'Deleted'}<br>
          ${invoice.store_gst ? `GST: ${escapeHtml(invoice.store_gst)} &nbsp;|&nbsp;` : ''}
          ${invoice.store_phone ? `Tel: ${escapeHtml(invoice.store_phone)}` : ''}
          ${invoice.store_email ? `<br>${escapeHtml(invoice.store_email)}` : ''}
        </div>
      </div>
      <div class="invoice-badge">
        <h2>TAX INVOICE</h2>
        <p>Original for Recipient</p>
      </div>
    </div>
    `
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${isOrderDetails ? 'Order Details' : 'Invoice #'}${invoice.invoice_number || invoice.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 1.2cm 1cm;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #eef2f5;
      display: flex;
      justify-content: center;
      padding: 20px 16px;
    }

    .invoice-wrapper {
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .invoice-container {
      padding: 28px 32px 32px;
    }

    /* Header Section */
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e9edf2;
    }

    .brand-name {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.3px;
      background: linear-gradient(135deg, #1e2a3a 0%, #0f1a24 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      margin-bottom: 6px;
    }

    .store-meta {
      font-size: 13px;
      color: #5a6874;
      line-height: 1.4;
    }

    .invoice-badge {
      text-align: right;
      background: #f4f7fc;
      padding: 10px 20px;
      border-radius: 32px;
    }

    .invoice-badge h2 {
      font-size: 24px;
      font-weight: 800;
      color: #1e466e;
      letter-spacing: 1px;
      margin: 0;
    }

    .invoice-badge p {
      font-size: 11px;
      color: #4a627a;
      margin-top: 4px;
    }

    /* Meta Info Grid */
    .meta-grid {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
      background: #f9fbfd;
      padding: 14px 20px;
      border-radius: 16px;
    }

    .meta-block {
      flex: 1;
      min-width: 130px;
    }

    .meta-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6c7e91;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 15px;
      font-weight: 600;
      color: #1f2d3d;
    }

    /* Customer Card */
    .customer-card {
      background: #fefefe;
      border: 1px solid #eef2f8;
      border-radius: 16px;
      padding: 14px 20px;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #3a546d;
      margin-bottom: 8px;
      border-left: 3px solid #2c7da0;
      padding-left: 10px;
    }

    .customer-details-inline {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 28px;
    }

    .customer-field {
      font-size: 13px;
      color: #2c3e50;
    }

    .customer-field strong {
      font-weight: 600;
      color: #1a3a4f;
    }

    .gst-chip {
      background: #eef3fc;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }

    /* Items Table */
    .items-section {
      margin-bottom: 24px;
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      border-radius: 12px;
      overflow: hidden;
    }

    .modern-table th {
      background: #1f2e3a;
      color: white;
      font-weight: 600;
      padding: 10px 10px;
      font-size: 11.5px;
      letter-spacing: 0.3px;
      text-align: left;
    }

    .modern-table td {
      padding: 10px 10px;
      border-bottom: 1px solid #eef2f6;
      color: #2c3f4f;
    }

    .modern-table tr:last-child td {
      border-bottom: none;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .fw-semibold {
      font-weight: 600;
    }

    .section-header {
      background: #f2f5f9;
      padding: 6px 12px;
      font-weight: 700;
      font-size: 12px;
    }

    /* Summary & Payment Row */
    .summary-payment-row {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .summary-box, .payment-box {
      flex: 1;
      background: #ffffff;
      border: 1px solid #e9edf2;
      border-radius: 18px;
      padding: 16px 20px;
    }

    .summary-box {
      background: #fbfdff;
    }

    .payment-box {
      background: #f8fafd;
    }

    .box-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #446d8c;
      margin-bottom: 14px;
      border-bottom: 1px dashed #dce5ec;
      padding-bottom: 8px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 13px;
    }

    .summary-row .label {
      color: #5a6e7c;
    }

    .summary-row .value {
      font-weight: 500;
      color: #1f2e3a;
    }

    .total-row {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 2px solid #e2e8f0;
      font-weight: 800;
      font-size: 16px;
    }

    .total-row .value {
      color: #1a5d8f;
      font-size: 18px;
    }

    .payment-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 13px;
    }

    .amount-paid {
      font-weight: 700;
      color: #2c6e2c;
    }

    .due-amount {
      color: #c2412c;
      font-weight: 700;
    }

    /* Footer */
    .footer-note {
      margin-top: 20px;
      text-align: center;
      border-top: 1px solid #e9edf2;
      padding-top: 16px;
      font-size: 11px;
      color: #7f8c9a;
    }

    /* Print Styles */
    @media print {
      body {
        background: white;
        padding: 0;
        margin: 0;
      }
      .invoice-wrapper {
        box-shadow: none;
        border-radius: 0;
        max-width: 100%;
      }
      .invoice-container {
        padding: 0.2cm 0.3cm;
      }
      .meta-grid, .customer-card, .summary-box, .payment-box, .items-table {
        break-inside: avoid;
      }
    }

    @media (max-width: 700px) {
      .invoice-container {
        padding: 20px;
      }
      .header-row {
        flex-direction: column;
      }
      .invoice-badge {
        text-align: left;
        align-self: flex-start;
      }
      .meta-grid {
        flex-direction: column;
        gap: 10px;
      }
      .summary-payment-row {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
<div class="invoice-wrapper">
  <div class="invoice-container">
    ${renderHeader()}

    <!-- Meta Info -->
    <div class="meta-grid">
      <div class="meta-block">
        <div class="meta-label">${isOrderDetails ? 'Order Number' : 'Invoice Number'}</div>
        <div class="meta-value">${escapeHtml(invoice.invoice_number || invoice.id || 'INV-001')}</div>
      </div>
      <div class="meta-block">
        <div class="meta-label">${isOrderDetails ? 'Order Date' : 'Invoice Date'}</div>
        <div class="meta-value">${formatDate(invoice.created_at)}</div>
      </div>
      <div class="meta-block">
        <div class="meta-label">Order / Bill No</div>
        <div class="meta-value">${escapeHtml(invoice.order_id || invoice.id || 'WALK-IN')}</div>
      </div>
    </div>

    <!-- Customer Details -->
    <div class="customer-card">
      <div class="section-title">BILL TO</div>
      <div class="customer-details-inline">
        <div class="customer-field"><strong>${escapeHtml(invoice.customer_name) || 'Walk-in Customer'}</strong></div>
        ${invoice.customer_phone ? `<div class="customer-field">📞 ${escapeHtml(invoice.customer_phone)}</div>` : ''}
        ${invoice.customer_email ? `<div class="customer-field">✉️ ${escapeHtml(invoice.customer_email)}</div>` : ''}
        ${invoice.customer_address ? `<div class="customer-field">📍 ${escapeHtml(invoice.customer_address)}</div>` : ''}
        ${invoice.customer_gst ? `<div class="customer-field"><span class="gst-chip">GST: ${escapeHtml(invoice.customer_gst)}</span></div>` : ''}
      </div>
    </div>

    <!-- Items Table -->
    <div class="items-section">
      <table class="modern-table">
        <thead>
          <tr>
            <th style="width: 5%">#</th>
            <th style="width: 40%">Item / Service</th>
            <th style="width: 10%" class="text-right">Qty</th>
            <th style="width: 13%" class="text-right">Price (₹)</th>
            <th style="width: 9%" class="text-center">GST%</th>
            <th style="width: 10%" class="text-right">Disc%</th>
            <th style="width: 13%" class="text-right">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${renderItemsSection(invoice)}
        </tbody>
      </table>
    </div>

    <!-- Summary & Payment Row -->
    <div class="summary-payment-row">
      <div class="summary-box">
        <div class="box-title">AMOUNT SUMMARY</div>
        <div class="summary-row">
          <span class="label">Subtotal</span>
          <span class="value">${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Total Discount</span>
          <span class="value" style="color: #2b7e3a;">- ${formatCurrency(totalDiscount)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Total GST</span>
          <span class="value">${formatCurrency(totalGST)}</span>
        </div>
        <div class="summary-row total-row">
          <span class="label" style="font-weight: 800;">GRAND TOTAL</span>
          <span class="value">${formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div class="payment-box">
        <div class="box-title">PAYMENT DETAILS</div>
        <div class="payment-line">
          <span>Amount Paid</span>
          <span class="amount-paid">${formatCurrency(paidAmount)}</span>
        </div>
        ${changeAmount > 0 ? `
          <div class="payment-line">
            <span>Change Returned</span>
            <span style="color: #2b6e49; font-weight: 600;">${formatCurrency(changeAmount)}</span>
          </div>
        ` : ''}
        ${dueAmount > 0 ? `
          <div class="payment-line">
            <span>Due Balance</span>
            <span class="due-amount">${formatCurrency(dueAmount)}</span>
          </div>
        ` : ''}
        <div class="payment-line" style="margin-top: 12px; border-top: 1px dashed #dee4ec; padding-top: 10px;">
          <span>Payment Mode</span>
          <span>${escapeHtml(invoice.payment_mode || invoice.payment_method || 'Cash / Online')}</span>
        </div>
        ${invoice.transaction_id ? `<div class="payment-line" style="font-size: 12px;"><span>Txn ID</span><span>${escapeHtml(invoice.transaction_id)}</span></div>` : ''}
        ${paidAmount >= totalAmount ? `<div class="payment-line" style="margin-top: 6px;"><span style="color: #2d6a4f;">✓ Payment settled</span><span></span></div>` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-note">
      <div>This is a computer generated ${isOrderDetails ? 'order summary' : 'invoice'}</div>
      <div style="margin-top: 4px;">Thank you for your business!</div>
    </div>
  </div>
</div>
</body>
</html>`

  // Helper function to render items section
  function renderItemsSection(invoice) {
    let html = ''
    
    // Products
    if (Array.isArray(invoice.items) && invoice.items.length > 0) {
      html += `<tr><td colspan="7" class="section-header">🛒 PRODUCTS</td></tr>`
      invoice.items.forEach((item, idx) => {
        const price = parseNumeric(item.price)
        const qty = parseNumeric(item.quantity, 1)
        const total = parseNumeric(item.total_price, price * qty)
        const gst = parseNumeric(item.gst)
        const discount = parseNumeric(item.discount)
        const productName = item.product?.name || item.product_name || item.name || 'Product'
        
        html += `<tr>
          <td>${idx + 1}</td>
          <td>${escapeHtml(productName)}</td>
          <td class="text-right">${qty}</td>
          <td class="text-right">${formatCurrency(price)}</td>
          <td class="text-center">${gst > 0 ? `${gst}%` : '—'}</td>
          <td class="text-right">${discount > 0 ? `${discount}%` : '—'}</td>
          <td class="text-right fw-semibold">${formatCurrency(total)}</td>
        </tr>`
      })
    }
    
    // Packages
    if (Array.isArray(invoice.packages) && invoice.packages.length > 0) {
      html += `<tr><td colspan="7" class="section-header" style="background: #eef2fa;">📦 PACKAGES</td></tr>`
      invoice.packages.forEach((pkg, idx) => {
        const price = parseNumeric(pkg.price)
        const qty = parseNumeric(pkg.quantity, 1)
        const total = parseNumeric(pkg.total_price, price * qty)
        const packageName = pkg.package_name || pkg.name || pkg.product_name || 'Package'
        
        html += `<tr>
          <td>${idx + 1}</td>
          <td>${escapeHtml(packageName)}</td>
          <td class="text-right">${qty}</td>
          <td class="text-right">${formatCurrency(price)}</td>
          <td class="text-center">—</td>
          <td class="text-right">—</td>
          <td class="text-right fw-semibold">${formatCurrency(total)}</td>
        </tr>`
      })
    }
    
    // No items
    if ((!invoice.items || invoice.items.length === 0) && (!invoice.packages || invoice.packages.length === 0)) {
      html += `<tr><td colspan="7" style="text-align: center; padding: 32px; color: #8aa0b5;">No items found</td></tr>`
    }
    
    return html
  }

  // Helper function to escape HTML
  function escapeHtml(str) {
    if (!str) return ''
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}

export default generateA4InvoiceHTML