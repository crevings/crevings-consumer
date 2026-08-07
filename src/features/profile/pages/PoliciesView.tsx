import React, { useState } from 'react';
import { ArrowLeft, FileText, Lock, RotateCcw } from 'lucide-react';
import { BRAND } from "@/config/brand";

interface PoliciesViewProps {
  onBack: () => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ onBack }) => {
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);

  const policies = [
    {
      id: 1,
      title: 'Privacy Policy',
      icon: Lock,
      summary: 'We are committed to protecting your personal information and being transparent about the data we collect.',
      fullText: `1. Information Collection: We collect information you provide directly to us, such as when you create an account, place an order, or contact support. This includes your name, email, phone number, and delivery addresses.

2. Location Data: To provide accurate delivery estimates and find restaurants near you, we collect precise location data from your device with your permission.

3. Usage of Data: Your data is used to process orders, personalize your experience, and improve our services. We do not sell your personal data to third parties.

4. Security: We implement industry-standard security measures to protect your information from unauthorized access or disclosure.`
    },
    {
      id: 2,
      title: 'Terms & Conditions',
      icon: FileText,
      summary: 'Rules, guidelines, and legal agreements between you and Crevings Marketplace Private Limited.',
      fullText: `Effective Date: July 10, 2025

These Terms & Conditions ("Terms") govern the access, use, and interaction with the Crevings platform operated by Crevings Marketplace Private Limited ("Crevings", "Company", "we", "our", or "us").

1. DEFINITIONS
1.1 Platform: Refers to Crevings mobile applications, website, software systems, APIs, and digital infrastructure.
1.2 User or Customer: Refers to any individual accessing or using the platform for ordering food, making payments, or availing services.
1.3 Food Partner: Refers to restaurants, cafés, cloud kitchens, and food businesses listed on Crevings.
1.4 Delivery Partner: Refers to independent riders or logistics providers.

2. ELIGIBILITY
Users below the age of 18 may access the platform only under supervision of a parent or legal guardian.

3. ACCOUNT REGISTRATION & VERIFICATION
Users register via valid mobile number and OTP verification and remain responsible for maintaining account confidentiality.

4. PLATFORM SERVICES & FOOD PARTNER RESPONSIBILITY
Crevings operates as a technology intermediary. Food Partners remain solely responsible for food preparation, quality, hygiene, and allergen disclosures.

5. ORDER CANCELLATION WINDOW
- Within 60 Seconds: Full refund eligible.
- After 60 Seconds: Order enters preparation status; partial or no refund may apply.
- After "Ready for Pickup": Cancellation no longer accepted; non-refundable.

6. PRICING & PAYMENTS
Prices include food cost, GST, packaging, delivery, and platform fees. Payments accepted via UPI, Cards, Net Banking, Wallets, and COD.

7. GOVERNING LAW
Governed by the laws of India under the exclusive jurisdiction of competent courts in Delhi, India.

Contact Support: ${BRAND.SUPPORT_EMAIL} | WhatsApp: ${BRAND.SUPPORT_PHONE} | https://www.crevings.com`
    },
    {
      id: 3,
      title: 'Refund Policy',
      icon: RotateCcw,
      summary: 'Detailed information regarding order cancellations, missing items, and the refund process.',
      fullText: `1. Eligibility for Refunds: You are entitled to a refund if:
- The order delivered is significantly different from what you ordered.
- Items are missing from your delivery.
- The order is cancelled by the restaurant or by us due to unforeseen circumstances.

2. Cancellation Policy: Orders can be cancelled within 60 seconds of placement for a full refund. Once preparation starts, cancellation fees up to 100% of the order value may apply.

3. Refund Process: Approved refunds are processed within 5-7 business days to the original payment method. Refunds to the Crevings Wallet are processed instantly.

4. Disputes: For any order issues, please contact our 24/7 support within 2 hours of delivery for faster resolution.`
    }
  ];

  const activePolicy = policies.find(p => p.id === selectedPolicy);

  if (activePolicy) {
    return (
      <div className="min-h-screen bg-white animate-[slideUp_0.3s_ease-out] flex flex-col">
        <div className="px-5 py-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-slate-100">
          <button onClick={() => setSelectedPolicy(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-slate-900 truncate">{activePolicy.title}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <activePolicy.icon className="w-6 h-6" />
              </div>
              <div>
                  <h2 className="font-bold text-lg text-slate-900">{activePolicy.title}</h2>
                  <p className="text-xs text-slate-500">Last updated: Aug 20, 2024</p>
              </div>
           </div>
           <div className="prose prose-sm prose-slate max-w-none">
              <p className="text-slate-600 whitespace-pre-line leading-relaxed font-medium">{activePolicy.fullText}</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-[slideUp_0.3s_ease-out]">
      <div className="px-5 py-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-xl text-slate-900">Legal & Policies</h1>
      </div>
      <div className="p-5 space-y-4">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <policy.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">{policy.title}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-3 leading-relaxed">
                {policy.summary}
            </p>
            <button onClick={() => setSelectedPolicy(policy.id)} className="text-blue-600 text-xs font-bold mt-3 hover:underline">Read full policy</button>
          </div>
        ))}
      </div>
    </div>
  );
};