# Invoice Printing Templates

This directory contains reusable invoice printing templates that can be used across different pages in the application.

## Files

- **A4InvoiceTemplate.js** - A4 invoice HTML template generator
- **ThermalInvoiceTemplate.js** - 3-inch thermal invoice HTML template generator  
- **PrintUtils.js** - Printing utility functions
- **README.md** - This documentation

## Usage

### Basic Usage in Any Component

```javascript
import { printA4Invoice, printThermalInvoice, downloadInvoicePDF } from '../templates/PrintUtils'

// In your component
const MyComponent = () => {
  const invoice = {
    id: 123,
    invoice_number: 'INV-123',
    customer_name: 'John Doe',
    total_amount: 1000,
    paid_amount: 1000,
    items: [
      {
        product_id: 1,
        product_name: 'Product A',
        price: 500,
        quantity: 2,
        total_price: 1000,
        gst: 18,
        discount: 0
      }
    ],
    // ... other invoice data
    store_name: 'My Store',
    store_address: '123 Store Street',
    // ... store and customer details
  }

  const handleA4Print = () => {
    printA4Invoice(invoice)
  }

  const handleThermalPrint = () => {
    printThermalInvoice(invoice)
  }

  const handleDownloadPDF = () => {
    downloadInvoicePDF(invoice, 'a4') // or 'thermal'
  }

  return (
    <div>
      <button onClick={handleA4Print}>Print A4</button>
      <button onClick={handleThermalPrint}>Print Thermal</button>
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  )
}
```

### Advanced Usage

```javascript
import { 
  printA4Invoice, 
  printThermalInvoice, 
  downloadInvoicePDF,
  printInvoice,
  generateA4InvoiceHTML,
  generateThermalInvoiceHTML 
} from '../templates/PrintUtils'

// Generate HTML content without printing
const htmlContent = generateA4InvoiceHTML(invoice)

// Print with auto-detection
printInvoice(invoice, 'auto') // 'a4', 'thermal', or 'auto'

// Download specific format
downloadInvoicePDF(invoice, 'thermal')
```

## Template Features

### A4 Template
- Professional layout with store header
- Customer details section
- 7-column items table (#, Description, Qty, Price, GST, Disc, Total)
- Summary calculations
- Payment details
- Footer with computer generated note

### Thermal Template  
- Compact 3-inch thermal printer layout
- Store header with centered text
- 4-column items table (Item, Qty, Price, Total)
- Dashed separators for thermal printer style
- Summary and payment sections
- Thank you message with timestamp

## Invoice Data Structure

The templates expect the following invoice data structure:

```javascript
const invoice = {
  // Basic invoice info
  id: 123,
  invoice_number: 'INV-123',
  created_at: '2023-12-25T10:30:00Z',
  status: 'paid',
  
  // Store information
  store_name: 'My Store Name',
  store_address: '123 Store Street, City',
  store_phone: '123-456-7890',
  store_email: 'store@example.com',
  store_gst: 'GSTIN123456',
  
  // Customer information
  customer_id: 456,
  customer_name: 'John Doe',
  customer_phone: '987-654-3210',
  customer_email: 'customer@example.com',
  customer_address: '456 Customer Street, City',
  customer_gst: 'GSTIN789012',
  
  // Financial information
  total_amount: 1000,
  paid_amount: 1000,
  
  // Items array
  items: [
    {
      id: 1,
      product_id: 1,
      product_name: 'Product Name',
      price: 500,
      quantity: 2,
      total_price: 1000,
      gst: 18,
      discount: 0
    }
    // ... more items
  ]
}
```

## Styling

Both templates include comprehensive CSS styling:

- **A4 Template**: Professional business styling with proper margins, fonts, and colors
- **Thermal Template**: Monospace font for thermal printers, compact layout, dashed borders

## Browser Compatibility

The templates use modern CSS features and are compatible with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Print Optimization

- A4 template uses `@page` CSS for proper A4 margins
- Thermal template uses 80mm width for 3-inch thermal paper
- Both templates include print media queries for optimal printing
- iframe-based printing for clean print experience

## Error Handling

The print utilities include error handling:
- Fallback to `window.print()` if iframe printing fails
- Console logging for debugging
- Graceful handling of missing invoice data

## Customization

You can customize the templates by:
1. Modifying the CSS in the template files
2. Adding new template variants
3. Extending the utility functions
4. Creating custom print handlers

## Integration Examples

### In Invoice Detail Page
```javascript
import { printA4Invoice, printThermalInvoice } from '../templates/PrintUtils'

const InvoiceDetail = ({ invoice }) => {
  return (
    <div>
      {/* Invoice content */}
      <button onClick={() => printA4Invoice(invoice)}>Print A4</button>
      <button onClick={() => printThermalInvoice(invoice)}>Print Thermal</button>
    </div>
  )
}
```

### In Invoice List Page  
```javascript
import { printInvoice } from '../templates/PrintUtils'

const InvoiceList = ({ invoices }) => {
  return (
    <table>
      {invoices.map(invoice => (
        <tr key={invoice.id}>
          <td>{invoice.invoice_number}</td>
          <td>
            <button onClick={() => printInvoice(invoice, 'thermal')}>
              Quick Print
            </button>
          </td>
        </tr>
      ))}
    </table>
  )
}
```

### In Sales Dashboard
```javascript
import { downloadInvoicePDF } from '../templates/PrintUtils'

const SalesDashboard = ({ recentInvoices }) => {
  const handleBulkDownload = () => {
    recentInvoices.forEach(invoice => {
      downloadInvoicePDF(invoice, 'a4')
    })
  }

  return (
    <div>
      <button onClick={handleBulkDownload}>
        Download All Invoices
      </button>
    </div>
  )
}
```
