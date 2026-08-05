import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  Receipt,
  Building,
  RotateCcw,
  Star,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Order } from '@/types';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onReorderClick?: (order: Order) => void;
  onRateClick?: (order: Order) => void;
}

export const downloadInvoice = (order: Order) => {
  const invoiceWindow = window.open('', '_blank');
  if (!invoiceWindow) return;

  const orderId = order.realOrderId || order.id;
  const dateStr = order.orderDate || new Date().toLocaleDateString('en-IN');
  
  const rawItems = order.rawItems && order.rawItems.length > 0 ? order.rawItems : null;
  const itemsList = rawItems || order.items.split(',').map(i => {
    const parts = i.trim().split('x');
    return { name: parts[0]?.trim() || i.trim(), quantity: parseInt(parts[1] || '1', 10) || 1, price: 120 };
  });

  const total = order.total || order.price || 0;
  const subtotal = order.subtotal || (total > 40 ? total - 40 : total);
  const deliveryFee = order.deliveryFee || 25;
  const tax = order.tax || (total > 40 ? 15 : 0);

  invoiceWindow.document.write(`
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
            <div class="logo">Crevings</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Crevings Marketplace Private Limited</div>
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
            <span style="color:#64748b;">${order.location || 'Branch Address'}</span>
          </div>
          <div class="info-block" style="text-align: right;">
            <strong style="color: #0f172a;">ORDER SUMMARY</strong><br>
            <strong>Date:</strong> ${dateStr}<br>
            <strong>Status:</strong> <span class="badge">${order.status}</span><br>
            <strong>Payment Method:</strong> ${order.paymentMethod || 'Online'}
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
            ${itemsList.map((item: any) => {
              const qty = item.quantity || 1;
              const unitPrice = item.price || 120;
              return `
                <tr>
                  <td><strong>${item.name || item}</strong></td>
                  <td style="text-align:center;">${qty}</td>
                  <td style="text-align:right;">₹${unitPrice}</td>
                  <td style="text-align:right;">₹${unitPrice * qty}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row"><span>Items Subtotal:</span><span>₹${subtotal}</span></div>
          <div class="summary-row"><span>Delivery Charges:</span><span>₹${deliveryFee}</span></div>
          <div class="summary-row"><span>GST & Platform Taxes:</span><span>₹${tax}</span></div>
          <div class="summary-row total-row"><span>Total Amount Paid:</span><span>₹${total}</span></div>
        </div>

        <div class="footer">
          This is a computer-generated tax invoice. No signature required.<br>
          For support, email us at support@crevings.com or call +91-8780971385.
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  invoiceWindow.document.close();
};

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ 
  order, 
  onBack,
  onReorderClick,
  onRateClick
}) => {
  if (!order) return null;

  const rawItems = order.rawItems && order.rawItems.length > 0 ? order.rawItems : null;
  const itemsList = rawItems || order.items.split(',').map(i => {
    const parts = i.trim().split('x');
    return { name: parts[0]?.trim() || i.trim(), quantity: parseInt(parts[1] || '1', 10) || 1, price: 120 };
  });

  const total = order.total || order.price || 0;
  const subtotal = order.subtotal || (total > 40 ? total - 40 : total);
  const deliveryFee = order.deliveryFee || 25;
  const tax = order.tax || (total > 40 ? 15 : 0);
  const statusStr = String(order.status || '');
  const isCompleted = statusStr === 'Completed' || statusStr === 'COMPLETED' || statusStr === 'DELIVERED';
  const isCancelled = statusStr === 'Cancelled' || statusStr === 'CANCELLED';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 max-w-md mx-auto shadow-2xl">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">Order Details</h1>
            <p className="text-xs text-slate-500 font-mono">#{order.realOrderId || order.id}</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#00bd6f] flex items-center justify-center font-bold">
          <Receipt className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">

        {/* Restaurant Banner Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-[#00bd6f] shrink-0 font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-900 text-base truncate">{order.restaurantName}</h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">{order.location || 'Restaurant Branch Address'}</p>
            {order.orderDate && (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{order.orderDate}</span>
              </div>
            )}
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
            isCompleted 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : isCancelled 
              ? 'bg-red-50 text-red-600 border border-red-100' 
              : 'bg-blue-50 text-blue-600 border border-blue-100'
          }`}>
            {order.status}
          </span>
        </div>

        {/* Items Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h3>
          <div className="space-y-3 divide-y divide-slate-100">
            {itemsList.map((item: any, idx: number) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {item.quantity || 1}x
                  </span>
                  <span className="font-semibold text-slate-800">{item.name || item}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">₹{(item.price || 120) * (item.quantity || 1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill Details</h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-medium text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-medium text-slate-800">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Taxes</span>
              <span className="font-medium text-slate-800">₹{tax}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Paid</span>
              <span className="text-base text-[#00bd6f]">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button 
            onClick={() => downloadInvoice(order)}
            className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-[#00bd6f]/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Tax Invoice
          </button>

          <div className="flex gap-2.5">
            {onReorderClick && (
              <button 
                onClick={() => onReorderClick(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs border border-slate-200 shadow-sm active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                Reorder Items
              </button>
            )}

            {isCompleted && onRateClick && (
              <button 
                onClick={() => onRateClick(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs border border-slate-200 shadow-sm active:scale-95 transition-all"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Rate Order
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
