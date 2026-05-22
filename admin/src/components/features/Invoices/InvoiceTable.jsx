import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiPrinter,
  FiSlash,
  FiCreditCard,
  FiX,
} from "react-icons/fi";
import Table from "../../common/Table/Table";
import StatusBadge from "../../common/StatusBadge/StatusBadge";
import Button from "../../common/Button/Button";

const InvoiceTable = ({
  invoices,
  loading,
  onView,
  onEdit,
  onCancelInvoice,
  onPayDue,
  onPrintA4,
  onPrintThermal,
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePrintClick = (invoice, e) => {
    e.stopPropagation();
    setSelectedInvoice(invoice);
    setPrintModalOpen(true);
  };

  const handlePrintA4Click = () => {
    if (selectedInvoice && onPrintA4) {
      onPrintA4(selectedInvoice);
    }
    setPrintModalOpen(false);
    setSelectedInvoice(null);
  };

  const handlePrintThermalClick = () => {
    if (selectedInvoice && onPrintThermal) {
      onPrintThermal(selectedInvoice);
    }
    setPrintModalOpen(false);
    setSelectedInvoice(null);
  };

  const closeModal = () => {
    setPrintModalOpen(false);
    setSelectedInvoice(null);
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: { variant: "success", icon: FiCheckCircle, label: "Completed" },
      paid: { variant: "success", icon: FiCheckCircle, label: "Paid" },
      unpaid: { variant: "warning", icon: FiClock, label: "Unpaid" },
      overdue: { variant: "danger", icon: FiAlertCircle, label: "Overdue" },
      draft: { variant: "default", icon: FiFileText, label: "Draft" },
      cancelled: { variant: "default", icon: FiFileText, label: "Cancelled" },
      refunded: { variant: "info", icon: FiFileText, label: "Refunded" },
    };
    return configs[status] || configs.unpaid;
  };

  const columns = [
    {
      header: "Invoice",
      accessor: "id",
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            #{row.invoice_number || row.id}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.created_at).toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: "customer_id",
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.customer_name || row.customer?.name || `Customer #${value}`}
          </p>
        </div>
      ),
    },
    {
      header: "Store",
      accessor: "store_id",
      cell: (value, row) => {
        // Get store name from multiple possible sources
       

        return (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {row.store_name}
            </p>
            
          </div>
        );
      },
    },
    {
      header: "Total Amount",
      accessor: "total_amount",
      cell: (value) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            ₹{parseFloat(value || 0).toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      header: "Paid Amount",
      accessor: "paid_amount",
      cell: (value) => (
        <div>
          <p className="font-medium text-green-600 dark:text-green-400">
            ₹{parseFloat(value || 0).toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      header: "Due Amount",
      accessor: "due_amount",
      cell: (_, row) => {
        const totalAmount = parseFloat(row.total_amount || 0);
        const paidAmount = parseFloat(row.paid_amount || 0);
        const dueAmount = totalAmount - paidAmount;

        return (
          <div>
            <p
              className={`font-medium ${dueAmount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
            >
              ₹{dueAmount.toFixed(2)}
            </p>
          </div>
        );
      },
    },
    {
      header: "Items",
      accessor: "total_items",
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {value || 0} items
          </p>
          {row.invoice_items && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.invoice_items.length} products
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => {
        const config = getStatusConfig(value);
        return (
          <StatusBadge
            status={config.label}
            variant={config.variant}
            icon={config.icon}
          />
        );
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_, row) => {
        const dueAmount = Math.max(
          0,
          parseFloat(row.total_amount || 0) - parseFloat(row.paid_amount || 0),
        );
        const isCancelled = row.status === "cancelled";
        const canPayDue = !isCancelled && dueAmount > 0.001;

        return (
          <div className="flex flex-wrap items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View invoice"
              type="button"
            >
              <FiEye className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: isCancelled ? 1 : 1.1 }}
              whileTap={{ scale: isCancelled ? 1 : 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isCancelled && onEdit) onEdit(row);
              }}
              disabled={isCancelled}
              className={`p-1.5 rounded-lg transition-colors ${
                isCancelled
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              }`}
              title={isCancelled ? "Cannot edit cancelled invoice" : "Edit invoice"}
              type="button"
            >
              <FiEdit2 className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: !canPayDue ? 1 : 1.1 }}
              whileTap={{ scale: !canPayDue ? 1 : 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (canPayDue && onPayDue) onPayDue(row);
              }}
              disabled={!canPayDue}
              className={`p-1.5 rounded-lg transition-colors ${
                !canPayDue
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              }`}
              title={!canPayDue ? "No due to pay" : "Pay due on this invoice"}
              type="button"
            >
              <FiCreditCard className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: isCancelled ? 1 : 1.1 }}
              whileTap={{ scale: isCancelled ? 1 : 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isCancelled && onCancelInvoice) onCancelInvoice(row);
              }}
              disabled={isCancelled}
              className={`p-1.5 rounded-lg transition-colors ${
                isCancelled
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              }`}
              title={isCancelled ? "Already cancelled" : "Cancel invoice"}
              type="button"
            >
              <FiSlash className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handlePrintClick(row, e)}
              className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Print invoice"
              type="button"
            >
              <FiPrinter className="w-4 h-4" />
            </motion.button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={invoices}
        loading={loading}
        onRowClick={onView}
        className="cursor-pointer"
      />

      <AnimatePresence>
        {printModalOpen && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiPrinter className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>

                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Print Invoice
                </motion.h3>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Invoice #{selectedInvoice.invoice_number || selectedInvoice.id}
                  <br />
                  <span className="text-sm mt-1 block">
                    Total Amount: ₹
                    {parseFloat(selectedInvoice.total_amount || 0).toFixed(2)}
                  </span>
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-3"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handlePrintA4Click}
                      className="w-full py-3 text-lg"
                      icon={FiPrinter}
                    >
                      A4 Print
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handlePrintThermalClick}
                      variant="outline"
                      className="w-full py-3 text-lg"
                      icon={FiPrinter}
                    >
                      3" Thermal Print
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvoiceTable;