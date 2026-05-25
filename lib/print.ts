export const printKOT = (orderId: string, items: any[], tableNumber?: string, type?: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>KOT - ${orderId}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 20px; width: 300px; margin: 0 auto; color: #000; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 24px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 2px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 13px; text-align: left; margin-bottom: 10px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 10px; color: #555; text-transform: uppercase; }
          .meta-value { font-weight: bold; }
          
          .items-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 5px 0; margin-bottom: 10px; }
          .item { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; font-weight: bold; align-items: flex-start; }
          .item-name { flex: 1; padding-right: 10px; }
          .item-qty { width: 40px; text-align: right; font-size: 16px; }
          
          .footer { text-align: center; border-top: 2px solid #000; padding-top: 10px; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">KOT</h1>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Order No</span>
              <span class="meta-value">${orderId}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Type</span>
              <span class="meta-value">${type || 'Dine-in'}</span>
            </div>
            ${tableNumber ? `
            <div class="meta-item">
              <span class="meta-label">Table</span>
              <span class="meta-value">${tableNumber}</span>
            </div>
            ` : ''}
            <div class="meta-item">
              <span class="meta-label">Time</span>
              <span class="meta-value">${new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        <div class="items">
          <div class="items-header">
            <span>ITEM</span>
            <span>QTY</span>
          </div>
          ${items.map(item => `
            <div class="item">
              <span class="item-name">${item.name || item.item}</span>
              <span class="item-qty">x${item.quantity || item.qty || 1}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="footer">
          <p>*** END OF KOT ***</p>
        </div>
        <script>
          window.onload = () => { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printInvoice = (orderId: string, items: any[], total: number, customerName?: string, type?: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || item.qty || 1)), 0);
  const taxes = total - subtotal > 0 ? total - subtotal : 0;

  const html = `
    <html>
      <head>
        <title>Invoice - ${orderId}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 20px; width: 300px; margin: 0 auto; color: #000; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
          .restaurant-name { font-size: 22px; font-weight: bold; margin: 0 0 5px 0; text-transform: uppercase; }
          .address { font-size: 12px; margin: 2px 0; }
          .contact { font-size: 12px; margin: 2px 0; }
          .legal { font-size: 11px; margin: 2px 0; }
          .title { font-size: 16px; font-weight: bold; margin: 10px 0 5px 0; text-transform: uppercase; }
          
          .order-details { margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .meta { font-size: 12px; margin: 3px 0; display: flex; justify-content: space-between; }
          
          .items-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px; }
          .item { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
          .item-name { flex: 1; padding-right: 10px; }
          .item-qty { width: 30px; text-align: center; }
          .item-price { width: 60px; text-align: right; }
          
          .totals { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
          .bill-row { display: flex; justify-content: space-between; font-size: 12px; margin: 3px 0; }
          .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin: 8px 0; border-top: 1px solid #000; padding-top: 5px; }
          
          .footer { text-align: center; border-top: 1px dashed #000; padding-top: 15px; margin-top: 15px; font-size: 12px; }
          .thanks { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="restaurant-name">Gourmet Kitchen</h1>
          <p class="address">123 Food Street, Culinary District</p>
          <p class="address">New Delhi, 110001</p>
          <p class="contact">Ph: +91 98765 43210</p>
          <p class="legal">GSTIN: 07AABCU9603R1ZX</p>
          <p class="legal">FSSAI: 13321000000123</p>
          <h2 class="title">Tax Invoice</h2>
        </div>
        
        <div class="order-details">
          <div class="meta"><span>Order No:</span> <span>${orderId}</span></div>
          <div class="meta"><span>Date:</span> <span>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span></div>
          <div class="meta"><span>Type:</span> <span>${type || 'Dine-in'}</span></div>
          ${customerName ? `<div class="meta"><span>Customer:</span> <span>${customerName}</span></div>` : ''}
        </div>

        <div class="items">
          <div class="items-header">
            <span class="item-name">Item</span>
            <span class="item-qty">Qty</span>
            <span class="item-price">Amount</span>
          </div>
          ${items.map(item => `
            <div class="item">
              <span class="item-name">${item.name || item.item}</span>
              <span class="item-qty">${item.quantity || item.qty || 1}</span>
              <span class="item-price">${((item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div class="bill-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          ${taxes > 0 ? `
          <div class="bill-row">
            <span>Taxes & Charges</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row">
            <span>Grand Total</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p class="thanks">Thank You For Your Visit!</p>
          <p>Have a great day!</p>
        </div>
        <script>
          window.onload = () => { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
