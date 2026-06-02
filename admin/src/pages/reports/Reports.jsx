import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiDownload,
  FiFilter,
  FiX,
  FiBarChart2,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiRefreshCw,
  FiChevronDown,
  FiEye,
  FiAlertCircle,
  FiPrinter,
  FiFile,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { reportsAPI } from "../../services/reportsService";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import LoadingSpinner from "../../components/common/Spinner/Spinner";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
    const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("30days");
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  });
  
  // Summary statistics
  const [summaryStats, setSummaryStats] = useState({
    totalSalesItems: "0",
    totalSalesAmount: "0",
    totalDue: "0",
    totalProfit: "0",
    customerDues: [],
    productWiseSales: [],
  });

  // Fetch reports with pagination and date filtering
  const fetchReports = async (page = 1, start = "", end = "") => {
    setLoading(true);
    setError(null);

    try {
      const response = await reportsAPI.getReports(start, end, page);
      console.log("✅ Reports API Response:", response);

      // Handle the API response structure
      const responseData = response.data?.data || response.data;
      
      if (responseData?.salesItem_details) {
        const paginatedData = responseData.salesItem_details;
        
        // Extract reports data from paginated response
        const reportsData = paginatedData.data || [];
        
        // Set summary statistics
        setSummaryStats({
          totalSalesItems: responseData.total_sales_items || "0",
          totalSalesAmount: responseData.total_sales_amount || "0",
          totalDue: responseData.total_due || "0",
          totalProfit: responseData.total_profit || "0",
          customerDues: responseData.customer_dues || [],
          productWiseSales: responseData.product_wise_sales || [],
        });
        
        // Set pagination info
        setPagination({
          currentPage: paginatedData.current_page || 1,
          perPage: paginatedData.per_page || 10,
          total: paginatedData.total || 0,
          lastPage: paginatedData.last_page || 1,
          from: paginatedData.from || 0,
          to: paginatedData.to || 0,
        });
        
        // Format reports data
        const formattedReports = reportsData.map((report) => ({
          ...report,
          customer_name: report.customer?.name || `Deleted`,
          store_name: report.store?.name || `Deleted`,
        }));
        
        setReports(formattedReports);
        setFilteredReports(formattedReports);
      } else if (Array.isArray(responseData)) {
        // Fallback for non-paginated response
        const formattedReports = responseData.map((report) => ({
          ...report,
          customer_name: report.customer?.name || `Deleted`,
          store_name: report.store?.name || `Deleted`,
        }));
        setReports(formattedReports);
        setFilteredReports(formattedReports);
      } else {
        setReports([]);
        setFilteredReports([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch reports:", error);
      setError(error.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // Initialize with last 30 days reports
  useEffect(() => {
    handleQuickFilter("30days");
  }, []);

  // Apply search filter locally
  useEffect(() => {
    if (!reports.length) return;

    const filtered = reports.filter((report) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (report.id && report.id.toString().includes(searchLower)) ||
        (report.invoice_number && report.invoice_number.toLowerCase().includes(searchLower)) ||
        (report.customer_name && report.customer_name.toLowerCase().includes(searchLower)) ||
        (report.store_name && report.store_name.toLowerCase().includes(searchLower))
      );
    });

    setFilteredReports(filtered);
  }, [searchTerm, reports]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.lastPage) return;
    fetchReports(newPage, startDate, endDate);
  };

  // Handle date filter
  const handleDateFilter = () => {
    fetchReports(1, startDate, endDate);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setShowFilters(false);
    setSelectedFilter("all");
    fetchReports(1, "", "");
  };

  // Get today's date for default input values
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Quick filter functions
  const handleQuickFilter = (filterType) => {
    setSelectedFilter(filterType);
    const today = new Date();
    let start = "";
    let end = "";

    switch (filterType) {
      case "today":
        start = end = getTodayDate();
        break;
      case "7days":
        end = getTodayDate();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        start = sevenDaysAgo.toISOString().split("T")[0];
        break;
      case "30days":
        end = getTodayDate();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        start = thirtyDaysAgo.toISOString().split("T")[0];
        break;
      case "pastMonth":
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        );
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        start = lastMonth.toISOString().split("T")[0];
        end = lastMonthEnd.toISOString().split("T")[0];
        break;
      case "currentMonth":
        const currentMonthStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        );
        const currentMonthEnd = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        );
        start = currentMonthStart.toISOString().split("T")[0];
        end = currentMonthEnd.toISOString().split("T")[0];
        break;
      case "all":
      default:
        start = "";
        end = "";
        break;
    }

    setStartDate(start);
    setEndDate(end);
    fetchReports(1, start, end);
  };

  // Calculate report statistics from filtered reports
  const calculateStats = () => {
    if (!filteredReports.length) {
      return { 
        total: 0, 
        revenue: 0, 
        orders: 0, 
        products: 0, 
        averageOrder: 0,
        due: 0 
      };
    }

    const stats = filteredReports.reduce(
      (acc, report) => ({
        total: acc.total + (parseFloat(report.total_amount) || 0),
        revenue: acc.revenue + (parseFloat(report.paid_amount) || 0),
        orders: acc.orders + 1,
        products: acc.products + (parseInt(report.total_items) || 0),
        due: acc.due + ((parseFloat(report.total_amount) || 0) - (parseFloat(report.paid_amount) || 0)),
      }),
      { total: 0, revenue: 0, orders: 0, products: 0, due: 0 },
    );

    return {
      ...stats,
      averageOrder: stats.orders > 0 ? stats.revenue / stats.orders : 0,
    };
  };

  const stats = calculateStats();

  // Prepare data for export (using all data from API, not just current page)
  const prepareExportData = () => {
    const headers = [
      "Invoice ID",
      "Invoice Number",
      "Date",
      "Customer Name",
      "Customer ID",
      "Store Name",
      "Store ID",
      "Total Amount (₹)",
      "Paid Amount (₹)",
      "Due Amount (₹)",
      "Total Items",
      "Status",
      "Created At",
    ];

    const data = filteredReports.map((report) => [
      report.id || "",
      report.invoice_number || "",
      report.created_at
        ? new Date(report.created_at).toLocaleDateString()
        : "N/A",
      report.customer_name || `Deleted`,
      report.customer_id || "",
      report.store_name || `Deleted`,
      report.store_id || "",
      parseFloat(report.total_amount || 0).toFixed(2),
      parseFloat(report.paid_amount || 0).toFixed(2),
      (
        parseFloat(report.total_amount || 0) -
        parseFloat(report.paid_amount || 0)
      ).toFixed(2),
      report.total_items || 0,
      report.status || "N/A",
      report.created_at ? new Date(report.created_at).toLocaleString() : "N/A",
    ]);

    return { headers, data };
  };

  // Enhanced Excel Export
  const handleExportToExcel = () => {
    try {
      const { headers, data } = prepareExportData();

      const wsData = [headers, ...data];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const colWidths = headers.map(() => ({ wch: 15 }));
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reports Data");

      const filename = `reports_${startDate || "all"}_${endDate || "all"}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, filename);

      setShowExportDropdown(false);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  };

  // Fixed PDF Export
  const handleExportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(67, 56, 202);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("REPORTS DASHBOARD", pageWidth / 2, 22, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Business Intelligence Report", pageWidth / 2, 32, {
        align: "center",
      });

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(pageWidth - 42, 12, 32, 10, 2, 2, "F");
      doc.setTextColor(67, 56, 202);
      doc.setFontSize(8);
      const todayDate = new Date().toLocaleDateString("en-GB");
      doc.text(todayDate, pageWidth - 26, 19, { align: "center" });

      const formatCurrency = (amount) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return "Rs. 0.00";
        const formatted = num.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `Rs. ${formatted}`;
      };

      const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };

      const statsCards = [
        {
          label: "Total Revenue",
          value: formatCurrency(stats.revenue),
          color: [59, 130, 246],
          bgColor: [239, 246, 255],
        },
        {
          label: "Total Orders",
          value: formatNumber(stats.orders),
          color: [34, 197, 94],
          bgColor: [240, 253, 244],
        },
        {
          label: "Products Sold",
          value: formatNumber(stats.products),
          color: [168, 85, 247],
          bgColor: [250, 245, 255],
        },
        {
          label: "Avg Order Value",
          value: formatCurrency(stats.averageOrder),
          color: [249, 115, 22],
          bgColor: [255, 247, 237],
        },
      ];

      const cardWidth = (pageWidth - 40) / 4;
      statsCards.forEach((card, idx) => {
        const x = 15 + idx * cardWidth;
        doc.setFillColor(...card.bgColor);
        doc.roundedRect(x, 55, cardWidth - 5, 38, 4, 4, "F");
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(card.label, x + 8, 70);
        doc.setTextColor(...card.color);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        let displayValue = card.value;
        if (displayValue.length > 22) {
          displayValue = displayValue.substring(0, 19) + "...";
        }
        doc.text(displayValue, x + 8, 86);
      });

      const insightY = 102;
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(15, insightY, pageWidth - 30, 18, 3, 3, "F");

      const tableData = filteredReports.map((report) => {
        const totalAmount = parseFloat(report.total_amount || 0);
        const paidAmount = parseFloat(report.paid_amount || 0);

        return [
          {
            content: `#${report.invoice_number || report.id || ""}`,
            styles: { fontStyle: "bold", textColor: [79, 70, 229] },
          },
          {
            content: report.created_at
              ? new Date(report.created_at).toLocaleDateString("en-GB")
              : "N/A",
            styles: { halign: "center" },
          },
          {
            content: (report.customer_name || `Deleted`).substring(0, 22),
            styles: { cellWidth: 42 },
          },
          {
            content: (report.store_name || `Deleted`).substring(0, 20),
            styles: { cellWidth: 38 },
          },
          {
            content: formatCurrency(totalAmount),
            styles: {
              textColor: [34, 197, 94],
              fontStyle: "bold",
              halign: "right",
            },
          },
          {
            content: formatCurrency(paidAmount),
            styles: { textColor: [59, 130, 246], halign: "right" },
          },
          {
            content: formatNumber(report.total_items || 0),
            styles: { halign: "center" },
          },
          {
            content: String(report.status || "completed").toUpperCase(),
            styles: {
              fillColor:
                report.status === "completed"
                  ? [220, 252, 231]
                  : report.status === "pending"
                    ? [254, 243, 199]
                    : [254, 226, 226],
              textColor:
                report.status === "completed"
                  ? [22, 163, 74]
                  : report.status === "pending"
                    ? [180, 83, 9]
                    : [185, 28, 28],
              fontStyle: "bold",
              halign: "center",
            },
          },
        ];
      });

      autoTable(doc, {
        head: [
          [
            { content: "INVOICE", styles: { halign: "center", cellWidth: 28 } },
            { content: "DATE", styles: { halign: "center", cellWidth: 24 } },
            { content: "CUSTOMER", styles: { cellWidth: 42 } },
            { content: "STORE", styles: { cellWidth: 38 } },
            { content: "TOTAL", styles: { halign: "right", cellWidth: 32 } },
            { content: "PAID", styles: { halign: "right", cellWidth: 32 } },
            { content: "ITEMS", styles: { halign: "center", cellWidth: 20 } },
            { content: "STATUS", styles: { halign: "center", cellWidth: 28 } },
          ],
        ],
        body: tableData,
        startY: insightY + 25,
        theme: "striped",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 8,
          lineColor: [229, 231, 235],
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.line(15, pageHeight - 10, pageWidth - 15, pageHeight - 10);
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(
            `Page ${currentPage} of ${pageCount} • Confidential`,
            pageWidth / 2,
            pageHeight - 5,
            { align: "center" },
          );
        },
      });

      doc.save(`reports_${startDate || "all"}_${endDate || "all"}_${new Date().toISOString().split("T")[0]}.pdf`);
      setShowExportDropdown(false);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export to PDF. Please try again.");
    }
  };

  // Word Export
  const handleExportToWord = () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reports Export</title>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #333; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px; color: white; }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 0; opacity: 0.9; }
            .summary-cards { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
            .card { background: #f8f9fa; border-radius: 8px; padding: 20px; flex: 1; min-width: 200px; border-left: 4px solid #4F46E5; }
            .card h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; }
            .card .value { font-size: 24px; font-weight: bold; color: #4F46E5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background: #4F46E5; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #999; text-align: center; }
            .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
            .status-completed { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-cancelled { background: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reports Dashboard</h1>
            <p>Comprehensive Business Report</p>
          </div>
          
          <div class="summary-cards">
            <div class="card"><h3>Total Revenue</h3><div class="value">₹${stats.revenue.toFixed(2)}</div></div>
            <div class="card"><h3>Total Orders</h3><div class="value">${stats.orders}</div></div>
            <div class="card"><h3>Products Sold</h3><div class="value">${stats.products}</div></div>
            <div class="card"><h3>Avg Order Value</h3><div class="value">₹${stats.averageOrder.toFixed(2)}</div></div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Report Period:</strong> ${startDate || "All"} - ${endDate || "All"}<br>
            <strong>Generated on:</strong> ${new Date().toLocaleString()}<br>
            <strong>Total Records:</strong> ${filteredReports.length}
          </div>
          
          <table>
            <thead><tr>
              <th>Invoice #</th><th>Date</th><th>Customer Name</th><th>Store Name</th>
              <th>Total Amount</th><th>Paid Amount</th><th>Total Items</th><th>Status</th>
            </tr></thead>
            <tbody>
              ${filteredReports.map((report) => `
                <tr>
                  <td>#${report.invoice_number || report.id}</td>
                  <td>${report.created_at ? new Date(report.created_at).toLocaleDateString() : "N/A"}</td>
                  <td>${report.customer_name || `Deleted`}</td>
                  <td>${report.store_name || `Deleted`}</td>
                  <td>₹${parseFloat(report.total_amount || 0).toFixed(2)}</td>
                  <td>₹${parseFloat(report.paid_amount || 0).toFixed(2)}</td>
                  <td>${report.total_items || 0}</td>
                  <td><span class="status-badge status-${(report.status || "completed").toLowerCase()}">${report.status || "N/A"}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Confidential - For Internal Use Only</p>
            <p>* This report is generated automatically. Please verify all data for accuracy.</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "application/msword" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports_${startDate || "all"}_${endDate || "all"}_${new Date().toISOString().split("T")[0]}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowExportDropdown(false);
    } catch (error) {
      console.error("Word export failed:", error);
      alert("Failed to export to Word. Please try again.");
    }
  };

  // CSV Export
  const handleExportToCSV = () => {
    try {
      const { headers, data } = prepareExportData();
      const csvRows = [];
      csvRows.push(headers.join(","));
      data.forEach((row) => {
        const escapedRow = row.map((cell) => {
          if (typeof cell === "string" && (cell.includes(",") || cell.includes('"') || cell.includes("\n"))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        });
        csvRows.push(escapedRow.join(","));
      });
      csvRows.push("");
      csvRows.push("SUMMARY STATISTICS");
      csvRows.push(`Total Revenue,₹${stats.revenue.toFixed(2)}`);
      csvRows.push(`Total Orders,${stats.orders}`);
      csvRows.push(`Total Products Sold,${stats.products}`);
      csvRows.push(`Average Order Value,₹${stats.averageOrder.toFixed(2)}`);
      
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports_${startDate || "all"}_${endDate || "all"}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowExportDropdown(false);
    } catch (error) {
      console.error("CSV export failed:", error);
      alert("Failed to export to CSV. Please try again.");
    }
  };

  const handleExport = (format) => {
    switch (format) {
      case "excel":
        handleExportToExcel();
        break;
      case "pdf":
        handleExportToPDF();
        break;
      case "word":
        handleExportToWord();
        break;
      case "csv":
        handleExportToCSV();
        break;
      default:
        handleExportToCSV();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reports Print</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .stats { display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; }
          .stat-card { background: #f8f9fa; border-radius: 8px; padding: 15px; flex: 1; border-left: 4px solid #4F46E5; }
          .stat-card h3 { margin: 0 0 5px 0; font-size: 12px; color: #666; }
          .stat-card .value { font-size: 20px; font-weight: bold; color: #4F46E5; }
          @media print { body { margin: 0; padding: 20px; } table { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>Reports Dashboard</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <div class="stats">
          <div class="stat-card"><h3>Total Revenue</h3><div class="value">₹${stats.revenue.toFixed(2)}</div></div>
          <div class="stat-card"><h3>Total Orders</h3><div class="value">${stats.orders}</div></div>
          <div class="stat-card"><h3>Products Sold</h3><div class="value">${stats.products}</div></div>
          <div class="stat-card"><h3>Avg Order Value</h3><div class="value">₹${stats.averageOrder.toFixed(2)}</div></div>
        </div>
        ${filteredReports.length === 0 ? "<p>No reports found</p>" : `
          <table>
            <thead><tr><th>Invoice #</th><th>Date</th><th>Customer Name</th><th>Store Name</th><th>Total Amount</th><th>Paid Amount</th><th>Items</th><th>Status</th></tr></thead>
            <tbody>
              ${filteredReports.map((report) => `
                <tr>
                  <td>#${report.invoice_number || report.id}</td>
                  <td>${report.created_at ? new Date(report.created_at).toLocaleDateString() : "N/A"}</td>
                  <td>${report.customer_name || `Customer #${report.customer_id}`}</td>
                  <td>${report.store_name || `Deleted`}</td>
                  <td>₹${parseFloat(report.total_amount || 0).toFixed(2)}</td>
                  <td>₹${parseFloat(report.paid_amount || 0).toFixed(2)}</td>
                  <td>${report.total_items || 0}</td>
                  <td>${report.status || "N/A"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}
        <p style="margin-top: 30px; font-size: 10px; color: #999; text-align: center;">Confidential - For Internal Use Only</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports(pagination.currentPage, startDate, endDate);
    setRefreshing(false);
  };

  const handleViewDetails = (report) => {
    let encodedId = btoa(report.id.toString() + secretKey);
    navigate(`/reports/${encodedId}`);
  };

  // Pagination component
  const Pagination = () => {
    if (pagination.total <= pagination.perPage) return null;
    
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pagination.lastPage, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{pagination.from || 0}</span> to{" "}
          <span className="font-medium">{pagination.to || 0}</span> of{" "}
          <span className="font-medium">{pagination.total}</span> results
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`p-2 rounded-lg border transition-colors ${
              pagination.currentPage === 1
                ? "border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </motion.button>
          
          {startPage > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                1
              </motion.button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pages.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pagination.currentPage === page
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </motion.button>
          ))}
          
          {endPage < pagination.lastPage && (
            <>
              {endPage < pagination.lastPage - 1 && <span className="text-gray-400">...</span>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(pagination.lastPage)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {pagination.lastPage}
              </motion.button>
            </>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className={`p-2 rounded-lg border transition-colors ${
              pagination.currentPage === pagination.lastPage
                ? "border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <FiChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  };

  const columns = [
    {
      header: "Invoice ID",
      accessor: "invoice_number",
      cell: (value, row) => (
        <span className="font-mono font-medium text-primary-600 dark:text-primary-400">
          #{row.invoice_number || row.id}
        </span>
      ),
    },
    {
      header: "Date & Time",
      accessor: "created_at",
      cell: (value) => (
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">
            {value
              ? new Date(value).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: "customer_name",
      cell: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {value?.charAt(0).toUpperCase() || "C"}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Store",
      accessor: "store_name",
      cell: (value) => (
        <div className="flex items-center">
          <FiPackage className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">{value}</span>
        </div>
      ),
    },
    {
      header: "Total Amount",
      accessor: "total_amount",
      cell: (value) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ₹{parseFloat(value || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Paid Amount",
      accessor: "paid_amount",
      cell: (value, row) => {
        const paid = parseFloat(value || 0);
        const total = parseFloat(row.total_amount || 0);
        const percentage = total > 0 ? (paid / total) * 100 : 0;

        return (
          <div className="space-y-1">
            <span className="font-medium text-green-600 dark:text-green-400">
              ₹{paid.toFixed(2)}
            </span>
            <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-green-500 rounded-full"
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Items",
      accessor: "total_items",
      cell: (value) => (
        <div className="flex items-center space-x-1">
          <FiPackage className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{value || 0}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        let status = "completed";
        if (value === "pending") status = "pending";
        else if (value === "cancelled") status = "cancelled";

        return (
          <StatusBadge
            status={status}
            variant={
              status === "completed"
                ? "success"
                : status === "pending"
                  ? "warning"
                  : "default"
            }
            size="sm"
          />
        );
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDetails(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
    >
      <div
        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <motion.p
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Reports Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiBarChart2 className="w-4 h-4 mr-2" />
            View and analyze your business reports and analytics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FiRefreshCw
              className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? "animate-spin" : ""}`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center space-x-2"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print</span>
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-green-500/30 flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${showExportDropdown ? "rotate-180" : ""}`}
              />
            </motion.button>

            <AnimatePresence>
              {showExportDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
                >
                  <div className="py-2">
                    {[
                      { format: "excel", label: "Excel", color: "green", ext: ".xlsx" },
                      { format: "pdf", label: "PDF", color: "red", ext: "Professional format" },
                      { format: "word", label: "Word", color: "blue", ext: ".doc format" },
                      { format: "csv", label: "CSV", color: "purple", ext: "Raw data format" },
                    ].map((item) => (
                      <motion.button
                        key={item.format}
                        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleExport(item.format)}
                        className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                      >
                        <div className={`w-8 h-8 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg flex items-center justify-center`}>
                          <FiFile className={`w-4 h-4 text-${item.color}-600 dark:text-${item.color}-400`} />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.ext}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <AnimatePresence>
        {!loading && filteredReports.length > 0 && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            <StatCard
              title="Total Revenue"
              value={`₹${parseFloat(summaryStats.totalSalesAmount || stats.revenue).toFixed(2)}`}
              icon={FiDollarSign}
              color="from-blue-500 to-cyan-500"
              delay={0.1}
            />
            <StatCard
              title="Total Orders"
              value={pagination.total || stats.orders}
              icon={FiPackage}
              color="from-green-500 to-emerald-500"
              delay={0.2}
            />
            <StatCard
              title="Products Sold"
              value={summaryStats.totalSalesItems || stats.products}
              icon={FiBarChart2}
              color="from-purple-500 to-indigo-500"
              delay={0.3}
            />
            <StatCard
              title="Total Due"
              value={`₹${parseFloat(summaryStats.totalDue || stats.due).toFixed(2)}`}
              icon={FiTrendingUp}
              color="from-orange-500 to-red-500"
              delay={0.4}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by invoice ID, customer, or store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl border transition-colors flex items-center space-x-2 ${
                showFilters
                  ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
              {(startDate || endDate) && (
                <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </motion.button>

            {(searchTerm || startDate || endDate) && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearFilters}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quick Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "All Time" },
                      { id: "today", label: "Today" },
                      { id: "currentMonth", label: "Current Month" },
                      { id: "7days", label: "Last 7 Days" },
                      { id: "30days", label: "Last 30 Days" },
                      { id: "pastMonth", label: "Past Month" },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => handleQuickFilter(filter.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedFilter === filter.id
                            ? "bg-primary-500 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={getTodayDate()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={getTodayDate()}
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <Button onClick={handleDateFilter} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading reports...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {error}
              </p>
              <Button
                onClick={() => fetchReports(pagination.currentPage, startDate, endDate)}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <EmptyState
              icon={FiBarChart2}
              title="No reports found"
              description={
                searchTerm
                  ? "No reports match your search criteria."
                  : "Try adjusting your date filters or check back later for new reports."
              }
              action={
                searchTerm || startDate || endDate ? (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                ) : null
              }
            />
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <Table
                columns={columns}
                data={filteredReports}
                loading={loading}
              />
              <Pagination />
            </div>
            <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredReports.length} of {reports.length} reports on this page
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Reports;