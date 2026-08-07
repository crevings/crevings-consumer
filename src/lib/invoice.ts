import { Order } from "@/types";
import { BRAND } from "@/config/brand";
import { formatINR } from "@/utils/currency";
import { normalizeOrderItems } from "@/utils/orderItems";

export interface InvoiceLine {
  name: string;
  quantity: number;
  price: number;
}

/**
 * Parses an order's line items, preferring the real backend line items when
 * they exist. Display-string fallbacks never invent prices — price is 0 when
 * unknown, and the invoice renders a dash instead of a made-up number.
 */
export function parseOrderItems(order: Order): InvoiceLine[] {
  return normalizeOrderItems(order).map((item) => ({
    name: item.name,
    quantity: item.quantity || 1,
    price: item.price ?? 0,
  }));
}

/** Honest totals: only real backend fields, never fabricated fallbacks. */
export function getOrderTotals(order: Order): {
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
} {
  const total = order.total ?? order.price ?? 0;
  return {
    total,
    subtotal: order.subtotal ?? total,
    deliveryFee: order.deliveryFee ?? 0,
    tax: order.tax ?? 0,
  };
}

const money = (value: number) => (value > 0 ? `${formatINR(value)}` : "—");

export function buildInvoiceHtml(order: Order): string {
  const orderId = order.realOrderId || order.id;
  const dateStr = order.orderDate || new Date().toLocaleDateString("en-IN");
  const itemsList = parseOrderItems(order);
  const { total, subtotal, deliveryFee, tax } = getOrderTotals(order);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tax Invoice - ${orderId}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #0f172a; background: #fff; }
        .invoice-card { max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 36px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00bd6f; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 28px; font-weight: 900; color: #00bd6f; letter-spacing: -0.5px; }
        .title { font-size: 14px; font-weight: 800; color: #475569; text-transform: uppercase; text-align: right; }
        .subtitle { font-size: 12px; font-weight: 500; color: #94a3b8; margin-top: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; font-size: 13px; line-height: 1.6; }
        .info-block { background: #f8fafc; padding: 14px; border-radius: 12px; border: 1px solid #f1f5f9; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
        .table th { background: #f1f5f9; text-align: left; padding: 12px 14px; border-bottom: 1px solid #cbd5e1; font-weight: 700; color: #334155; }
        .table td { padding: 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .summary { width: 260px; margin-left: auto; font-size: 13px; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; color: #475569; }
        .total-row { font-size: 17px; font-weight: 900; color: #0f172a; border-top: 2px solid #00bd6f; padding-top: 12px; margin-top: 8px; }
        .badge { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; border-radius: 6px; text-transform: uppercase; }
        .footer { text-align: center; margin-top: 36px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        @media print { body { margin: 0; } .invoice-card { border: none; padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div>
            <div class="logo">${BRAND.NAME}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${BRAND.LEGAL_NAME}</div>
          </div>
          <div class="title">
            TAX INVOICE<br>
            <div class="subtitle">#${orderId}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <strong style="color: #0f172a;">RESTAURANT DETAILS</strong><br>
            <strong>${order.restaurantName}</strong><br>
            <span style="color:#64748b;">${order.location || "Branch Address"}</span>
          </div>
          <div class="info-block" style="text-align: right;">
            <strong style="color: #0f172a;">ORDER SUMMARY</strong><br>
            <strong>Date:</strong> ${dateStr}<br>
            <strong>Status:</strong> <span class="badge">${order.status}</span><br>
            <strong>Payment Method:</strong> ${order.paymentMethod || "Online"}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList
              .map((item) => {
                const qty = item.quantity || 1;
                return `
                <tr>
                  <td><strong>${item.name || ""}</strong></td>
                  <td style="text-align:center;">${qty}</td>
                  <td style="text-align:right;">${money(item.price)}</td>
                  <td style="text-align:right;">${item.price > 0 ? `${formatINR(item.price * qty)}` : "—"}</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row"><span>Items Subtotal:</span><span>${money(subtotal)}</span></div>
          <div class="summary-row"><span>Delivery Charges:</span><span>${money(deliveryFee)}</span></div>
          <div class="summary-row"><span>GST & Platform Taxes:</span><span>${money(tax)}</span></div>
          <div class="summary-row total-row"><span>Total Amount Paid:</span><span>${money(total)}</span></div>
        </div>

        <div class="footer">
          This is a computer-generated tax invoice. No signature required.<br>
          For support, email us at ${BRAND.SUPPORT_EMAIL} or call ${BRAND.SUPPORT_PHONE}.
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;
}

export const downloadInvoice = (order: Order) => {
  const blob = new Blob([buildInvoiceHtml(order)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const invoiceWindow = window.open(url, "_blank");
  if (!invoiceWindow) {
    URL.revokeObjectURL(url);
    return;
  }
  // The popup loads a self-contained document from the blob URL, so the SPA's
  // document is never touched (no document.write). Revoke once it has loaded.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};
