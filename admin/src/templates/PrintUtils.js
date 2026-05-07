/**
 * Print Utilities - Reusable printing functions for invoices
 * Can be used across different pages for consistent printing behavior
 */

import { generateA4InvoiceHTML } from './A4InvoiceTemplate'
import { generateThermalInvoiceHTML } from './ThermalInvoiceTemplate'

/**
 * Print A4 invoice using iframe
 * @param {Object} invoice - Invoice data object
 */
export const printA4Invoice = (invoice) => {
  if (!invoice) {
    console.error('No invoice data provided for A4 printing')
    return
  }

  try {
    // Generate HTML content
    const htmlContent = generateA4InvoiceHTML(invoice)
    
    // Create blob from HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Create iframe for printing
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    iframe.style.top = '-9999px'
    iframe.style.width = '210mm' // A4 width
    iframe.style.height = '297mm' // A4 height
    
    document.body.appendChild(iframe)
    
    // Load content via blob URL
    iframe.src = url
    
    // Wait for content to load, then print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 1000)
      }, 500)
    }
  } catch (error) {
    console.error('Error printing A4 invoice:', error)
    // Fallback to window.print
    window.print()
  }
}

/**
 * Print Thermal invoice (3-inch) using iframe
 * @param {Object} invoice - Invoice data object
 */
export const printThermalInvoice = (invoice) => {
  if (!invoice) {
    console.error('No invoice data provided for thermal printing')
    return
  }

  try {
    // Generate HTML content
    const htmlContent = generateThermalInvoiceHTML(invoice)
    
    // Create blob from HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Create iframe for printing with thermal paper dimensions
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    iframe.style.top = '-9999px'
    iframe.style.width = '80mm' // 3-inch thermal paper width
    iframe.style.height = '297mm' // Standard height
    
    document.body.appendChild(iframe)
    
    // Load content via blob URL
    iframe.src = url
    
    // Wait for content to load, then print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(iframe)
          URL.revokeObjectURL(url)
        }, 1000)
      }, 500)
    }
  } catch (error) {
    console.error('Error printing thermal invoice:', error)
    // Fallback to window.print
    window.print()
  }
}

/**
 * Download invoice as PDF (placeholder for future implementation)
 * @param {Object} invoice - Invoice data object
 * @param {string} type - 'a4' or 'thermal'
 */
export const downloadInvoicePDF = (invoice, type = 'a4') => {
  if (!invoice) {
    console.error('No invoice data provided for PDF download')
    return
  }

  try {
    // Generate HTML content based on type
    const htmlContent = type === 'thermal' 
      ? generateThermalInvoiceHTML(invoice)
      : generateA4InvoiceHTML(invoice)
    
    // Create a temporary container for the content
    const container = document.createElement('div')
    container.innerHTML = htmlContent
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    
    document.body.appendChild(container)
    
    // Note: In a real implementation, you would use html2pdf library
    // For now, just opening in new window for printing/saving
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(container)
    }, 1000)
    
  } catch (error) {
    console.error('Error downloading invoice PDF:', error)
  }
}

/**
 * Print invoice with automatic type detection
 * @param {Object} invoice - Invoice data object
 * @param {string} type - 'a4', 'thermal', or 'auto'
 */
export const printInvoice = (invoice, type = 'auto') => {
  if (!invoice) {
    console.error('No invoice data provided for printing')
    return
  }

  switch (type) {
    case 'a4':
      printA4Invoice(invoice)
      break
    case 'thermal':
      printThermalInvoice(invoice)
      break
    case 'auto':
    default:
      // Auto-detect based on screen size or user preference
      // For now, default to A4
      printA4Invoice(invoice)
      break
  }
}

export default {
  printA4Invoice,
  printThermalInvoice,
  downloadInvoicePDF,
  printInvoice,
  generateA4InvoiceHTML,
  generateThermalInvoiceHTML
}
