import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPlus, FiPrinter, FiDownload, FiEdit2 } from "react-icons/fi";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Select from "../../components/common/Select/Select";
import Modal from "../../components/common/Modal/Modal";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import { waybillAPI } from "../../services/waybillService";
import { invoiceAPI } from "../../services/invoiceService";
import { useAuthStore } from "../../store/authStore";
import { printWaybill, downloadWaybill } from "../../templates/WaybillPrint";
// import { FiArrowLeft, FiPlus, FiPrinter, FiDownload, FiEdit2 } from "react-icons/fi";

const str = (v) => (typeof v === "string" ? v : "");

const buildInitial = (inv) => ({
  store_name: str(inv?.store_name) || str(inv?.store?.name),
  store_address:str(inv?.store_address) || [inv?.store?.address, inv?.store?.city].filter(Boolean).join(", "),
  store_gstin: str(inv?.store?.gst),
  store_phone: str(inv?.store?.mobile),
  customer_name: str(inv?.customer_name) || str(inv?.customer?.name),
  customer_address:str(inv?.customer_address) ||[inv?.customer?.address, inv?.customer?.city].filter(Boolean).join(", "),
  customer_pincode: "",
  customer_gstin: str(inv?.customer?.gst_number) || "",
  customer_phone: str(inv?.customer_phone)|| str(inv?.customer?.phone),
  origin_city: "",
  origin_pincode: "",
  destination_city: "",
  destination_pincode: "",
  vehicle_number: "",
  transport_mode: "road",
  total_packages: "",
  total_weight: "",
  total_value: inv?.total_amount != null ? String(inv.total_amount) : "",
  freight_amount: "",
  other_charges: "",
  status: "issued",
  invoice_number: inv?.invoice_number || "",
});
const s = (v) => (v == null ? "" : String(v));

const buildFromWaybill = (w) => ({
  store_name: s(w.store_name),
  store_address: s(w.store_address),
  store_gstin: s(w.store_gstin),
  store_phone: s(w.store_phone),
  customer_name: s(w.customer_name),
  customer_address: s(w.customer_address),
  customer_pincode: s(w.customer_pincode),
  customer_gstin: s(w.customer_gstin),
  customer_phone: s(w.customer_phone),
  origin_city: s(w.origin_city),
  origin_pincode: s(w.origin_pincode),
  destination_city: s(w.destination_city),
  destination_pincode: s(w.destination_pincode),
  vehicle_number: s(w.vehicle_number),
  transport_mode: s(w.transport_mode) || "road",
  total_packages: s(w.total_packages),
  total_weight: s(w.total_weight),
  total_value: s(w.total_value),
  freight_amount: s(w.freight_amount),
  other_charges: s(w.other_charges),
  status: s(w.status) || "issued",
});
const statusVariant = {
  draft: "default",
  issued: "info",
  in_transit: "warning",
  cancelled: "danger",
};

