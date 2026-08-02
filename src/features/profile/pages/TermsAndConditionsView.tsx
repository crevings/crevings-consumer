import React from 'react';
import { 
  ArrowLeft, FileText, Shield, User, Clock, 
  CheckCircle2, AlertTriangle, Scale, Lock, Phone, Mail, Globe, Info
} from 'lucide-react';

interface TermsAndConditionsViewProps {
  onBack: () => void;
}

export const TermsAndConditionsView: React.FC<TermsAndConditionsViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-[slideUp_0.3s_ease-out] flex flex-col font-sans">
      {/* Header */}
      <div className="px-5 py-5 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-slate-900 leading-tight">Terms & Conditions</h1>
          <p className="text-[11px] text-[#00bd6f] font-medium">Effective Date: July 10, 2025</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">
        
        {/* Intro Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00bd6f] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">CREVINGS – CONSUMER TERMS & CONDITIONS</h2>
              <p className="text-xs text-slate-500">Crevings Marketplace Private Limited</p>
            </div>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            These Terms & Conditions (&quot;Terms&quot;) govern the access, use, and interaction with the Crevings platform, including mobile applications, websites, APIs, communication channels, and related services operated by Crevings Marketplace Private Limited (&quot;Crevings&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
          </p>
          <div className="bg-emerald-50/55 rounded-xl p-3 border border-emerald-100/50">
            <p className="text-slate-700 text-xs font-medium leading-relaxed">
              By accessing or using the Crevings platform, you (&quot;User&quot;, &quot;Customer&quot;, &quot;you&quot;) acknowledge that you have read, understood, and agreed to be legally bound by these Terms.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">1</span>
            DEFINITIONS
          </h3>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div>
              <p className="font-bold text-slate-800">1.1 Platform</p>
              <p>&quot;Platform&quot; refers to the Crevings mobile applications, website, software systems, APIs, communication tools, and related digital infrastructure.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">1.2 User or Customer</p>
              <p>&quot;User&quot; or &quot;Customer&quot; refers to any individual accessing or using the Crevings platform for ordering food, making payments, browsing restaurants, communicating with support, or availing related services.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">1.3 Food Partner</p>
              <p>&quot;Food Partner&quot; refers to restaurants, cafés, bakeries, cloud kitchens, food businesses, or other food-serving establishments listed on the Crevings platform.</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">1.4 Delivery Partner</p>
              <p>&quot;Delivery Partner&quot; refers to independent riders, logistics providers, or delivery personnel responsible for order fulfillment.</p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">2</span>
            ELIGIBILITY
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Users below the age of 18 may access or use the platform only under the supervision, consent, or authorization of a parent or legal guardian.
          </p>
          <p className="text-xs text-slate-700 font-semibold">By using the platform, the User confirms that:</p>
          <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
            <li>all information provided is accurate and lawful;</li>
            <li>the User is legally capable of entering into binding agreements under applicable law; and</li>
            <li>the User will comply with these Terms and all applicable laws.</li>
          </ul>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            Crevings reserves the right to suspend, restrict, or terminate accounts found using false, misleading, or fraudulent information.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">3</span>
            ACCOUNT REGISTRATION & VERIFICATION
          </h3>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p><strong>3.1</strong> Users may be required to register using a valid mobile number and OTP verification.</p>
            <p><strong>3.2</strong> Users are responsible for maintaining the confidentiality of login credentials, OTPs, devices, and account access information.</p>
            <p><strong>3.3</strong> Users shall remain solely responsible for all activities conducted through their account.</p>
            <p><strong>3.4</strong> Crevings reserves the right to refuse, restrict, suspend, or terminate accounts involved in suspicious, abusive, fraudulent, unlawful, or harmful activities.</p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">4</span>
            PLATFORM SERVICES
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Crevings operates as a technology and logistics intermediary connecting Users with Food Partners and Delivery Partners. Services available on the platform may include food ordering, food delivery, takeaway ordering, restaurant discovery, dine-in services, reservations, customer support, promotional programs, and loyalty rewards. Crevings does not directly prepare food unless explicitly stated otherwise.
          </p>

          <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/60 space-y-2">
            <h4 className="font-bold text-xs text-amber-900">4.1 FOOD PARTNER RESPONSIBILITY</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Food Partners listed on the Crevings platform remain solely responsible for food preparation, ingredients, allergen disclosures, food quality, hygiene standards, packaging, and regulatory compliance. Crevings acts solely as a technology and logistics intermediary and does not independently verify or guarantee preparation practices.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">5</span>
            ORDER PLACEMENT & ACCEPTANCE
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>5.1</strong> Orders placed through the platform remain subject to acceptance, availability, and operational feasibility by the respective Food Partner.
          </p>

          <div className="space-y-3 pt-1 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-900">5.2 ORDER CANCELLATION WINDOW</h4>
            
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="font-bold text-xs text-emerald-900">Cancellation Within 60 Seconds</p>
              <p className="text-xs text-emerald-800 mt-1">Users may cancel an order within 60 seconds of placing the order. Orders cancelled within this period may be eligible for a full refund, subject to payment verification.</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="font-bold text-xs text-amber-900">Cancellation After 60 Seconds</p>
              <p className="text-xs text-amber-800 mt-1">After the initial 60-second period, the order enters food preparation status. Cancellation requests become restricted and only partial refunds may be available as platform fees and preparation costs become non-refundable.</p>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <p className="font-bold text-xs text-rose-900">After Order Is Marked &quot;Ready for Pickup&quot;</p>
              <p className="text-xs text-rose-800 mt-1">Once marked as &quot;Ready for Pickup&quot;, the order is deemed fully prepared. Cancellation requests are no longer accepted and refunds are not available except where verified operational errors occur.</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="font-bold text-xs text-slate-800">5.3 Delivery Estimates</p>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">Delivery timelines displayed on the platform are estimates only and may vary due to traffic, weather conditions, restaurant preparation delays, rider availability, operational constraints, or force majeure events.</p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">6</span>
            PRICING, PAYMENTS & CHARGES
          </h3>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p><strong>6.1</strong> Prices displayed on the platform may include food pricing, GST, packaging charges, delivery charges, platform fees, surge charges, and operational charges.</p>
            <p><strong>6.2</strong> Users agree to pay the full amount displayed during checkout.</p>
            <p><strong>6.3</strong> Accepted payment methods include UPI, debit cards, credit cards, net banking, wallets, and cash on delivery (where available).</p>
            <p><strong>6.4</strong> Crevings reserves the right to revise pricing structures, delivery charges, platform fees, and operational fees at any time.</p>
          </div>
        </div>

        {/* Section 7 & 8 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">7</span>
              CANCELLATION POLICY
            </h3>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p><strong>7.1 User Cancellation:</strong> Subject to cancellation rules under Section 5.2 and applicable refund policies.</p>
              <p><strong>7.2 Restaurant Cancellation:</strong> If a restaurant is unable to fulfill an order, the order may be cancelled and eligible refunds processed.</p>
              <p><strong>7.3 Delivery-Related Cancellation:</strong> Orders may be cancelled due to inability to contact customer, invalid address, repeated delivery failure, safety concerns, or operational limitations.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">8</span>
              REFUND POLICY
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Refund requests remain subject to the Crevings Refund Policy. Refunds may be considered in situations including failed payment with no order confirmation, undelivered orders, missing items, incorrect orders, duplicate payments, verified quality concerns, or operational failures.
            </p>
          </div>
        </div>

        {/* Section 9 & 10 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">9</span>
              USER CONDUCT & PROHIBITED ACTIVITIES
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">Users agree not to:</p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
              <li>place fraudulent orders or abuse refund systems;</li>
              <li>harass delivery partners, restaurants, or support personnel;</li>
              <li>misuse promotional systems or manipulate pricing;</li>
              <li>engage in unlawful activities or create multiple fraudulent accounts.</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">10</span>
              DELIVERY TERMS
            </h3>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p><strong>10.1</strong> Users must provide accurate delivery information and maintain reachable contact details.</p>
              <p><strong>10.2</strong> Delivery Partners may contact Users solely for order fulfillment purposes.</p>
              <p><strong>10.3</strong> If a User remains unreachable after reasonable attempts, the order may be cancelled and refund eligibility restricted.</p>
              <p><strong>10.4</strong> Delivery availability depends on operational coverage, rider availability, and weather conditions.</p>
            </div>
          </div>
        </div>

        {/* Section 11 - 14 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">11. PLATFORM AVAILABILITY</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Crevings continuously works to maintain platform reliability. However, access may occasionally be interrupted for maintenance, software updates, internet outages, or disruptions beyond control.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">12. PROMOTIONS, OFFERS & COUPONS</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Promotional offers, rewards, cashback, and coupons remain subject to specific terms. Crevings reserves the right to modify, suspend, or invalidate offers in cases involving misuse, fraud, or technical errors.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">13. INTELLECTUAL PROPERTY</h4>
            <p className="text-xs text-slate-600 leading-relaxed">All trademarks, logos, branding, software systems, interfaces, designs, and content associated with Crevings remain the exclusive property of the Company.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">14. LIMITATION OF LIABILITY</h4>
            <p className="text-xs text-slate-600 leading-relaxed">To the maximum extent permitted by law, Crevings shall not be liable for food quality issues, allergen incidents, or external delivery delays. Where liability applies, liability shall remain limited to the actual order value paid.</p>
          </div>
        </div>

        {/* Section 15 - 19 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">15. PRIVACY & COMMUNICATIONS</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Use of the platform is governed by the Crevings Privacy Policy. Users consent to receiving operational and transactional communications through SMS, WhatsApp, RCS messaging, email, push notifications, or calls.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">16. ACCOUNT SUSPENSION & TERMINATION</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Crevings reserves the right to suspend accounts, restrict platform access, or cancel orders where fraud, abuse, or legal violations are identified.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">17. MODIFICATIONS & 18. FORCE MAJEURE</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Crevings reserves the right to modify or discontinue any feature at any time. Crevings shall not be liable for delays caused by natural disasters, strikes, outages, or force majeure events.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">19. GOVERNING LAW & JURISDICTION</h4>
            <p className="text-xs text-slate-600 leading-relaxed">These Terms shall be governed by the laws of India, with exclusive jurisdiction under the competent courts located in Delhi, India.</p>
          </div>
        </div>

        {/* Section 20 Contact Information */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">20</span>
            CONTACT INFORMATION
          </h3>
          <p className="text-xs text-slate-600">For support, complaints, legal notices, or communications:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Support</p>
                <p className="text-xs font-bold text-slate-800">support@crevings.com</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp</p>
                <p className="text-xs font-bold text-slate-800">+91 8780971385</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Website</p>
                <p className="text-xs font-bold text-slate-800">https://www.crevings.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
