import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, Lock, RotateCcw } from 'lucide-react';

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
      title: 'Terms of Service',
      icon: FileText,
      summary: 'Usage guidelines and legal agreements between you and Crevings App regarding our delivery platform.',
      fullText: `1. Acceptance of Terms: By accessing or using the Crevings App, you agree to be bound by these Terms of Service and all applicable laws and regulations.

2. User Accounts: You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use our services.

3. Ordering & Delivery: While we strive for accuracy, delivery times are estimates and may vary due to external factors like traffic or weather. Prices are set by restaurants and are subject to change.

4. User Conduct: Users must not use the platform for any fraudulent or illegal activities. We reserve the right to suspend accounts that violate these terms.`
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