const InvoiceWaybills = () => {
  const { invoiceId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [invoice, setInvoice] = useState(state?.invoice || null);
  const [waybills, setWaybills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingWaybill, setEditingWaybill] = useState(null);
  const [form, setForm] = useState(buildInitial(state?.invoice));

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const openCreate = () => {
  setEditingWaybill(null);
  setForm(buildInitial(invoice));
  setShowForm(true);
};

const openEdit = (w) => {
  setEditingWaybill(w);
  setForm(buildFromWaybill(w));
  setShowForm(true);
};

const closeForm = () => {
  setShowForm(false);
  setEditingWaybill(null);
  setForm(buildInitial(invoice));
};
  const withExtras = (r) => ({
  ...r,
  invoice_number: r.invoice?.invoice_number || invoice?.invoice_number || "",
  store_logo: invoice?.store?.logo || "",
});
  const loadWaybills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await waybillAPI.list({ invoice_id: invoiceId });
      setWaybills(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load waybills");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    loadWaybills();
  }, [loadWaybills]);

  // If page was opened directly / refreshed, fetch the invoice to prefill the form
  useEffect(() => {
    if (invoice) return;
    (async () => {
      try {
        const res = await invoiceAPI.getById(invoiceId);
        const inv = res.data?.data || res.data;
        if (inv) {
          setInvoice(inv);
          setForm(buildInitial(inv));
        }
      } catch (err) {
        console.error("Failed to load invoice for prefill:", err);
      }
    })();
  }, [invoiceId]); // eslint-disable-line react-hooks/exhaustive-deps

  // const handleSubmit = async () => {
  //   if (!form.store_name.trim() || !form.customer_name.trim()) {
  //     toast.error("Store name and customer name are required");
  //     return;
  //   }

  //   const payload = { invoice_id: Number(invoiceId) };
  //   Object.entries(form).forEach(([k, v]) => {
  //     if (v !== "" && v != null) payload[k] = v;
  //   });

  //   setSubmitting(true);
  //   try {
  //     const res = await waybillAPI.generate(user?.id, payload);
  //     if (res.data?.status === true) {
  //       toast.success(res.data?.message || "Waybill created");
  //       setShowForm(false);
  //       setForm(buildInitial(invoice));
  //       loadWaybills();
  //     } else {
  //       toast.error(res.data?.message || "Failed to create waybill");
  //     }
  //   } catch (err) {
  //     const errors = err.response?.data?.errors;
  //     const first = errors ? Object.values(errors)[0]?.[0] : null;
  //     toast.error(first || err.response?.data?.message || "Failed to create waybill");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
  if (!form.store_name.trim() || !form.customer_name.trim()) {
    toast.error("Store name and customer name are required");
    return;
  }

  setSubmitting(true);
  try {
    let res;
    if (editingWaybill) {
      // send everything (including empty strings) so fields can be cleared
      res = await waybillAPI.update(editingWaybill.id, form);
    } else {
      const payload = { invoice_id: Number(invoiceId) };
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v != null) payload[k] = v;
      });
      res = await waybillAPI.generate(user?.id, payload);
    }

    if (res.data?.status === true) {
      toast.success(
        res.data?.message || (editingWaybill ? "Waybill updated" : "Waybill created")
      );
      closeForm();
      loadWaybills();
    } else {
      toast.error(res.data?.message || "Failed to save waybill");
    }
  } catch (err) {
    const errors = err.response?.data?.errors;
    const first = errors ? Object.values(errors)[0]?.[0] : null;
    toast.error(first || err.response?.data?.message || "Failed to save waybill");
  } finally {
    setSubmitting(false);
  }
};

  const columns = [
    { header: "Waybill No", accessor: "waybill_number", cell: (v) => <b>#{v}</b> },
    {
      header: "Date",
      accessor: "waybill_date",
      cell: (v) => (v ? new Date(v).toLocaleDateString("en-IN") : "-"),
    },
    { header: "Customer", accessor: "customer_name" },
    {
      header: "Route",
      accessor: "origin_city",
      cell: (_, r) => `${r.origin_city || "-"} → ${r.destination_city || "-"}`,
    },
    { header: "Vehicle", accessor: "vehicle_number", cell: (v) => v || "-" },
    {
      header: "Total Charges",
      accessor: "freight_amount",
      cell: (_, r) =>
        `₹${((parseFloat(r.freight_amount) || 0) + (parseFloat(r.other_charges) || 0)).toFixed(2)}`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (v) => <StatusBadge status={v} variant={statusVariant[v] || "default"} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_, r) => (
        <div className="flex items-center gap-1">
          <button
  type="button"
  title="Edit"
  onClick={() => openEdit(r)}
  className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg"
>
  <FiEdit2 className="w-4 h-4" />
</button>
          <button
            type="button"
            title="Print"
            onClick={() => printWaybill(withExtras(r))}
            className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg"
          >
            <FiPrinter className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Download PDF"
            onClick={() => downloadWaybill(withExtras(r))}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Waybills</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Invoice #{invoice?.invoice_number || invoiceId}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={FiArrowLeft} onClick={() => navigate("/invoices")}>
            Back to Invoices
          </Button>
          {/* <Button icon={FiPlus} onClick={() => setShowForm(true)}>
            Generate Waybill
          </Button> */}
          <Button icon={FiPlus} onClick={openCreate}>
           Generate Waybill
          </Button>
          
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {!loading && waybills.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No waybills for this invoice yet. Click “Generate Waybill”.
          </div>
        ) : (
          <Table columns={columns} data={waybills} loading={loading} />
        )}
      </div>

      {/* <Modal
        isOpen={showForm}
        onClose={() => !submitting && setShowForm(false)}
        title="Generate Waybill"
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting} disabled={submitting}>
              Generate
            </Button>
          </div>
        }
      > */}
            <Modal
        isOpen={showForm}
        onClose={() => !submitting && closeForm()}
        title={editingWaybill ? `Edit Waybill #${editingWaybill.waybill_number}` : "Generate Waybill"}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeForm} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting} disabled={submitting}>
              {editingWaybill ? "Save changes" : "Generate"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <section>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Store (From)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Store name *" value={form.store_name} onChange={setField("store_name")} />
              <Input label="Store phone" value={form.store_phone} onChange={setField("store_phone")} />
              <Input label="Store GSTIN (15 chars)" value={form.store_gstin} onChange={setField("store_gstin")} maxLength={15} />
              <Input label="Store address" value={form.store_address} onChange={setField("store_address")} />
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Customer (To)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Customer name *" value={form.customer_name} onChange={setField("customer_name")} />
              <Input label="Customer phone" value={form.customer_phone} onChange={setField("customer_phone")} />
              <Input label="Customer GSTIN (15 chars)" value={form.customer_gstin} onChange={setField("customer_gstin")} maxLength={15} />
              <Input label="Customer pincode" value={form.customer_pincode} onChange={setField("customer_pincode")} />
              <Input label="Customer address" value={form.customer_address} onChange={setField("customer_address")} />
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Transport</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Origin city" value={form.origin_city} onChange={setField("origin_city")} />
              <Input label="Origin pincode" value={form.origin_pincode} onChange={setField("origin_pincode")} />
              <Input label="Destination city" value={form.destination_city} onChange={setField("destination_city")} />
              <Input label="Destination pincode" value={form.destination_pincode} onChange={setField("destination_pincode")} />
              <Input label="Vehicle number" value={form.vehicle_number} onChange={setField("vehicle_number")} />
              <Select
                label="Transport mode"
                value={form.transport_mode}
                onChange={setField("transport_mode")}
                options={[
                  { value: "road", label: "Road" },
                  { value: "rail", label: "Rail" },
                  { value: "air", label: "Air" },
                  { value: "ship", label: "Ship" },
                ]}
              />
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Goods & Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Total packages" type="number" value={form.total_packages} onChange={setField("total_packages")} />
              <Input label="Total weight (kg)" type="number" value={form.total_weight} onChange={setField("total_weight")} />
              <Input label="Goods value (₹)" type="number" value={form.total_value} onChange={setField("total_value")} />
              <Input label="Freight amount (₹)" type="number" value={form.freight_amount} onChange={setField("freight_amount")} />
              <Input label="Other charges (₹)" type="number" value={form.other_charges} onChange={setField("other_charges")} />
              <Select
                label="Status"
                value={form.status}
                onChange={setField("status")}
                // options={[
                //   { value: "draft", label: "Draft" },
                //   { value: "issued", label: "Issued" },
                //   { value: "in_transit", label: "In transit" },
                //   { value: "cancelled", label: "Cancelled" },
                // ]}
                options={[
                      { value: "draft", label: "Draft" },
                      { value: "issued", label: "Issued" },
                      { value: "in_transit", label: "In transit" },
                      { value: "cancelled", label: "Cancelled" },
                      ...(form.status === "delivered" ? [{ value: "delivered", label: "Delivered" }] : []),
                    ]}
              />
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceWaybills;