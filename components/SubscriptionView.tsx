
import React, { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Loader2,
  Zap
} from 'lucide-react';

interface SubscriptionViewProps {
  onBack?: () => void;
}

type BillingCycle = 'Monthly' | 'Quarterly' | 'Yearly';

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onBack }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'loading' | 'success' | 'failed'>('details');
  const [currentPlanId, setCurrentPlanId] = useState<string>('free');

  const plans = [
    {
      id: 'free',
      name: 'Pay As You Go',
      priceMonthly: 0,
      priceQuarterly: 0,
      priceYearly: 0,
      included: [
        'Standard visibility',
        'Basic analytics',
        'Support within 48h',
        'Platform Fees (Delivery)'
      ],
      notIncluded: [],
      isPopular: false,
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      priceMonthly: 1999,
      priceQuarterly: 5399,
      priceYearly: 19190,
      included: [
        'Priority listing & tags',
        'Advanced marketing tools',
        'Dedicated account manager',
        'Priority 24/7 support',
        '0% Commission',
        'Platform Fees (Delivery)'
      ],
      notIncluded: [],
      isPopular: true,
    }
  ].map(plan => ({ ...plan, isCurrent: plan.id === currentPlanId }));

  const faqs = [
    {
      question: "What happens after subscription ends?",
      answer: "Your account will be downgraded to the free tier, which has higher commission rates and limited features. You can renew at any time to restore your benefits."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your benefits will remain active until the end of your current billing cycle."
    },
    {
      question: "Will GST invoice be provided?",
      answer: "Yes, a GST invoice is generated for every successful payment and can be downloaded from the Business Documents section."
    },
    {
      question: "Can I upgrade or downgrade plan?",
      answer: "You can upgrade your plan instantly. The prorated amount will be adjusted. Downgrades will take effect at the start of your next billing cycle."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const calculateTotal = (price: number) => {
    return Math.round(price * 1.18);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Subscription</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Current Subscription Info Card */}
        <div className="bg-[#FFFFFF] rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Outlet ID</p>
              <p className="font-bold text-slate-900">OUT-1023</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Active
            </div>
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Subscription Type</p>
              <p className="font-bold text-slate-900">{plans.find(p => p.id === currentPlanId)?.name} Plan</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-[11px] text-slate-500 mb-0.5">Start Date</p>
              <p className="text-sm font-semibold text-slate-900">01 Jan 2026</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 mb-0.5">End Date</p>
              <p className="text-sm font-semibold text-slate-900">31 Jan 2026</p>
            </div>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex flex-col items-center">
          <div className="relative bg-[#F3F4F6] p-1 rounded-full flex items-center w-full max-w-[320px]">
            <div 
               className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-full shadow-sm transition-all duration-300 ease-out"
               style={{ 
                 left: '4px', 
                 width: 'calc((100% - 8px) / 3)',
                 transform: `translateX(${['Monthly', 'Quarterly', 'Yearly'].indexOf(billingCycle) * 100}%)` 
               }}
            />
            {(['Monthly', 'Quarterly', 'Yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`relative z-10 flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 ${
                  billingCycle === cycle 
                    ? 'text-[#1E90FF]' 
                    : 'text-[#6B7280] hover:text-slate-900'
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
          {billingCycle === 'Yearly' && (
            <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Save 20% on yearly plan
            </p>
          )}
        </div>

        {/* 0% Commission Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Zap size={100} className="-mt-4 -mr-4" />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="bg-[#FFFFFF]/20 p-1.5 rounded-lg">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-lg">0% Commission</h4>
          </div>
          <p className="text-blue-100 text-sm">Enjoy zero commission on all your direct food offers and promotions to customers!</p>
        </div>

        {/* Platform Fees */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Platform Fees (Delivery)</h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold border-b">Order Value</th>
                  <th className="px-4 py-3 font-semibold border-b text-right">Fee (+18% GST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 bg-[#FFFFFF]">₹0 - ₹200</td>
                  <td className="px-4 py-3 bg-[#FFFFFF] text-right font-medium text-slate-900">₹10</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-[#FFFFFF]">₹201 - ₹400</td>
                  <td className="px-4 py-3 bg-[#FFFFFF] text-right font-medium text-slate-900">₹20</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-[#FFFFFF]">₹401 and above</td>
                  <td className="px-4 py-3 bg-[#FFFFFF] text-right font-medium text-slate-900">₹30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Subscription Plans</h4>
          <div className="grid gap-3">
            {plans.map((plan) => {
              const price = billingCycle === 'Monthly' ? plan.priceMonthly : billingCycle === 'Quarterly' ? plan.priceQuarterly : plan.priceYearly;
              const total = calculateTotal(price);

              return (
                <div 
                  key={plan.id}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    plan.isPopular ? 'border-[#1E90FF] bg-blue-50/50 shadow-md shadow-blue-100' : 'border-slate-200 bg-[#FFFFFF]'
                  }`}
                >
                  {plan.isCurrent && (
                    <div className="absolute top-4 right-4 text-[#1E90FF]">
                      <Check size={20} />
                    </div>
                  )}
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Recommended
                    </div>
                  )}
                  
                  <h5 className={`font-bold text-slate-900 text-lg mb-1 ${plan.isPopular ? 'mt-1' : ''}`}>{plan.name}</h5>
                  <div className="text-2xl font-bold text-[#1E90FF] mb-2">
                    ₹{price} <span className="text-sm font-normal text-slate-500">/ {billingCycle.toLowerCase().replace('ly', '')}</span>
                  </div>
                  {price > 0 && (
                    <p className="text-xs text-slate-500 font-medium mb-3">+ 18% GST (Total: ₹{total})</p>
                  )}
                  
                  <ul className="text-sm text-slate-600 space-y-1 mb-4">
                    {plan.included.map((benefit, i) => (
                      <li key={i}>✓ {benefit}</li>
                    ))}
                  </ul>

                  {plan.isCurrent ? (
                    <button disabled className="w-full h-10 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border border-slate-200">
                      <CheckCircle2 size={16} />
                      Current Plan
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowPaymentModal(true);
                        setPaymentStep('details');
                      }}
                      className={`w-full h-10 rounded-lg font-bold text-sm active:scale-[0.98] transition-all ${
                        plan.isPopular 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-blue-900 text-sm">Want more orders?</h4>
            <p className="text-xs text-blue-700 mt-0.5">Upgrade to unlock more orders</p>
          </div>
          <button className="h-[32px] px-3 bg-blue-600 text-white rounded-lg text-xs font-bold active:scale-95 transition-transform">
            Upgrade
          </button>
        </div>

        {/* FAQ Section */}
        <div className="pt-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-[#FFFFFF] border border-slate-200 rounded-[16px] overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left active:bg-slate-50"
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4">{faq.question}</span>
                  <div className={`shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <div 
                  className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div 
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setShowPaymentModal(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            {paymentStep === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Confirm Subscription</h3>
                  <p className="text-sm text-slate-500 mt-1">Review your plan details before paying</p>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 space-y-3 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Plan</span>
                    <span className="font-bold text-blue-600">{selectedPlan.name} ({billingCycle})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Outlet ID</span>
                    <span className="font-medium text-slate-900">OUT-1023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Start Date</span>
                    <span className="font-medium text-slate-900">
                      {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">End Date</span>
                    <span className="font-medium text-slate-900">
                      {new Date(new Date().setMonth(new Date().getMonth() + (billingCycle === 'Monthly' ? 1 : billingCycle === 'Quarterly' ? 3 : 12))).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between">
                    <span className="font-semibold text-slate-900">Total Amount</span>
                    <span className="font-bold text-slate-900">
                      ₹{calculateTotal(billingCycle === 'Monthly' ? selectedPlan.priceMonthly : billingCycle === 'Quarterly' ? selectedPlan.priceQuarterly : selectedPlan.priceYearly)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setPaymentStep('loading');
                      setTimeout(() => {
                        // Simulate payment success or failure
                        const isSuccess = Math.random() > 0.2; // 80% success rate
                        setPaymentStep(isSuccess ? 'success' : 'failed');
                      }, 2000);
                    }}
                    className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'loading' && (
              <div className="space-y-6 text-center py-8">
                <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Processing Payment</h3>
                  <p className="text-slate-500 mt-2">Please wait while we process your payment...</p>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Payment Successful</h3>
                  <p className="text-slate-500 mt-2 leading-relaxed">
                    Your subscription to the {selectedPlan.name} plan is now active.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setCurrentPlanId(selectedPlan.id);
                    setShowPaymentModal(false);
                  }}
                  className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                >
                  Close
                </button>
              </div>
            )}

            {paymentStep === 'failed' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <X size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Payment Failed</h3>
                  <p className="text-slate-500 mt-2 leading-relaxed">
                    We couldn't process your payment. Please try again or use a different payment method.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setPaymentStep('details')}
                    className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

