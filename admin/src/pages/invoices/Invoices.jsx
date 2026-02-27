import React, { useEffect, useState } from 'react'
import { FiPlus, FiSearch, FiFilter, FiFileText, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi'
import { useInvoiceStore } from '../../store/invoiceStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Pagination from '../../components/common/Pagination/Pagination'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Select from '../../components/common/Select/Select'
import InvoiceTable from '../../components/features/Invoices/InvoiceTable'
import InvoiceModal from '../../components/features/Invoices/InvoiceModal'
import InvoiceFormModal from '../../components/features/Invoices/InvoiceFormModal'

const Invoices = () => {
  const {
    invoices,
    totalInvoices,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    setFilters,
  } = useInvoiceStore()

  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editInvoice, setEditInvoice] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handlePageChange = (page) => {
    fetchInvoices(page)
  }

  const handleView = (invoice) => {
    setSelectedInvoice(invoice)
    setShowViewModal(true)
  }

  const handleDownload = (invoice) => {
    if (invoice?.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank')
    }
  }

  const handleEdit = (invoice) => {
    setEditInvoice(invoice)
    setShowEditModal(true)
  }

  const handleDelete = async (invoice) => {
    if (!invoice?.id) return
    if (window.confirm(`Delete invoice #${invoice.invoiceNumber}?`)) {
      const res = await deleteInvoice(invoice.id)
      if (res?.success) {
        fetchInvoices(currentPage)
      }
    }
  }

  const handleMarkPaid = async (invoice) => {
    if (!invoice?.id) return
    if (invoice.status === 'paid') return
    const res = await markAsPaid(invoice.id)
    if (res?.success) {
      fetchInvoices(currentPage)
    }
  }

  const handleAddSubmit = async (data) => {
    const res = await createInvoice(data)
    if (res?.success) {
      fetchInvoices(currentPage)
    }
  }

  const handleEditSubmit = async (data) => {
    if (!editInvoice?.id) return
    const res = await updateInvoice(editInvoice.id, data)
    if (res?.success) {
      fetchInvoices(currentPage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track invoices</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={FiPlus}>
          Create Invoice
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} icon={FiFilter}>
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Status"
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'unpaid', label: 'Unpaid' },
                  { value: 'overdue', label: 'Overdue' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'refunded', label: 'Refunded' },
                ]}
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {invoices?.length === 0 && !loading ? (
        <EmptyState
          icon={FiFileText}
          title="No invoices found"
          description="Try adjusting your search or filters, or create your first invoice."
          action={
            <Button onClick={() => setShowAddModal(true)} icon={FiPlus}>
              Create Invoice
            </Button>
          }
        />
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <InvoiceTable
              invoices={(invoices || []).map((inv) => ({
                ...inv,
                amount: inv.total ?? 0,
                currency: inv.currency || 'USD',
              }))}
              loading={loading}
              onView={handleView}
              onDownload={handleDownload}
            />

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              {selectedInvoice && (
                <>
                  <Button variant="outline" icon={FiEdit2} onClick={() => handleEdit(selectedInvoice)}>
                    Edit
                  </Button>
                  <Button variant="outline" icon={FiCheckCircle} onClick={() => handleMarkPaid(selectedInvoice)} disabled={selectedInvoice.status === 'paid'}>
                    Mark Paid
                  </Button>
                  <Button variant="danger" icon={FiTrash2} onClick={() => handleDelete(selectedInvoice)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalInvoices}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <InvoiceModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedInvoice(null)
        }}
        invoice={selectedInvoice}
      />

      <InvoiceFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
        onSubmit={handleAddSubmit}
      />

      <InvoiceFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditInvoice(null)
        }}
        invoice={editInvoice}
        mode="edit"
        onSubmit={handleEditSubmit}
      />
    </div>
  )
}

export default Invoices