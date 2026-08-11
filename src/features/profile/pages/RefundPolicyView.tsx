import React from 'react';
import { 
  ArrowLeft, RotateCcw, ShieldAlert, CheckCircle2, Clock, 
  FileText, Phone, Mail, Globe, AlertTriangle, 
  CreditCard, XCircle, RefreshCw, Ban
} from 'lucide-react';
import { BRAND } from '@/config/brand';

interface RefundPolicyViewProps {
  onBack: () => void;
}

export const RefundPolicyView: React.FC<RefundPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-[slideUp_0.3s_ease-out] flex flex-col font-sans">
      {/* Top Header */}
      <div className="px-5 py-4 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-slate-900 leading-tight">Refund Policy</h1>
          <p className="text-[11px] text-[#00bd6f] font-semibold">Effective Date: July 16, 2026</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">
        
        {/* Intro Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00bd6f] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">CREVINGS – CONSUMER REFUND POLICY</h2>
              <p className="text-xs text-slate-500">{BRAND.LEGAL_NAME}</p>
            </div>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            This Refund Policy governs refund eligibility, cancellations, processing timelines, limitations, and dispute resolution for orders placed through the Crevings platform operated by {BRAND.LEGAL_NAME} (&quot;Crevings&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
          </p>
          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
            <p className="text-slate-700 text-xs font-semibold leading-relaxed">
              By placing an order through the Crevings platform, users acknowledge and agree to the terms outlined in this Refund Policy.
            </p>
          </div>
        </div>

        {/* Section 1: Purpose */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FileText className="w-4 h-4 text-[#00bd6f]" />
            <span>1. PURPOSE OF THIS POLICY</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Crevings aims to maintain a fair, transparent, and balanced resolution process for Customers, Food Partners, and Delivery Partners.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Refund requests are evaluated based on platform records, operational findings, supporting evidence, and applicable policies. Refund approval is not automatic and remains subject to verification.
          </p>
        </div>

        {/* Section 2: Refund Eligibility */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#00bd6f]" />
            <span>2. REFUND ELIGIBILITY</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Refunds may be considered under the following circumstances:
          </p>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">2.1 Failed Payment but No Order Confirmation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If payment is successfully debited but no order is generated or order confirmation fails due to technical reasons, the amount may be automatically reversed or refunded after verification.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">2.2 Restaurant Unable to Fulfill Order</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refunds may be issued where the restaurant rejects the order after payment, ordered items become unavailable, the restaurant closes unexpectedly, or operational issues prevent order fulfillment.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">2.3 Order Not Delivered</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Users may be eligible for a refund where the order is not delivered, delivery fails due to operational reasons, or an order is incorrectly marked as delivered after verification.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">2.4 Missing or Incorrect Items</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Partial or full refunds may be considered if items are missing, incorrect items are delivered, or quantity discrepancies are verified. Users may be required to provide:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                <li>Photographs of received order and items</li>
                <li>Packaging evidence</li>
                <li>Invoice screenshots</li>
                <li>Order details and supporting documentation</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">2.5 Significant Food Quality Issues</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Refunds or compensation may be considered in cases involving spoiled food, visibly damaged food, severe packaging leakage, or significant quality concerns supported by evidence.
              </p>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <p className="text-[11px] text-amber-800 font-medium">
                  <strong>Note:</strong> Refunds will generally not be provided solely for taste preferences, spice levels, portion expectations, or subjective dissatisfaction.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1">2.6 Duplicate Payment or Double Charge</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refunds may be processed in cases involving duplicate transactions, accidental double payments, or payment gateway processing errors.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Non-Refundable Situations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <XCircle className="w-4 h-4 text-red-500" />
            <span>3. NON-REFUNDABLE SITUATIONS</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Refunds may not be issued in circumstances including but not limited to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {[
              "Incorrect delivery information provided by user",
              "Customer unavailability during delivery attempt",
              "Repeated failed delivery attempts",
              "Refusal to accept delivery without valid reason",
              "Minor delays caused by traffic or weather",
              "Subjective food preferences or spice levels",
              "Partially consumed food without verified issue",
              "Misuse or fraudulent refund claims",
              "Cash-on-delivery refusal without valid reason"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100/60 text-xs text-slate-700">
                <Ban className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Cancellations and Refunds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <RefreshCw className="w-4 h-4 text-[#00bd6f]" />
            <span>4. CANCELLATIONS AND REFUNDS</span>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-900">4.1 Customer-Initiated Cancellation</h4>
            
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <span className="inline-block bg-[#00bd6f] text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1">Within 60 Seconds</span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Users may cancel an order within 60 seconds of placing the order for a <strong>full refund</strong>, subject to successful payment verification.
              </p>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
              <span className="inline-block bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1">After 60 Seconds</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                After the initial 60-second cancellation window expires, the order enters food preparation. Cancellation requests may be restricted, and users may only be eligible for a partial refund as platform, payment processing, and food preparation costs become non-refundable.
              </p>
            </div>

            <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-100">
              <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1">After &quot;Ready for Pickup&quot;</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Once marked &quot;Ready for Pickup&quot;, the order is fully prepared. Cancellation requests will no longer be accepted, and no refund shall be issued except where required under applicable law or verified operational errors by Crevings.
              </p>
            </div>

            <h4 className="font-bold text-xs text-slate-900 pt-2">4.2 Restaurant or Platform Cancellation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Where cancellation occurs due to restaurant unavailability, operational failures, technical issues, or delivery partner allocation failures, eligible refunds will be processed to the original payment method or Crevings wallet.
            </p>
          </div>
        </div>

        {/* Section 5: Refund Submission Timelines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-[#00bd6f]" />
            <span>5. REFUND REQUEST SUBMISSION</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            To facilitate proper investigation and resolution, users are encouraged to report issues promptly:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Missing / Incorrect Items</span>
              <span className="text-xs font-bold text-slate-900">Within 24 Hours</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Food Quality Issues</span>
              <span className="text-xs font-bold text-slate-900">Within 24 Hours</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Payment Issues</span>
              <span className="text-xs font-bold text-slate-900">Within 7 Days</span>
            </div>
          </div>
        </div>

        {/* Section 6: Refund Processing Timelines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <CreditCard className="w-4 h-4 text-[#00bd6f]" />
            <span>6. REFUND PROCESSING TIMELINES</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Refund timelines vary depending on the payment method and financial institution:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Estimated Refund Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="p-3 font-semibold">UPI</td><td className="p-3">1–5 Business Days</td></tr>
                <tr><td className="p-3 font-semibold">Debit / Credit Card</td><td className="p-3">3–10 Business Days</td></tr>
                <tr><td className="p-3 font-semibold">Net Banking</td><td className="p-3">3–7 Business Days</td></tr>
                <tr><td className="p-3 font-semibold">Wallet Refund</td><td className="p-3 text-[#00bd6f] font-bold">Instant to 24 Hours</td></tr>
                <tr><td className="p-3 font-semibold">Cash on Delivery</td><td className="p-3">Wallet Credit or Manual Review</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7 & 8: Methods & Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-[#00bd6f]" />
            <span>7 & 8. REFUND METHODS & VERIFICATION</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Refunds may be processed through the original payment source, Crevings wallet credits, promotional credits, or coupon compensation depending on technical and operational requirements.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Crevings reserves the right to review refund requests, request supporting evidence, verify platform logs, contact delivery partners, and reject unsupported or fraudulent claims.
          </p>
        </div>

        {/* Section 9 & 10: Fraud Prevention & Liability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>9 & 10. FRAUD PREVENTION & LIMITATION OF LIABILITY</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fraudulent activities, abusive refund claims, or false missing-item claims may result in permanent account suspension, payment restrictions, or reporting to authorities.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Refund eligibility remains limited to the actual amount paid by the user for the affected order.
          </p>
        </div>

        {/* Section 12: Contact Information */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">12. CONTACT INFORMATION</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            For refund-related concerns, disputes, or support requests, please reach out to us:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <a 
              href={`mailto:${BRAND.SUPPORT_EMAIL}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100/60 flex items-center justify-center text-[#00bd6f] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Email Support</span>
                <span className="text-xs font-bold text-slate-900 truncate block">{BRAND.SUPPORT_EMAIL}</span>
              </div>
            </a>

            <a 
              href={`https://wa.me/918678842995`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100/60 flex items-center justify-center text-[#00bd6f] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">WhatsApp Support</span>
                <span className="text-xs font-bold text-slate-900 truncate block">+91-8678842995</span>
              </div>
            </a>

            <a 
              href="https://www.crevings.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100/60 flex items-center justify-center text-[#00bd6f] shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Official Website</span>
                <span className="text-xs font-bold text-slate-900 truncate block">www.crevings.com</span>
              </div>
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center py-4">
          <p className="text-[11px] text-slate-400 font-medium">
            © {new Date().getFullYear()} {BRAND.LEGAL_NAME}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
};
