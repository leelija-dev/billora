import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const COLORS = {
  primary: [79, 70, 229],     // Indigo
  secondary: [99, 102, 241],  // Purple
  success: [16, 185, 129],
  warning: [245, 158, 11],
  dark: [30, 41, 59],
  gray: [100, 116, 139],
  border: [226, 232, 240],
  cardBg: [248, 250, 252],
  lightBg: [241, 245, 249],
  white: [255, 255, 255]
};

// Safe currency formatter for PDF (removes special characters)
const formatCurrencyForPDF = (amount) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '0.00';
  
  return numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Professional PDF Generation for Report/Invoice
export const generateReportPDF = (reportData) => {
  const { report, company, formatCurrency, formatDate, getProductName, productDetails } = reportData;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let yPosition = margin;

  const checkAndAddPage = (space = 20) => {
    if (yPosition + space > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Header with gradient effect
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setFillColor(...COLORS.secondary);
  doc.rect(0, 45, pageWidth, 8, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', margin, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #${report.invoice_number}`, margin, 30);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    margin,
    38
  );

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.white);

  doc.text(
    company?.name || 'Business Name',
    pageWidth - margin,
    20,
    { align: 'right' }
  );

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  doc.text(
    `GST: ${company?.gst || 'N/A'}`,
    pageWidth - margin,
    28,
    { align: 'right' }
  );

  yPosition = 65;

  // Status Banner
  const statusColor = report.status === 'completed' ? COLORS.success : COLORS.warning;

  doc.setFillColor(...statusColor);
  doc.roundedRect(
    margin,
    yPosition,
    contentWidth,
    12,
    4,
    4,
    'F'
  );

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  doc.text(
    `STATUS : ${report.status.toUpperCase()}`,
    margin + 5,
    yPosition + 8
  );

  doc.text(
    formatDate(report.created_at),
    pageWidth - margin - 5,
    yPosition + 8,
    { align: 'right' }
  );

  yPosition += 20;

  // Customer and Store Information Grid
  const dueAmount = report.total_amount - report.paid_amount;

  // Customer Info Box
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(
    margin,
    yPosition,
    (contentWidth - 10) / 2,
    75,
    4,
    4,
    'FD'
  );
  
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin + 5, yPosition + 10);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  let customerY = yPosition + 18;
  doc.text(`Name: ${report.customer_name}`, margin + 5, customerY);
  customerY += 6;
  
  if (report.customer?.email) {
    doc.text(`Email: ${report.customer.email}`, margin + 5, customerY);
    customerY += 6;
  }
  
  if (report.customer?.phone) {
    doc.text(`Phone: ${report.customer.phone}`, margin + 5, customerY);
    customerY += 6;
  }
  
  if (report.customer?.address) {
    const address = doc.splitTextToSize(
      `Address: ${report.customer.address} ${report.customer.city || ''}`,
      (contentWidth - 10) / 2 - 10
    );
    doc.text(address, margin + 5, customerY);
    customerY += address.length * 5;
  }
  
  if (report.customer?.gst_number) {
    doc.text(`GST: ${report.customer.gst_number}`, margin + 5, customerY);
  }

  // Store Info Box - FIXED: Same height and proper fill
  const storeX = margin + (contentWidth - 10) / 2 + 10;
  
  // Explicitly set white fill color for Store box
  doc.setFillColor(255, 255, 255);  // Force white background
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(
    storeX, 
    yPosition, 
    (contentWidth - 10) / 2, 
    75,  // Changed from 70 to 75 to match Bill To box
    3, 
    3, 
    'FD'  // Fill and Draw
  );
  
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Store Information:', storeX + 5, yPosition + 10);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  let storeY = yPosition + 18;
  doc.text(`Store: ${report.store_name}`, storeX + 5, storeY);
  storeY += 6;
  
  if (report.store?.mobile) {
    doc.text(`Contact: ${report.store.mobile}`, storeX + 5, storeY);
    storeY += 6;
  }
  
  if (report.store?.email) {
    doc.text(`Email: ${report.store.email}`, storeX + 5, storeY);
    storeY += 6;
  }
  
  if (report.store?.gst) {
    doc.text(`GST: ${report.store.gst}`, storeX + 5, storeY);
    storeY += 6;
  }
  
  if (report.store?.address) {
    const address = doc.splitTextToSize(
      `Address: ${report.store.address} ${report.store.city || ''}`,
      (contentWidth - 10) / 2 - 10
    );
    doc.text(address, storeX + 5, storeY);
  }

  yPosition += 80;

  // Items Table
  checkAndAddPage(60);
  
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Items', margin, yPosition);
  
  yPosition += 8;

  // Create table data with properly formatted numbers (no currency symbols)
  const tableData = report.invoice_items.map((item, idx) => {
    // Ensure values are numbers
    const price = parseFloat(item.price) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const totalPrice = parseFloat(item.total_price) || 0;
    const gst = parseFloat(item.gst) || 0;
    const discount = parseFloat(item.discount) || 0;
    
    return [
      idx + 1,
      getProductName(item.product_id, item.product_name),
      quantity,
      formatCurrencyForPDF(price),
      `${gst}%`,
      `${discount}%`,
      formatCurrencyForPDF(totalPrice)
    ];
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['#', 'Product', 'Qty', 'Price (₹)', 'GST', 'Disc', 'Total (₹)']],
    body: tableData,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left',
      textColor: COLORS.dark,
      font: 'helvetica'
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: COLORS.lightBg
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left', cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 15 },
      3: { halign: 'right', cellWidth: 30 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'right', cellWidth: 35 }
    },
    tableWidth: 'auto',
    margin: { left: margin, right: margin }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Financial Summary
  checkAndAddPage(50);
  
  const summaryX = pageWidth - margin - 80;
  const summaryWidth = 80;
  
  doc.setFillColor(...COLORS.cardBg);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(summaryX, yPosition, summaryWidth, 50, 3, 3, 'FD');
  
  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  let summaryY = yPosition + 10;
  doc.text('Subtotal:', summaryX + 8, summaryY);
  doc.text(formatCurrencyForPDF(report.total_amount), summaryX + summaryWidth - 12, summaryY, { align: 'right' });
  
  summaryY += 8;
  doc.text('Paid Amount:', summaryX + 8, summaryY);
  doc.text(formatCurrencyForPDF(report.paid_amount), summaryX + summaryWidth - 12, summaryY, { align: 'right' });
  
  summaryY += 8;
  doc.setDrawColor(...COLORS.border);
  doc.line(summaryX + 5, summaryY, summaryX + summaryWidth - 5, summaryY);
  
  summaryY += 8;
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('Due Amount:', summaryX + 8, summaryY);
  
  // Color code the due amount based on value
  if (dueAmount > 0) {
    doc.setTextColor(...COLORS.warning);
  } else if (dueAmount === 0) {
    doc.setTextColor(...COLORS.success);
  } else {
    doc.setTextColor(...COLORS.primary);
  }
  
  doc.text(formatCurrencyForPDF(dueAmount), summaryX + summaryWidth - 12, summaryY, { align: 'right' });

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    
    doc.text(
      `Thank you for your business! | Generated by ${company?.name || 'Business'} | Page ${i} of ${pages}`,
      margin,
      pageHeight - 10
    );
    
    doc.text(
      'This is a computer generated invoice and does not require a signature.',
      margin,
      pageHeight - 5
    );
  }

  doc.save(`invoice-${report.invoice_number}-${Date.now()}.pdf`);
};

