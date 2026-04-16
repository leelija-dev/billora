/**
 * A4 Invoice Template - Reusable component for generating A4 invoice HTML
 * Matches the design from app-admin/src/components/bills/A4BillTemplate.jsx
 */
export const generateA4InvoiceHTML = (invoice) => {
  if (!invoice) return ''

  const totalAmount = parseFloat(invoice.total_amount || invoice.totalAmount || 0)
  const paidAmount = parseFloat(invoice.paid_amount || invoice.paidAmount || 0)
  const changeAmount = paidAmount - totalAmount

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${invoice.id}</title>
      <meta charset="utf-8">
      <style>
        @page {
          margin: 20mm;
          size: A4;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 32px;
          background: #ffffff;
          color: #333;
          line-height: 1.4;
        }
        .invoice-header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 32px;
        }
        .invoice-header h1 {
          color: #333;
          font-size: 32px;
          margin: 0 0 10px 0;
          font-weight: 700;
        }
        .invoice-header .subtitle {
          color: #666;
          font-size: 16px;
          margin: 0;
        }
        .invoice-header .store-info {
          color: #666;
          font-size: 14px;
          margin: 4px 0;
        }
        .invoice-title {
          text-align: center;
          margin-bottom: 24px;
        }
        .invoice-title h2 {
          color: #333;
          font-size: 24px;
          margin: 0 0 16px 0;
          font-weight: 700;
        }
        .invoice-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .invoice-meta-item {
          text-align: left;
        }
        .invoice-meta-item .label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
        .invoice-meta-item .value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .customer-details {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #e9ecef;
        }
        .customer-details h3 {
          color: #495057;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .customer-details .info {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .customer-details .info-small {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 12px;
        }
        .items-table th {
          background: #333;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #333;
        }
        .items-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #e9ecef;
        }
        .items-table .text-right {
          text-align: right;
        }
        .items-table .text-bold {
          font-weight: 600;
        }
        .items-table .text-green {
          color: #28a745;
        }
        .summary-section {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #e9ecef;
        }
        .summary-section h3 {
          color: #495057;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .summary-row .label {
          color: #666;
        }
        .summary-row .value {
          font-weight: 600;
          color: #333;
        }
        .summary-row.total {
          border-top: 1px solid #dee2e6;
          padding-top: 8px;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 700;
        }
        .summary-row.total .value {
          color: #007bff;
        }
        .payment-details {
          background: #e8f5e8;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #c3e6cb;
        }
        .payment-details h3 {
          color: #155724;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .payment-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 14px;
        }
        .payment-row .label {
          color: #666;
        }
        .payment-row .value {
          font-weight: 600;
          color: #155724;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }
        .footer .text {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }
        .footer .text-small {
          font-size: 12px;
          color: #999;
        }
        @media print {
          body { margin: 0; padding: 10px; }
          .items-table { page-break-inside: avoid; }
          .summary-section { page-break-inside: avoid; }
          .payment-details { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <!-- Store Header -->
      <div class="invoice-header">
        <h1>${invoice.store_name || 'Your Store Name'}</h1>
        <div class="subtitle">${invoice.store_address || '123 Business Street, City'}</div>
        ${invoice.store_gst ? `<div class="store-info">GST: ${invoice.store_gst}</div>` : ''}
        ${invoice.store_email ? `<div class="store-info">${invoice.store_email} | ${invoice.store_phone || '123-456-7890'}</div>` : ''}
      </div>

      <!-- Invoice Title -->
      <div class="invoice-title">
        <h2>TAX INVOICE</h2>
        <div class="invoice-meta">
          <div class="invoice-meta-item">
            <div class="label">Invoice No:</div>
            <div class="value">${invoice.invoice_number || invoice.id}</div>
          </div>
          <div class="invoice-meta-item">
            <div class="label">Date:</div>
            <div class="value">${new Date(invoice.created_at).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>

      <!-- Customer Details -->
      <div class="customer-details">
        <h3>Bill To:</h3>
        <div class="info">${invoice.customer_name || 'Walk-in Customer'}</div>
        ${invoice.customer_phone ? `<div class="info-small">Phone: ${invoice.customer_phone}</div>` : ''}
        ${invoice.customer_email ? `<div class="info-small">Email: ${invoice.customer_email}</div>` : ''}
        ${invoice.customer_address ? `<div class="info-small">${invoice.customer_address}</div>` : ''}
        ${invoice.customer_gst ? `<div class="info-small">GST: ${invoice.customer_gst}</div>` : ''}
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 5%">#</th>
            <th style="width: 35%">Description</th>
            <th style="width: 15%" class="text-right">Qty</th>
            <th style="width: 15%" class="text-right">Price</th>
            <th style="width: 10%" class="text-right">GST</th>
            <th style="width: 10%" class="text-right">Disc</th>
            <th style="width: 10%" class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <!-- Products Section -->
          ${invoice.items && invoice.items.length > 0 ? `
          <tr>
            <td colspan="7" style="background: #f8f9fa; padding: 8px; font-weight: bold; border-bottom: 2px solid #dee2e6;">
              PRODUCTS
            </td>
          </tr>
          ${invoice.items?.map((item, index) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
            const itemTotal = typeof item.total_price === 'string' ? parseFloat(item.total_price) : (typeof item.total_price === 'number' ? item.total_price : 0);
            const itemGst = typeof item.gst === 'string' ? parseFloat(item.gst) : (typeof item.gst === 'number' ? item.gst : 0);
            const itemDiscount = typeof item.discount === 'string' ? parseFloat(item.discount) : (typeof item.discount === 'number' ? item.discount : 0);
            
            return `
            <tr>
              <td>${index + 1}</td>
              <td>${item.product?.name || item.product_name || 'N/A'}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">₹${itemPrice.toFixed(2)}</td>
              <td class="text-right">${itemGst || 0}%</td>
              <td class="text-right">${itemDiscount || 0}%</td>
              <td class="text-right text-bold text-green">₹${itemTotal.toFixed(2)}</td>
            </tr>
            `.trim();
          }).join('')}
          ` : ''}
          
          <!-- Packages Section -->
          ${invoice.packages && invoice.packages.length > 0 ? `
          <tr>
            <td colspan="7" style="background: #e3f2fd; padding: 8px; font-weight: bold; border-bottom: 2px solid #dee2e6;">
              PACKAGES
            </td>
          </tr>
          ${invoice.packages?.map((pkg, index) => {
            const pkgPrice = typeof pkg.price === 'string' ? parseFloat(pkg.price) : (typeof pkg.price === 'number' ? pkg.price : 0);
            const pkgTotal = typeof pkg.total_price === 'string' ? parseFloat(pkg.total_price) : (typeof pkg.total_price === 'number' ? pkg.total_price : 0);
            
            return `
            <tr>
              <td>${index + 1}</td>
              <td>${pkg.package_name || pkg.product_name}</td>
              <td class="text-right">${pkg.quantity}</td>
              <td class="text-right">₹${pkgPrice.toFixed(2)}</td>
              <td class="text-right">0%</td>
              <td class="text-right">0%</td>
              <td class="text-right text-bold text-blue">₹${pkgTotal.toFixed(2)}</td>
            </tr>
            `.trim();
          }).join('')}
          ` : ''}
        </tbody>
      </table>

      <!-- Summary Section -->
      <div class="summary-section">
        <h3>Summary</h3>
        <div class="summary-row">
          <span class="label">Subtotal:</span>
          <span class="value">₹${(totalAmount || 0).toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Total GST:</span>
          <span class="value">₹${((invoice.items?.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
            const itemGst = typeof item.gst === 'string' ? parseFloat(item.gst) : (typeof item.gst === 'number' ? item.gst : 0);
            const subtotal = itemPrice * parseFloat(item.quantity || 0);
            return sum + (subtotal * itemGst / 100);
          }, 0) || 0) + (invoice.packages?.reduce((sum, pkg) => {
            const pkgPrice = typeof pkg.price === 'string' ? parseFloat(pkg.price) : (typeof pkg.price === 'number' ? pkg.price : 0);
            return sum + (pkgPrice * parseFloat(pkg.quantity || 0)); // Packages have 0 GST
          }, 0) || 0)).toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="label">Total Discount:</span>
          <span class="value" style="color: #28a745;">-₹${((invoice.items?.reduce((sum, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
            const itemDiscount = typeof item.discount === 'string' ? parseFloat(item.discount) : (typeof item.discount === 'number' ? item.discount : 0);
            const subtotal = itemPrice * parseFloat(item.quantity || 0);
            return sum + (subtotal * itemDiscount / 100);
          }, 0) || 0) + (invoice.packages?.reduce((sum, pkg) => {
            const pkgPrice = typeof pkg.price === 'string' ? parseFloat(pkg.price) : (typeof pkg.price === 'number' ? pkg.price : 0);
            return sum + 0; // Packages have 0 discount
          }, 0) || 0)).toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Grand Total:</span>
          <span class="value">₹${(totalAmount || 0).toFixed(2)}</span>
        </div>
      </div>

      <!-- Payment Details -->
      <div class="payment-details">
        <h3>Payment Details:</h3>
        <div class="payment-row">
          <span class="label">Amount Paid:</span>
          <span class="value">₹${(paidAmount || 0).toFixed(2)}</span>
        </div>
        ${changeAmount > 0 ? `
          <div class="payment-row">
            <span class="label">Change Returned:</span>
            <span class="value">₹${(changeAmount || 0).toFixed(2)}</span>
          </div>
        ` : paidAmount < totalAmount ? `
          <div class="payment-row">
            <span class="label">Due Amount:</span>
            <span class="value" style="color: #dc3545;">₹${(totalAmount - paidAmount).toFixed(2)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="text">This is a computer generated invoice</div>
        <div class="text-small">Thank you for your business!</div>
      </div>
    </body>
    </html>
  `
}

export default generateA4InvoiceHTML
