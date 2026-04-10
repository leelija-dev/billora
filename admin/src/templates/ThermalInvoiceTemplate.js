/**
 * Thermal Invoice Template - Reusable component for generating 3-inch thermal invoice HTML
 * Matches the design from app-admin/src/components/bills/ThermalBillTemplate.jsx
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
  return num.toFixed(2)
}

// Calculate totals from invoice items
const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    return sum + parseNumber(item.total_price)
  }, 0)
}

const calculateTotalGST = (items) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    const itemPrice = parseNumber(item.price)
    const itemGst = parseNumber(item.gst)
    const quantity = parseNumber(item.quantity)
    const subtotal = itemPrice * quantity
    return sum + (subtotal * itemGst / 100)
  }, 0)
}

const calculateTotalDiscount = (items) => {
  if (!items || !Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    const itemPrice = parseNumber(item.price)
    const itemDiscount = parseNumber(item.discount)
    const quantity = parseNumber(item.quantity)
    const subtotal = itemPrice * quantity
    return sum + (subtotal * itemDiscount / 100)
  }, 0)
}

export const generateThermalInvoiceHTML = (invoice) => {
  if (!invoice) return ''

  const subtotal = calculateSubtotal(invoice.items) + calculateSubtotal(invoice.packages)
  const totalGST = calculateTotalGST(invoice.items) // Packages have 0 GST
  const totalDiscount = calculateTotalDiscount(invoice.items) // Packages have 0 discount
  const totalAmount = parseNumber(invoice.total_amount)
  const paidAmount = parseNumber(invoice.paid_amount)
  const changeAmount = paidAmount - totalAmount

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Thermal Invoice #${invoice.id}</title>
      <meta charset="utf-8">
      <style>
        @page {
          margin: 5mm;
          size: 80mm 297mm; /* 3-inch thermal paper */
        }
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 10px;
          background: #ffffff;
          color: #000;
          font-size: 12px;
          line-height: 1.2;
          width: 80mm;
        }
        .thermal-header {
          text-align: center;
          margin-bottom: 15px;
        }
        .thermal-header h1 {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 5px 0;
          text-transform: uppercase;
        }
        .thermal-header .subtitle {
          font-size: 10px;
          margin: 2px 0;
        }
        .separator {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .invoice-info {
          margin-bottom: 10px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
          font-size: 10px;
        }
        .info-label {
          color: #666;
        }
        .info-value {
          font-weight: bold;
        }
        .customer-info {
          margin-bottom: 10px;
          font-size: 10px;
          font-weight: bold;
        }
        .items-header {
          display: flex;
          margin-bottom: 5px;
          font-size: 10px;
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
        }
        .item-col {
          padding: 0 2px;
        }
        .item-name {
          flex: 3;
        }
        .item-qty {
          flex: 1;
          text-align: right;
        }
        .item-price {
          flex: 1;
          text-align: right;
        }
        .item-total {
          flex: 1;
          text-align: right;
        }
        .item-row {
          display: flex;
          margin: 2px 0;
          font-size: 9px;
        }
        .summary {
          margin: 10px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
          font-size: 10px;
        }
        .total-row {
          font-weight: bold;
          font-size: 12px;
          border-top: 1px solid #000;
          padding-top: 2px;
          margin-top: 5px;
        }
        .total-amount {
          color: #000;
          font-size: 14px;
        }
        .payment-row {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
          font-size: 10px;
        }
        .paid-amount {
          color: #000;
          font-weight: bold;
        }
        .change-amount {
          color: #000;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          font-size: 9px;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 5px; }
        }
      </style>
    </head>
    <body>
      <!-- Store Header -->
      <div class="thermal-header">
        <h1>${invoice.store_name || 'Your Store Name'}</h1>
        <div class="subtitle">${invoice.store_address || 'Store Address'}</div>
        <div class="subtitle">Tel: ${invoice.store_phone || 'Store Phone'}</div>
      </div>

      <!-- Separator -->
      <div class="separator"></div>

      <!-- Invoice Info -->
      <div class="invoice-info">
        <div class="info-row">
          <span class="info-label">Invoice:</span>
          <span class="info-value">${invoice.invoice_number || `INV-${invoice.id}`}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${new Date(invoice.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="customer-info">
        Customer ID: ${invoice.customer_id || 'Walk-in Customer'}
      </div>

      <!-- Separator -->
      <div class="separator"></div>

      <!-- Items Header -->
      <div class="items-header">
        <div class="item-col item-name">Item</div>
        <div class="item-col item-qty">Qty</div>
        <div class="item-col item-price">Price</div>
        <div class="item-col item-total">Total</div>
      </div>

      <!-- Items List -->
      ${invoice.items?.map((item, index) => {
        const itemPrice = parseNumber(item.price)
        const itemTotal = parseNumber(item.total_price)
        const quantity = parseNumber(item.quantity)
        
        return `
          <div class="item-row">
            <div class="item-col item-name">${item.product_name || `Product #${item.product_id}`}</div>
            <div class="item-col item-qty">${quantity}</div>
            <div class="item-col item-price">Rs${formatCurrency(itemPrice)}</div>
            <div class="item-col item-total">Rs${formatCurrency(itemTotal)}</div>
          </div>
        `
      }).join('')}

      <!-- Packages List -->
      ${invoice.packages?.map((pkg, index) => {
        const pkgPrice = parseNumber(pkg.price)
        const pkgTotal = parseNumber(pkg.total_price)
        const quantity = parseNumber(pkg.quantity)
        
        return `
          <div class="item-row">
            <div class="item-col item-name">${pkg.package_name || `Package #${pkg.package_id}`}</div>
            <div class="item-col item-qty">${quantity}</div>
            <div class="item-col item-price">Rs${formatCurrency(pkgPrice)}</div>
            <div class="item-col item-total">Rs${formatCurrency(pkgTotal)}</div>
          </div>
        `
      }).join('')}

      <!-- Separator -->
      <div class="separator"></div>

      <!-- Summary -->
      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>Rs${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>GST:</span>
          <span>Rs${formatCurrency(totalGST)}</span>
        </div>
        <div class="summary-row">
          <span>Discount:</span>
          <span style="color: #000;">-Rs${formatCurrency(totalDiscount)}</span>
        </div>
        <div class="summary-row total-row">
          <span>TOTAL:</span>
          <span class="total-amount">Rs${formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <!-- Payment -->
      <div class="payment">
        <div class="payment-row">
          <span>Paid:</span>
          <span class="paid-amount">Rs${formatCurrency(paidAmount)}</span>
        </div>
        ${changeAmount > 0 ? `
          <div class="payment-row">
            <span>Change:</span>
            <span class="change-amount">Rs${formatCurrency(changeAmount)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Separator -->
      <div class="separator"></div>

      <!-- Footer -->
      <div class="footer">
        <div>Thank you for your purchase!</div>
        <div>${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
      </div>
    </body>
    </html>
  `
}

export default generateThermalInvoiceHTML