// Generate Excel Export
export const generateReportExcel = (reportData) => {
  const { report, formatCurrency, formatDate, getProductName, productDetails } = reportData;

  // Prepare invoice summary sheet
  const summaryData = [
    ['INVOICE SUMMARY'],
    [''],
    ['Invoice Number', report.invoice_number],
    ['Invoice Date', formatDate(report.created_at)],
    ['Status', report.status.toUpperCase()],
    [''],
    ['CUSTOMER INFORMATION'],
    ['Customer Name', report.customer_name],
    ['Customer ID', report.customer_id],
    ['Email', report.customer?.email || 'N/A'],
    ['Phone', report.customer?.phone || 'N/A'],
    ['Address', `${report.customer?.address || ''} ${report.customer?.city || ''}`.trim() || 'N/A'],
    ['GST Number', report.customer?.gst_number || 'N/A'],
    [''],
    ['STORE INFORMATION'],
    ['Store Name', report.store_name],
    ['Store ID', report.store_id],
    ['Contact', report.store?.mobile || 'N/A'],
    ['Email', report.store?.email || 'N/A'],
    ['GST', report.store?.gst || 'N/A'],
    ['Address', `${report.store?.address || ''} ${report.store?.city || ''}`.trim() || 'N/A'],
    [''],
    ['FINANCIAL SUMMARY'],
    ['Total Amount', formatCurrency(report.total_amount)],
    ['Paid Amount', formatCurrency(report.paid_amount)],
    ['Due Amount', formatCurrency(report.total_amount - report.paid_amount)],
    ['Total Items', report.total_items]
  ];

  // Prepare items sheet
  const itemsData = [
    ['#', 'Product ID', 'Product Name', 'Quantity', 'Price', 'GST', 'Discount', 'Total Price']
  ];

  report.invoice_items.forEach((item, idx) => {
    itemsData.push([
      idx + 1,
      item.product_id,
      getProductName(item.product_id, item.product_name),
      item.quantity,
      formatCurrency(item.price),
      `${item.gst}%`,
      `${item.discount}%`,
      formatCurrency(item.total_price)
    ]);
  });

  // Create workbook and sheets
  const wb = XLSX.utils.book_new();
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData);
  
  // Adjust column widths
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 40 }];
  itemsSheet['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 8 }, { wch: 8 }, { wch: 15 }];
  
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Invoice Summary');
  XLSX.utils.book_append_sheet(wb, itemsSheet, 'Invoice Items');
  
  // Save file
  XLSX.writeFile(wb, `invoice-${report.invoice_number}.xlsx`);
};

