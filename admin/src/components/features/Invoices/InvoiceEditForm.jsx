import React, { useEffect, useMemo, useState } from 'react'
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { invoiceAPI } from '../../../services/invoiceService'
import { stockAPI } from '../../../services/stockService'
import { useAuthStore } from '../../../store/authStore'

const PAYMENT_OPTIONS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Card', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Cheque', label: 'Cheque' },
]

const calculateLineTotal = (price, quantity, gst, discount) => {
  const base = price * quantity
  const disc = base * (discount / 100)
  const afterDisc = base - disc
  const gstAmt = afterDisc * (gst / 100)
  return afterDisc + gstAmt
}

const InvoiceEditForm = ({ invoice, hasStockPermission, onCancel, onSaved, variant = 'embedded' }) => {
  const { user } = useAuthStore()
  const createdBy = user?.id || invoice.created_by

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customers, setCustomers] = useState([])
  const [stores, setStores] = useState([])
  const [products, setProducts] = useState([])
  const [productSearch, setProductSearch] = useState('')
  const [showProductPicker, setShowProductPicker] = useState(false)

  const [customerId, setCustomerId] = useState(String(invoice.customer_id || ''))
  const [storeId, setStoreId] = useState(String(invoice.store_id || ''))
  const [paidAmount, setPaidAmount] = useState(String(invoice.paid_amount ?? ''))
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [lineItems, setLineItems] = useState([])
  const [deletedItemIds, setDeletedItemIds] = useState([])

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      setLoading(true)
      try {
        const userId = invoice.user_id
        const billRes = await invoiceAPI.getBillGenerateData(userId)
        const bd = billRes.data?.data || billRes.data || {}

        if (cancelled) return
        setCustomers(Array.isArray(bd.customers) ? bd.customers : [])
        setStores(Array.isArray(bd.stores) ? bd.stores : [])
        setProducts(Array.isArray(bd.products) ? bd.products : [])

        let stockList = []
        if (hasStockPermission) {
          try {
            const sr = await stockAPI.getAll('')
            stockList = sr.data?.data?.data || sr.data?.data || []
          } catch {
            stockList = []
          }
        }

        if (cancelled) return

        const rows = (invoice.invoice_items || invoice.items || []).filter(
          (row) => !row.is_package
        )
        const mapped = rows.map((item) => {
          const qty = parseFloat(item.quantity ?? item.item_count ?? 1)
          const product = (bd.products || []).find((p) => p.id === item.product_id)
          const stock = stockList.find((s) => s.product_id === item.product_id)
          const available = parseFloat(stock?.quantity ?? 0) + qty

          return {
            id: item.id,
            product_id: item.product_id,
            product_name:
              product?.name || item.product_name || item.name || `Product #${item.product_id}`,
            unit_id: item.unit_id,
            quantity: qty,
            price: parseFloat(item.price ?? product?.selling_price ?? 0),
            gst: parseFloat(item.gst ?? product?.gst_percentage ?? 0),
            discount: parseFloat(item.discount ?? product?.discount_percentage ?? 0),
            stock_id: stock?.id ?? null,
            stock_quantity: hasStockPermission ? available : Infinity,
          }
        })

        setLineItems(mapped)
      } catch (e) {
        console.error(e)
        toast.error('Failed to load invoice edit data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [invoice.user_id, invoice.id, hasStockPermission])

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase()
    if (!q) return (products || []).slice(0, 30)
    return (products || [])
      .filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q)
      )
      .slice(0, 40)
  }, [products, productSearch])

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((s, it) => s + it.price * it.quantity, 0)
    const discountAmt = lineItems.reduce((s, it) => {
      const b = it.price * it.quantity
      return s + b * (it.discount / 100)
    }, 0)
    const gstAmt = lineItems.reduce((s, it) => {
      const b = it.price * it.quantity
      const after = b - b * (it.discount / 100)
      return s + after * (it.gst / 100)
    }, 0)
    const total = subtotal - discountAmt + gstAmt
    return { subtotal, discountAmt, gstAmt, total }
  }, [lineItems])

  const updateLine = (index, field, raw) => {
    setLineItems((prev) => {
      const next = [...prev]
      const row = { ...next[index] }
      let v = raw
      if (field === 'quantity' || field === 'price' || field === 'gst' || field === 'discount') {
        v = parseFloat(raw)
        if (Number.isNaN(v)) v = 0
      }
      if (field === 'quantity' && hasStockPermission && row.stock_quantity < Infinity) {
        if (v > row.stock_quantity) {
          toast.error(`Max available quantity for this line is ${row.stock_quantity}`)
          return prev
        }
      }
      row[field] = v
      next[index] = row
      return next
    })
  }

  const removeLine = (index) => {
    const row = lineItems[index]
    if (row.id) {
      setDeletedItemIds((d) => [...d, row.id])
    }
    setLineItems((prev) => prev.filter((_, i) => i !== index))
  }

  const addProduct = async (product) => {
    const exists = lineItems.some((l) => l.product_id === product.id)
    if (exists) {
      toast.error('Product already on invoice — adjust quantity instead')
      return
    }

    let stockItem = null
    if (hasStockPermission) {
      try {
        const stockResponse = await stockAPI.getAll(product.name || '')
        const stockList = stockResponse.data?.data?.data || stockResponse.data?.data || []
        stockItem = stockList.find((s) => s.product_id === product.id)
      } catch {
        stockItem = null
      }
    }

    const qty = 1
    const price =
      parseFloat(stockItem?.selling_price) ||
      parseFloat(product.selling_price) ||
      parseFloat(product.price) ||
      0
    const gst = parseFloat(product.gst_percentage ?? product.gst ?? 0)
    const discount = parseFloat(product.discount_percentage ?? product.discount ?? 0)
    const stockQty = parseFloat(stockItem?.quantity ?? 0)

    if (hasStockPermission && (!stockItem || stockQty < qty)) {
      toast.error('No stock available for this product')
      return
    }

    setLineItems((prev) => [
      ...prev,
      {
        id: undefined,
        product_id: product.id,
        product_name: product.name,
        unit_id: product.unit_id,
        quantity: qty,
        price,
        gst,
        discount,
        stock_id: stockItem?.id ?? null,
        stock_quantity: hasStockPermission ? stockQty : Infinity,
      },
    ])
    setShowProductPicker(false)
    setProductSearch('')
    toast.success(`${product.name} added`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerId || !storeId) {
      toast.error('Customer and store are required')
      return
    }
    if (!lineItems.length) {
      toast.error('At least one product line is required')
      return
    }
    if (hasStockPermission) {
      const missing = lineItems.filter((l) => !l.stock_id)
      if (missing.length) {
        toast.error('Each line needs a valid stock row when stock management is enabled')
        return
      }
    }

    const payload = {
      user_id: invoice.user_id,
      customer_id: Number(customerId),
      store_id: Number(storeId),
      paid_amount: parseFloat(paidAmount) || 0,
      payment_method: paymentMethod,
      created_by: createdBy,
      deleted_item_ids: deletedItemIds,
      items: lineItems.map((l) => {
        const row = {
          product_id: l.product_id,
          unit_id: l.unit_id,
          quantity: parseFloat(l.quantity),
          price: parseFloat(l.price),
          gst: parseFloat(l.gst) || 0,
          discount: parseFloat(l.discount) || 0,
        }
        if (l.id) row.id = l.id
        if (hasStockPermission && l.stock_id) row.stock_id = l.stock_id
        return row
      }),
    }

    setSaving(true)
    try {
      const res = await invoiceAPI.update(invoice.id, payload)
      if (res.data?.status === true) {
        toast.success(res.data?.message || 'Invoice updated')
        try {
          const ch = new BroadcastChannel('app-cache-invalidation')
          ch.postMessage({
            type: 'invoice-updated',
            data: { customer_id: Number(customerId), timestamp: Date.now() },
          })
          ch.close()
        } catch {
          /* ignore */
        }
        onSaved?.()
      } else {
        toast.error(res.data?.message || 'Update failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update invoice')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
        Loading edit form…
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        variant === 'page'
          ? 'rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-6 space-y-6'
          : 'rounded-2xl border border-primary-200 dark:border-primary-900 bg-white dark:bg-gray-800 shadow-lg p-6 space-y-6'
      }
    >
      <div
        className={`flex flex-wrap items-center gap-3 ${
          variant === 'page' ? 'justify-end' : 'justify-between'
        }`}
      >
        {variant !== 'page' && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit invoice</h2>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} icon={FiX}>
            Close
          </Button>
          <Button type="submit" disabled={saving} icon={FiSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      {invoice.packages?.length > 0 && (
        <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
          This invoice includes packages. Package lines are not changed here; only product lines are
          updated.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          options={[
            { value: '', label: 'Select customer' },
            ...customers.map((c) => ({
              value: String(c.id),
              label: c.name || c.customer_name || `Customer #${c.id}`,
            })),
          ]}
        />
        <Select
          label="Store"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          options={[
            { value: '', label: 'Select store' },
            ...stores.map((s) => ({
              value: String(s.id),
              label: s.name || `Store #${s.id}`,
            })),
          ]}
        />
        <Select
          label="Payment method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={PAYMENT_OPTIONS}
        />
        <Input
          label="Paid amount"
          type="number"
          step="0.01"
          min="0"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-gray-900 dark:text-white">Products</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={FiPlus}
            onClick={() => setShowProductPicker((v) => !v)}
          >
            Add product
          </Button>
        </div>

        {showProductPicker && (
          <div className="space-y-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3">
            <Input
              placeholder="Search products…"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addProduct(p)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                >
                  {p.name} {p.sku ? `(${p.sku})` : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 pr-2">Item</th>
                <th className="py-2 pr-2">Qty</th>
                <th className="py-2 pr-2">Price</th>
                <th className="py-2 pr-2">GST %</th>
                <th className="py-2 pr-2">Disc %</th>
                <th className="py-2 pr-2 text-right">Line</th>
                <th className="py-2 w-10" />
              </tr>
            </thead>
            <tbody>
              {lineItems.map((row, idx) => (
                <tr key={row.id ? `e-${row.id}` : `n-${idx}`} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-2 text-gray-900 dark:text-white">{row.product_name}</td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24"
                      value={row.quantity}
                      onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-28"
                      value={row.price}
                      onChange={(e) => updateLine(idx, 'price', e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-20"
                      value={row.gst}
                      onChange={(e) => updateLine(idx, 'gst', e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-20"
                      value={row.discount}
                      onChange={(e) => updateLine(idx, 'discount', e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-2 text-right font-medium text-gray-900 dark:text-white">
                    ₹
                    {calculateLineTotal(
                      row.price,
                      row.quantity,
                      row.gst,
                      row.discount
                    ).toFixed(2)}
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      aria-label="Remove line"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 gap-4 pt-2">
          <span>Computed total: ₹{totals.total.toFixed(2)}</span>
        </div>
      </div>
    </form>
  )
}

export default InvoiceEditForm
