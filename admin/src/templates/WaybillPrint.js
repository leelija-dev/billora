import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const money = (v) => `₹${(parseFloat(v) || 0).toFixed(2)}`;

export const buildWaybillHtml = (w) => {
  const total =
    (parseFloat(w.freight_amount) || 0) + (parseFloat(w.other_charges) || 0);
  const date = w.waybill_date
    ? new Date(w.waybill_date).toLocaleDateString("en-IN")
    : "-";
  const logo =
  typeof w.store_logo === "string" && w.store_logo.trim() ? w.store_logo : "";
  return `
  <div style="font-family:Arial,sans-serif;color:#111;width:760px;margin:0 auto;padding:24px;box-sizing:border-box;background:#fff;">
    <style>
      .box{border:1px solid #222;padding:10px;font-size:12px;line-height:1.5}
      .box h4{margin:0 0 6px;font-size:12px;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:4px}
      table.t{width:100%;border-collapse:collapse;font-size:12px}
      table.t td,table.t th{border:1px solid #222;padding:6px 8px;text-align:left}
      table.t th{background:#f3f3f3}
    </style>

        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:12px">
        ${
          logo
            ? `<img src="${esc(logo)}" crossorigin="anonymous" onerror="this.style.display='none'" style="height:55px;max-width:110px;object-fit:contain" />`
            : ""
        }
        <div>
          <div style="font-size:22px;font-weight:700;letter-spacing:1px">WAYBILL</div>
          <div style="font-size:12px;margin-top:4px">No: <b>${esc(w.waybill_number)}</b></div>
          <div style="font-size:12px">Date: ${esc(date)}</div>
          <div style="font-size:12px">Invoice No: ${esc(w.invoice_number || w.invoice?.invoice_number || "-")}</div>
        </div>
      </div>
      <div style="text-align:right">
        ${w.waybill_qr ? `<img src="${esc(w.waybill_qr)}" crossorigin="anonymous" style="height:55px" />` : ""}
        <div style="font-size:11px">${esc(w.waybill_number)}</div>
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:12px">
      <div class="box" style="flex:1">
        <h4>Consignor (From)</h4>
        <b>${esc(w.store_name)}</b><br/>
        ${esc(w.store_address || "")}<br/>
        ${w.store_phone ? `Phone: ${esc(w.store_phone)}<br/>` : ""}
        ${w.store_gstin ? `GSTIN: ${esc(w.store_gstin)}` : ""}
      </div>
      <div class="box" style="flex:1">
        <h4>Consignee (To)</h4>
        <b>${esc(w.customer_name)}</b><br/>
        ${esc(w.customer_address || "")} ${esc(w.customer_pincode || "")}<br/>
        ${w.customer_phone ? `Phone: ${esc(w.customer_phone)}<br/>` : ""}
        ${w.customer_gstin ? `GSTIN: ${esc(w.customer_gstin)}` : ""}
      </div>
    </div>

    <table class="t" style="margin-bottom:12px">
      <tr><th>Origin</th><th>Destination</th><th>Transport Mode</th><th>Vehicle No.</th></tr>
      <tr>
        <td>${esc(w.origin_city || "-")} ${esc(w.origin_pincode || "")}</td>
        <td>${esc(w.destination_city || "-")} ${esc(w.destination_pincode || "")}</td>
        <td style="text-transform:capitalize">${esc(w.transport_mode || "road")}</td>
        <td>${esc(w.vehicle_number || "-")}</td>
      </tr>
    </table>

    <table class="t" style="margin-bottom:12px">
      <tr><th>Total Packages</th><th>Total Weight (kg)</th><th>Goods Value</th><th>Freight</th><th>Other Charges</th><th>Total Charges</th></tr>
      <tr>
        <td>${esc(w.total_packages ?? 0)}</td>
        <td>${esc(w.total_weight ?? 0)}</td>
        <td>${money(w.total_value)}</td>
        <td>${money(w.freight_amount)}</td>
        <td>${money(w.other_charges)}</td>
        <td><b>${money(total)}</b></td>
      </tr>
    </table>

    ${
      w.invoice_qr
        ? `<div style="text-align:center;margin:14px 0">
             <img src="${esc(w.invoice_qr)}" crossorigin="anonymous" style="height:50px" />
             
           </div>`
        : ""
    }

    <div style="display:flex;justify-content:space-between;margin-top:50px;font-size:12px">
      <div style="border-top:1px solid #111;padding-top:4px;width:200px;text-align:center">Consignor Signature</div>
      <div style="border-top:1px solid #111;padding-top:4px;width:200px;text-align:center">Authorised Signatory</div>
    </div>
  </div>`;
};

export const printWaybill = (w) => {
  const win = window.open("", "_blank", "width=900,height=900");
  if (!win) {
    alert("Please allow pop-ups to print.");
    return;
  }
  win.document.write(
    `<html><head><title>Waybill ${esc(w.waybill_number)}</title></head><body style="margin:0">${buildWaybillHtml(w)}</body></html>`
  );
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
};

export const downloadWaybill = async (w) => {
  const holder = document.createElement("div");
  holder.style.cssText =
    "position:fixed;left:-10000px;top:0;width:760px;background:#fff";
  holder.innerHTML = buildWaybillHtml(w);
  document.body.appendChild(holder);

  try {
    // wait for barcode images
    const imgs = Array.from(holder.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = img.onerror = res;
            })
      )
    );

    const canvas = await html2canvas(holder, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 8;

    let imgW = pageW - margin * 2;
    let imgH = (canvas.height * imgW) / canvas.width;
    if (imgH > pageH - margin * 2) {
      imgH = pageH - margin * 2;
      imgW = (canvas.width * imgH) / canvas.height;
    }

    pdf.addImage(canvas.toDataURL("image/jpeg", 0.98), "JPEG", margin, margin, imgW, imgH);
    pdf.save(`waybill-${w.waybill_number}.pdf`);
  } finally {
    document.body.removeChild(holder);
  }
};