// Generate Word Export (using HTML)
export const generateReportWord = async (reportData) => {
  const { report, company, formatCurrency, formatDate, getProductName, productDetails } = reportData;
  
  // Create HTML content for Word
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${report.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .company-info {
          text-align: right;
          float: right;
        }
        .status-banner {
          background: ${report.status === 'completed' ? '#10b981' : '#f59e0b'};
          color: white;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: bold;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
        }
        .info-title {
          color: #4f46e5;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          text-align: left;
        }
        th {
          background: #4f46e5;
          color: white;
          font-weight: bold;
        }
        .financial-summary {
          float: right;
          width: 250px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .amount {
          text-align: right;
        }
        .due-positive {
          color: #f59e0b;
        }
        .due-zero {
          color: #10b981;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <strong>${company?.name || 'Business Name'}</strong><br>
          GST: ${company?.gst || 'N/A'}
        </div>
        <div class="invoice-title">INVOICE</div>
        <div>Invoice #${report.invoice_number}</div>
        <div>Generated: ${new Date().toLocaleString()}</div>
      </div>
      
      <div class="status-banner">
        STATUS: ${report.status.toUpperCase()} | ${formatDate(report.created_at)}
      </div>
      
      <div class="grid-container">
        <div class="info-box">
          <div class="info-title">Bill To:</div>
          <div><strong>Name:</strong> ${report.customer_name}</div>
          ${report.customer?.email ? `<div><strong>Email:</strong> ${report.customer.email}</div>` : ''}
          ${report.customer?.phone ? `<div><strong>Phone:</strong> ${report.customer.phone}</div>` : ''}
          ${report.customer?.address ? `<div><strong>Address:</strong> ${report.customer.address} ${report.customer.city || ''}</div>` : ''}
          ${report.customer?.gst_number ? `<div><strong>GST:</strong> ${report.customer.gst_number}</div>` : ''}
        </div>
        
        <div class="info-box">
          <div class="info-title">Store Information:</div>
          <div><strong>Store:</strong> ${report.store_name}</div>
          ${report.store?.mobile ? `<div><strong>Contact:</strong> ${report.store.mobile}</div>` : ''}
          ${report.store?.email ? `<div><strong>Email:</strong> ${report.store.email}</div>` : ''}
          ${report.store?.gst ? `<div><strong>GST:</strong> ${report.store.gst}</div>` : ''}
          ${report.store?.address ? `<div><strong>Address:</strong> ${report.store.address} ${report.store.city || ''}</div>` : ''}
        </div>
      </div>
      
      <h3>Invoice Items</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>GST</th>
            <th>Disc</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${report.invoice_items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${getProductName(item.product_id, item.product_name)}</td>
              <td>${item.quantity}</td>
              <td class="amount">${formatCurrency(item.price)}</td>
              <td>${item.gst}%</td>
              <td>${item.discount}%</td>
              <td class="amount">${formatCurrency(item.total_price)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background: #f1f5f9;">
            <td colspan="6" style="text-align: right;"><strong>Total</strong></td>
            <td class="amount"><strong>${formatCurrency(report.total_amount)}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div class="financial-summary">
        <div><strong>Subtotal:</strong> <span class="amount">${formatCurrency(report.total_amount)}</span></div>
        <div><strong>Paid Amount:</strong> <span class="amount">${formatCurrency(report.paid_amount)}</span></div>
        <hr>
        <div><strong>Due Amount:</strong> <span class="amount ${report.total_amount - report.paid_amount > 0 ? 'due-positive' : 'due-zero'}">${formatCurrency(report.total_amount - report.paid_amount)}</span></div>
      </div>
      
      <div class="footer">
        Thank you for your business! | Generated by ${company?.name || 'Business'}<br>
        This is a computer generated invoice and does not require a signature.
      </div>
    </body>
    </html>
  `;
  
  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  saveAs(blob, `invoice-${report.invoice_number}.doc`);
};

// Handle Print
export const handleReportPrint = async (reportData, { setIsPrinting }) => {
  const { report, company, formatCurrency, formatDate, getProductName, productDetails } = reportData;
  
  setIsPrinting(true);
  
  // Create a hidden iframe for printing
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = 'none';
  document.body.appendChild(printFrame);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${report.invoice_number}</title>
      <style>
        @media print {
          body {
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .company-info {
          text-align: right;
          float: right;
        }
        .status-banner {
          background: ${report.status === 'completed' ? '#10b981' : '#f59e0b'};
          color: white;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: bold;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
        }
        .info-title {
          color: #4f46e5;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          text-align: left;
        }
        th {
          background: #4f46e5;
          color: white;
          font-weight: bold;
        }
        .financial-summary {
          float: right;
          width: 250px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
          margin-bottom: 20px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .amount {
          text-align: right;
        }
        .due-positive {
          color: #f59e0b;
        }
        .due-zero {
          color: #10b981;
        }
        .print-button {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .print-button:hover {
          background: #6366f1;
        }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">Print Invoice</button>
      
      <div class="header">
        <div class="company-info">
          <strong>${company?.name || 'Business Name'}</strong><br>
          GST: ${company?.gst || 'N/A'}
        </div>
        <div class="invoice-title">INVOICE</div>
        <div>Invoice #${report.invoice_number}</div>
        <div>Generated: ${new Date().toLocaleString()}</div>
      </div>
      
      <div class="status-banner">
        STATUS: ${report.status.toUpperCase()} | ${formatDate(report.created_at)}
      </div>
      
      <div class="grid-container">
        <div class="info-box">
          <div class="info-title">Bill To:</div>
          <div><strong>Name:</strong> ${report.customer_name}</div>
          ${report.customer?.email ? `<div><strong>Email:</strong> ${report.customer.email}</div>` : ''}
          ${report.customer?.phone ? `<div><strong>Phone:</strong> ${report.customer.phone}</div>` : ''}
          ${report.customer?.address ? `<div><strong>Address:</strong> ${report.customer.address} ${report.customer.city || ''}</div>` : ''}
          ${report.customer?.gst_number ? `<div><strong>GST:</strong> ${report.customer.gst_number}</div>` : ''}
        </div>
        
        <div class="info-box">
          <div class="info-title">Store Information:</div>
          <div><strong>Store:</strong> ${report.store_name}</div>
          ${report.store?.mobile ? `<div><strong>Contact:</strong> ${report.store.mobile}</div>` : ''}
          ${report.store?.email ? `<div><strong>Email:</strong> ${report.store.email}</div>` : ''}
          ${report.store?.gst ? `<div><strong>GST:</strong> ${report.store.gst}</div>` : ''}
          ${report.store?.address ? `<div><strong>Address:</strong> ${report.store.address} ${report.store.city || ''}</div>` : ''}
        </div>
      </div>
      
      <h3>Invoice Items</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>GST</th>
            <th>Disc</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${report.invoice_items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${getProductName(item.product_id, item.product_name)}</td>
              <td>${item.quantity}</td>
              <td class="amount">${formatCurrency(item.price)}</td>
              <td>${item.gst}%</td>
              <td>${item.discount}%</td>
              <td class="amount">${formatCurrency(item.total_price)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background: #f1f5f9;">
            <td colspan="6" style="text-align: right;"><strong>Total</strong></td>
            <td class="amount"><strong>${formatCurrency(report.total_amount)}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div class="financial-summary">
        <div><strong>Subtotal:</strong> <span class="amount">${formatCurrency(report.total_amount)}</span></div>
        <div><strong>Paid Amount:</strong> <span class="amount">${formatCurrency(report.paid_amount)}</span></div>
        <hr>
        <div><strong>Due Amount:</strong> <span class="amount ${report.total_amount - report.paid_amount > 0 ? 'due-positive' : 'due-zero'}">${formatCurrency(report.total_amount - report.paid_amount)}</span></div>
      </div>
      
      <div class="footer">
        Thank you for your business! | Generated by ${company?.name || 'Business'}<br>
        This is a computer generated invoice and does not require a signature.
      </div>
      
      <script>
        // Auto trigger print after a short delay
        setTimeout(() => {
          window.print();
        }, 500);
        
        // Close the iframe after printing
        window.onafterprint = function() {
          window.parent.document.body.removeChild(window.frameElement);
          if (window.parent.setIsPrinting) {
            window.parent.setIsPrinting(false);
          }
        };
      </script>
    </body>
    </html>
  `;
  
  // Write to iframe and trigger print
  printFrame.srcdoc = htmlContent;
  
  // Clean up after print
  setTimeout(() => {
    const checkPrint = setInterval(() => {
      try {
        if (printFrame.contentWindow.document.readyState === 'complete') {
          clearInterval(checkPrint);
          // Don't remove immediately to allow print dialog to open
          setTimeout(() => {
            if (document.body.contains(printFrame)) {
              document.body.removeChild(printFrame);
            }
            setIsPrinting(false);
          }, 1000);
        }
      } catch (e) {
        clearInterval(checkPrint);
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
        setIsPrinting(false);
      }
    }, 500);
  }, 1000);
};