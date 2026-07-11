// src/components/common/QRBarcodePrintModal/QRBarcodePrintModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPrinter, FiDownload, FiCopy, FiInfo } from 'react-icons/fi';
import { FaQrcode, FaBarcode } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Button from '../../common/Button/Button'; 

const QRBarcodePrintModal = ({ isOpen, onClose, stock, product }) => {
  const [activeTab, setActiveTab] = useState('qr');
  const [printSettings, setPrintSettings] = useState({
    pageSize: 'A4',
    quantity: 1
  });
  const [isPrinting, setIsPrinting] = useState(false);

  // Get product info from stock or product prop
  const productName = product?.name || stock?.product?.name || `Stock #${stock?.id}`;
  const productSku = product?.sku || stock?.product?.sku || '';
  const stockId = stock?.id;
  const stockQuantity = parseFloat(stock?.quantity) || 0;
  
  // Get QR and Barcode URLs (check both stock and product levels)
  const qrCodeUrl = stock?.qr_code || stock?.product?.qr_code || product?.qr_code;
  const barcodeUrl = stock?.bar_code || stock?.product?.bar_code || product?.barcode;

  // Get selling price
  const sellingPrice = stock?.selling_price || stock?.product?.selling_price || product?.selling_price || 0;

  // Update quantity when stock changes
  useEffect(() => {
    if (stockQuantity > 0) {
      const maxQuantity = Math.min(stockQuantity, 100);
      setPrintSettings(prev => ({ 
        ...prev, 
        quantity: Math.min(prev.quantity || 1, maxQuantity) 
      }));
    }
  }, [stockQuantity]);

  // Handle print
  const handlePrint = () => {
    const quantity = printSettings.quantity || 1;
    const isQR = activeTab === 'qr';
    const imageUrl = isQR ? qrCodeUrl : barcodeUrl;
    const label = isQR ? 'QR Code' : 'Barcode';
    
    if (!imageUrl) {
      toast.error(`${label} not available for this stock item`);
      return;
    }
    
    setIsPrinting(true);
    
    const isA4 = printSettings.pageSize === 'A4';
    
    let htmlContent = '';
    
    function escapeHtml(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    
    if (isA4) {
      // A4 Layout: 4 columns for QR (28 per page), 3 columns for barcode (30 per page)
      const itemsPerPage = isQR ? 28 : 30;
      const totalPages = Math.ceil(quantity / itemsPerPage);
      const gridCols = isQR ? 4 : 3;
      
      for (let page = 0; page < totalPages; page++) {
        const startIdx = page * itemsPerPage;
        const endIdx = Math.min(startIdx + itemsPerPage, quantity);
        const itemsOnPage = endIdx - startIdx;
        
        htmlContent += `
          <div class="a4-page">
            <div class="qr-grid" style="grid-template-columns: repeat(${gridCols}, 1fr);">
        `;
        
        for (let i = 0; i < itemsOnPage; i++) {
          htmlContent += `
            <div class="qr-item">
              <div class="qr-image-wrapper">
                <img src="${imageUrl}" class="qr-image ${isQR ? 'qr-type' : 'barcode-type'}" alt="${label}" />
              </div>
            </div>
          `;
        }
        
        if (page === totalPages - 1 && itemsOnPage < itemsPerPage) {
          const remainingSlots = itemsPerPage - itemsOnPage;
          for (let i = 0; i < remainingSlots; i++) {
            htmlContent += `<div class="qr-item empty-item"></div>`;
          }
        }
        
        htmlContent += `
            </div>
          </div>
        `;
      }
    } else {
      // Thermal Layout - 1 per page (3x5 inch)
      for (let i = 0; i < quantity; i++) {
        htmlContent += `
          <div class="thermal-page">
            <div class="thermal-content">
              <div class="thermal-image-wrapper">
                <img src="${imageUrl}" class="thermal-image ${isQR ? 'qr-type' : 'barcode-type'}" alt="${label}" />
              </div>
            </div>
          </div>
        `;
      }
    }
    
    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          background: white;
          margin: 0;
          padding: 0;
        }
        
        /* ===== A4 PAGE STYLES ===== */
        .a4-page {
          page-break-after: always;
          page-break-inside: avoid;
          min-height: 297mm;
          padding: 12mm 10mm;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        .a4-page:last-child {
          page-break-after: auto;
        }
        
        .qr-grid {
          display: grid;
          gap: 10px 14px;
          justify-items: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        
        .qr-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          break-inside: avoid;
          page-break-inside: avoid;
          padding: 8px 4px;
          background: white;
          border-radius: 4px;
        }
        
        .qr-item.empty-item {
          visibility: hidden;
        }
        
        .qr-image-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 4px;
        }
        
        /* QR Code - A4 */
        .qr-image.qr-type {
          width: 100%;
          max-width: 120px;
          height: auto;
          aspect-ratio: 1/1;
          object-fit: contain;
          image-rendering: pixelated;
        }
        
        /* Barcode - A4 */
        .qr-image.barcode-type {
          width: 100%;
          max-width: 240px;
          height: auto;
          min-height: 60px;
          max-height: 100px;
          object-fit: contain;
          image-rendering: pixelated;
        }
        
        /* ===== THERMAL PAGE STYLES (3x5 inch) ===== */
        .thermal-page {
          page-break-after: always;
          page-break-inside: avoid;
          width: 3in;
          height: 5in;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: white;
          margin: 0;
          padding: 0.15in;
          box-sizing: border-box;
        }
        .thermal-page:last-child {
          page-break-after: auto;
        }
        
        .thermal-content {
          text-align: center;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          padding: 12px 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .thermal-image-wrapper {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          flex: 1;
          min-height: 0;
        }
        
        /* QR Code - Thermal */
        .thermal-image.qr-type {
          width: 1.6in;
          height: 1.6in;
          object-fit: contain;
          image-rendering: pixelated;
        }
        
        /* Barcode - Thermal */
        .thermal-image.barcode-type {
          width: 2.6in;
          height: auto;
          max-height: 1.2in;
          object-fit: contain;
          image-rendering: pixelated;
        }
        
        /* ===== PRINT STYLES ===== */
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .a4-page {
            page-break-after: always;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .a4-page:last-child {
            page-break-after: auto !important;
          }
          
          .thermal-page {
            page-break-after: always;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .thermal-page:last-child {
            page-break-after: auto !important;
          }
          
          img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .empty-item {
            display: block !important;
            visibility: hidden !important;
          }
        }
        
        /* ===== SCREEN STYLES (Preview) ===== */
        @media screen {
          .a4-page {
            margin: 0 auto 20px auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-radius: 4px;
          }
          
          .thermal-page {
            margin: 0 auto 12px auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            border-radius: 4px;
          }
        }
        
        /* ===== RESPONSIVE ===== */
        @media screen and (max-width: 768px) {
          .qr-grid {
            gap: 6px 8px;
          }
          
          .qr-image.qr-type {
            max-width: 80px;
          }
          
          .qr-image.barcode-type {
            max-width: 160px;
            min-height: 40px;
            max-height: 70px;
          }
          
          .thermal-image.qr-type {
            width: 1.2in;
            height: 1.2in;
          }
          
          .thermal-image.barcode-type {
            width: 2.2in;
            max-height: 0.9in;
          }
        }
      </style>
    `;
    
    const fullHtml = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print ${label}s - ${escapeHtml(productName)}</title>
        ${styles}
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>`;
    
    // Create iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = 0;
    iframe.style.bottom = 0;
    iframe.style.width = 0;
    iframe.style.height = 0;
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();
    
    // Wait for images to load
    const images = iframeDoc.querySelectorAll('img');
    let imagesLoaded = 0;
    
    if (images.length === 0) {
      performPrint();
    } else {
      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          imagesLoaded++;
          if (imagesLoaded === images.length) performPrint();
        } else {
          img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) performPrint();
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) performPrint();
          };
        }
      });
    }
    
    function performPrint() {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          toast.success(`Printing ${quantity} ${label.toLowerCase()}(s) on ${isA4 ? 'A4' : 'Thermal (3×5")'} paper`);
        } catch (error) {
          console.error('Print error:', error);
          toast.error('Failed to print. Please try again.');
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            setIsPrinting(false);
          }, 500);
        }
      }, 500);
    }
  };

  // Handle download
  const handleDownload = () => {
    const isQR = activeTab === 'qr';
    const imageUrl = isQR ? qrCodeUrl : barcodeUrl;
    const label = isQR ? 'qr_code' : 'barcode';
    
    if (!imageUrl) {
      toast.error(`${isQR ? 'QR Code' : 'Barcode'} not available`);
      return;
    }
    
    const link = document.createElement('a');
    link.href = imageUrl;
    const fileExt = imageUrl.includes('.svg') ? 'svg' : 'png';
    link.download = `stock_${stockId}_${label}.${fileExt}`;
    link.click();
    toast.success(`${isQR ? 'QR Code' : 'Barcode'} downloaded successfully`);
  };

  // Handle copy URL
  const handleCopyUrl = () => {
    const isQR = activeTab === 'qr';
    const imageUrl = isQR ? qrCodeUrl : barcodeUrl;
    
    if (!imageUrl) {
      toast.error(`${isQR ? 'QR Code' : 'Barcode'} not available`);
      return;
    }
    
    navigator.clipboard.writeText(imageUrl);
    toast.success(`${isQR ? 'QR Code' : 'Barcode'} URL copied to clipboard`);
  };

  if (!isOpen) return null;

  const hasQr = !!qrCodeUrl;
  const hasBarcode = !!barcodeUrl;
  const currentImageUrl = activeTab === 'qr' ? qrCodeUrl : barcodeUrl;
  const currentLabel = activeTab === 'qr' ? 'QR Code' : 'Barcode';
  const hasCurrentImage = !!currentImageUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaQrcode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    QR Code & Barcode
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stock #{stockId} - {productName}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onClose}
                icon={FiX}
                className="!p-2 !rounded-full !w-10 !h-10"
              />
            </div>

            <div className="p-6">
              {/* Print Settings */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <FiPrinter className="w-4 h-4 mr-2 text-purple-500" />
                  Print Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Page Size
                    </label>
                    <select
                      value={printSettings.pageSize}
                      onChange={(e) => setPrintSettings(prev => ({ ...prev, pageSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                    >
                      <option value="A4">A4 Paper (210×297mm)</option>
                      <option value="Thermal">Thermal Label (3×5")</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={Math.min(stockQuantity || 50, 100)}
                      value={printSettings.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const maxQuantity = Math.min(stockQuantity || 50, 100);
                        if (value > maxQuantity && maxQuantity > 0) {
                          toast.error(`Cannot print more than available stock (${maxQuantity})`);
                          return;
                        }
                        setPrintSettings(prev => ({ ...prev, quantity: Math.max(1, value) }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                    />
                    {stockQuantity > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Available: {stockQuantity} units
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handlePrint}
                      icon={FiPrinter}
                      className="w-full !bg-gradient-to-r !from-purple-600 !to-purple-700 hover:!from-purple-700 hover:!to-purple-800 !text-white !border-none"
                      disabled={isPrinting || !hasCurrentImage || !printSettings.quantity}
                    >
                      {isPrinting ? (
                        <span className="flex items-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                          Preparing...
                        </span>
                      ) : (
                        `Print ${activeTab === 'qr' ? 'QR Codes' : 'Barcodes'}`
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {printSettings.pageSize === 'Thermal' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      💡 3×5" label per item
                    </span>
                  )}
                  {printSettings.pageSize === 'A4' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      💡 {activeTab === 'qr' ? '4' : '3'} columns • {activeTab === 'qr' ? '28' : '30'} per page
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    📦 Stock: {stockQuantity}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'qr'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  disabled={!hasQr}
                >
                  <FaQrcode className="w-4 h-4" />
                  QR Code
                  {!hasQr && (
                    <span className="text-xs text-red-500">(unavailable)</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('barcode')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'barcode'
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  disabled={!hasBarcode}
                >
                  <FaBarcode className="w-4 h-4" />
                  Barcode
                  {!hasBarcode && (
                    <span className="text-xs text-red-500">(unavailable)</span>
                  )}
                </button>
              </div>

              {/* Content - Preview */}
              <div className="space-y-6">
                {hasCurrentImage ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {activeTab === 'qr' 
                        ? 'Scan this QR code to view stock details' 
                        : 'Stock barcode for scanning'}
                    </p>
                    <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                      <img
                        src={currentImageUrl}
                        alt={`${currentLabel} for ${productName}`}
                        className={activeTab === 'qr' ? 'w-64 h-64 object-contain' : 'h-32 object-contain'}
                        onError={(e) => {
                          console.error(`Failed to load ${currentLabel}:`, currentImageUrl);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const errorDiv = document.createElement('div');
                          errorDiv.className = `${activeTab === 'qr' ? 'w-64 h-64' : 'h-32'} bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center`;
                          errorDiv.innerHTML = `
                            <div class="text-center">
                              <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                              </svg>
                              <p class="text-sm text-gray-500 mt-2">${currentLabel} Unavailable</p>
                            </div>
                          `;
                          parent.appendChild(errorDiv);
                        }}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        icon={FiDownload}
                        size="sm"
                      >
                        Download {activeTab === 'qr' ? 'QR' : 'Barcode'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCopyUrl}
                        icon={FiCopy}
                        size="sm"
                      >
                        Copy URL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiX className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {currentLabel} not available for this stock item
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Try regenerating the QR/Barcode from the stock settings
                    </p>
                  </div>
                )}

                {/* Stock Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FiInfo className="w-4 h-4 mr-2 text-purple-500" />
                    Stock Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Stock ID</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">#{stockId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Product</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SKU</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{productSku || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{stockQuantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Selling Price</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        ₹{sellingPrice ? parseFloat(sellingPrice).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Unit</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stock?.unit?.name || stock?.product?.unit?.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRBarcodePrintModal;