import React from 'react';
import { 
  ArrowLeft, Shield, Key, Eye, Share2, Lock, 
  Clock, User, FileText, Info, Phone, 
  Database, Mail, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
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
          <h1 className="font-bold text-lg text-slate-900 leading-tight">Privacy Policy</h1>
          <p className="text-[11px] text-[#00bd6f] font-medium">Effective Date: July 16, 2026</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">
        
        {/* Intro Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#00bd6f] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Crevings Consumer Privacy Policy</h2>
              <p className="text-xs text-slate-500">Crevings Marketplace Private Limited</p>
            </div>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            This Privacy Policy explains how Crevings Marketplace Private Limited (&quot;Crevings&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, stores, processes, shares, and protects personal information of users (&quot;Users&quot;, &quot;Customers&quot;, &quot;you&quot;) who access or use the Crevings platform, including our mobile applications, websites, APIs, communication channels, and related services.
          </p>
          <div className="bg-emerald-50/55 rounded-xl p-3 border border-emerald-100/50">
            <p className="text-slate-700 text-xs font-medium leading-relaxed">
              By accessing or using the Crevings platform, you acknowledge that you have read, understood, and agreed to this Privacy Policy.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          
          {/* Section 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Database className="w-4 h-4" />
              </div>
              1. Information We Collect
            </h3>
            
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-normal">
              <p>Crevings may collect the following categories of personal and usage-related information.</p>
              
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">1.1 Personal Information</h4>
                <p>During account registration, ordering, or use of our services, we may collect:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Full Name</li>
                  <li>Mobile Number</li>
                  <li>Email Address</li>
                  <li>Date of Birth</li>
                  <li>Gender</li>
                  <li>Delivery Address</li>
                  <li>Saved Locations</li>
                  <li>Profile Picture (if uploaded)</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-xs">1.2 Verification & Communication Information</h4>
                <p>Your mobile number and communication details may be used for OTP verification, login authentication, delivery coordination, order status updates, refund and payment communication, and customer support.</p>
                <p>Crevings may communicate with users through:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['SMS', 'WhatsApp', 'RCS Messaging', 'Push Notifications', 'Phone Calls', 'Email'].map((channel) => (
                    <span key={channel} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100 font-medium">{channel}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-xs">1.3 Payment & Transaction Information</h4>
                <p>We may collect and process order history, payment transaction details, refund records, invoice/receipt info, and payment method metadata.</p>
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-800 block mb-0.5">Important Notice</span>
                    <p className="text-amber-700 text-[11px] leading-relaxed">
                      Crevings does not directly store complete debit card numbers, credit card numbers, CVV information, or UPI PINs on its own servers. Payment processing may be handled by secure third-party payment service providers compliant with applicable laws and industry standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-xs">1.4 Preference & Behavioral Data</h4>
                <p>To improve platform performance and personalize user experience, Crevings may analyze:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Preferred cuisines & favorite restaurants</li>
                  <li>Order frequency & ordering behavior (daily, weekly, monthly, yearly)</li>
                  <li>Average order value & food preferences</li>
                  <li>Search activity & customer interaction patterns</li>
                  <li>Wishlist, saved items, ratings, and reviews</li>
                </ul>
                <p className="text-[11px] text-slate-500 italic mt-1 font-normal">
                  This information may be used to improve recommendations, platform discovery, user experience, operational efficiency, and promotional offerings.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Key className="w-4 h-4" />
              </div>
              2. Device Permissions We Request
            </h3>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-normal">
              <p>To provide our services effectively, Crevings may request certain device permissions:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100/50">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                    2.1 Location Access
                  </h4>
                  <p className="text-[11px] text-slate-500">Used for delivery detection, nearby restaurants, real-time tracking, and distance calculations. Collected while the app is actively used.</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100/50">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                    2.2 Microphone Access
                  </h4>
                  <p className="text-[11px] text-slate-500">Used for voice search and in-app support communication features. Activated only when initiated by the user.</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100/50">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                    2.3 Gallery / Storage Access
                  </h4>
                  <p className="text-[11px] text-slate-500">Used for uploading profile photos, review media, and support attachments. Unrelated personal files are never accessed.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100/50">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                    2.4 Push Notifications
                  </h4>
                  <p className="text-[11px] text-slate-500">Used for order updates, tracking, promotions, and account alerts. Users can disable these in device settings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Eye className="w-4 h-4" />
              </div>
              3. How We Use Your Information
            </h3>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-normal">
              <p className="mb-2">Crevings may use collected information for purposes including:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {[
                  'Account creation and authentication',
                  'Order processing and fulfillment',
                  'Delivery coordination',
                  'Customer support & issue resolution',
                  'Refund and payment processing',
                  'Fraud prevention and platform security',
                  'Personalized recommendations & discovery',
                  'Marketing and promotional communications',
                  'Analytics and service improvement',
                  'Platform optimization & monitoring',
                  'Compliance with legal obligations'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-emerald-50/30 text-slate-700 rounded-lg border border-emerald-100/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00bd6f] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Share2 className="w-4 h-4" />
              </div>
              4. Data Sharing & Third Parties
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-normal">
              <p className="font-semibold text-slate-800">Crevings does not sell personal information to third parties.</p>
              <p>We do not share personal information with external advertisers or unrelated third parties for commercial resale purposes. However, limited information may be shared where operationally necessary with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Delivery partners for order fulfillment</li>
                <li>Payment gateways for transaction processing</li>
                <li>Government agencies, regulators, or law enforcement authorities where legally required</li>
              </ul>
              
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 text-xs mb-2">Third-Party Service Providers</h4>
                <p className="mb-2">Crevings may engage trusted third-party service providers to support platform operations:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Payment Gateways', 'Cloud Hosting', 'Analytics & Monitoring', 
                    'Communication (SMS, Email, WhatsApp)', 'Customer Support', 
                    'Logistics & Delivery', 'Fraud Prevention & Security'
                  ].map((provider) => (
                    <span key={provider} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-150 text-[10px] font-medium">{provider}</span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic font-normal">
                  These providers are permitted to process information only as necessary to provide services to Crevings and are expected to maintain appropriate security measures.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Lock className="w-4 h-4" />
              </div>
              5. Data Security
            </h3>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-normal">
              <p>Crevings takes the security of user information seriously and implements reasonable technical, administrative, and organizational safeguards to protect personal information.</p>
              
              <div className="space-y-3">
                <div className="border-l-2 border-[#00bd6f] pl-3 space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Secure Cloud Infrastructure & Firewalls</h4>
                  <p className="text-[11px] text-slate-500">User data is stored within secure cloud environments protected by access controls, firewalls, and network security.</p>
                </div>
                
                <div className="border-l-2 border-[#00bd6f] pl-3 space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Data Flow Controls</h4>
                  <p className="text-[11px] text-slate-500">Utilizes authentication controls, rate limiting, and secure data transfer protocols to prevent unauthorized extraction.</p>
                </div>

                <div className="border-l-2 border-[#00bd6f] pl-3 space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Encryption & Secure Communication</h4>
                  <p className="text-[11px] text-slate-500">Data transmitted between users and Crevings is protected using industry-standard encryption protocols.</p>
                </div>

                <div className="border-l-2 border-[#00bd6f] pl-3 space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Backup & Recovery Systems</h4>
                  <p className="text-[11px] text-slate-500">Encrypted backups and redundancy mechanisms minimize risk of data loss from failures.</p>
                </div>

                <div className="border-l-2 border-[#00bd6f] pl-3 space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-xs">Access Management</h4>
                  <p className="text-[11px] text-slate-500">Access restricted to authorized personnel who require access for legitimate operational purposes.</p>
                </div>
              </div>

              <p className="text-slate-500 text-[11px] pt-1">
                While we continuously work to protect user info, no transmission method or cloud storage can be guaranteed 100% secure. Users remain responsible for maintaining the confidentiality of credentials and OTP access.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Clock className="w-4 h-4" />
              </div>
              6. Data Retention
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-normal">
              <p>Crevings retains personal info only for as long as necessary to fulfill operational, legal, regulatory, security, and business requirements.</p>
              
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold">
                      <th className="p-2.5">Data Category</th>
                      <th className="p-2.5">Typical Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 font-normal">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Account Information</td>
                      <td className="p-2.5">Until account deletion or account closure</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Order History</td>
                      <td className="p-2.5">Up to 8 years or as required by law</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Payment & Invoice Records</td>
                      <td className="p-2.5">As required under taxation and accounting laws</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Customer Support Records</td>
                      <td className="p-2.5">Up to 3 years</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Marketing Preferences</td>
                      <td className="p-2.5">Until consent withdrawal or account deletion</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Analytics & Usage Data</td>
                      <td className="p-2.5">Up to 24 months</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">Fraud Prevention & Security</td>
                      <td className="p-2.5">As reasonably necessary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <User className="w-4 h-4" />
              </div>
              7. User Rights & Account Deletion
            </h3>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-normal">
              <p>Users may request to access, update, or delete certain personal information, withdraw optional permissions, or opt out of marketing communications.</p>
              
              <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                <h4 className="font-bold text-slate-850 text-xs">How to Delete Your Account</h4>
                <p className="text-[11px] text-slate-500">
                  You can request permanent account deletion directly through the Crevings application by navigating to:
                </p>
                <div className="bg-white px-3 py-2 rounded-lg border border-slate-200/60 font-mono text-[10px] text-slate-700 inline-block font-semibold">
                  Profile → Account & Details → Request Account Deletion
                </div>
                
                <p className="text-[11px] text-slate-500">Upon initiating account deletion, you will have two options:</p>
                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block mb-0.5">Cancel</span>
                    <span>Retains the account and cancels deletion.</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-red-600 block mb-0.5">Delete Account</span>
                    <span>Schedules the account for deletion within 48 hours.</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Logging back into the account within the <strong>48-hour period</strong> automatically cancels the deletion request.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8, 9, 10, 11, 12 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <FileText className="w-4 h-4" />
              </div>
              8. General Terms & Disclosures
            </h3>
            
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-normal">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                  8. Cookies, Analytics & Tracking
                </h4>
                <p className="text-[11px] text-slate-500 pl-3">
                  Crevings may utilize cookies, SDKs, device identifiers, analytics tools, and similar technologies to improve platform functionality, analyze usage patterns, prevent fraud, and measure service performance.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                  9. Data Storage & Transfers
                </h4>
                <p className="text-[11px] text-slate-500 pl-3">
                  User information may be stored on secure cloud infrastructure operated by Crevings or authorized providers. Certain providers may process info outside your jurisdiction, using appropriate safeguards.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                  10. Legal Basis & Compliance
                </h4>
                <p className="text-[11px] text-slate-500 pl-3">
                  We process data for services, contract fulfillment, legal compliance (including the Digital Personal Data Protection Act, 2023 of India), security, and legitimate business interests.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                  11. Children&apos;s Privacy
                </h4>
                <p className="text-[11px] text-slate-500 pl-3">
                  Crevings services are not intended for individuals under the age of 18 years without the involvement, consent, or supervision of a parent or legal guardian.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00bd6f]" />
                  12. Policy Updates
                </h4>
                <p className="text-[11px] text-slate-500 pl-3">
                  Crevings reserves the right to modify, revise, or update this Privacy Policy at any time. Continued use of the platform constitutes acceptance of the revised policy.
                </p>
              </div>
            </div>
          </div>

          {/* Section 13 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2.5 text-sm pb-3 border-b border-slate-50">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-[#00bd6f]">
                <Phone className="w-4 h-4" />
              </div>
              13. Contact Information
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-normal">
              <p>For privacy-related concerns, support requests, account deletion issues, or data-related queries, please reach out to us:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <a 
                  href="mailto:support@crevings.com"
                  className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100 text-slate-700"
                >
                  <Mail className="w-4 h-4 text-[#00bd6f] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Email</span>
                    <span className="text-[11px] font-semibold truncate block">support@crevings.com</span>
                  </div>
                </a>

                <a 
                  href="https://wa.me/918678842995" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100 text-slate-700"
                >
                  <Phone className="w-4 h-4 text-[#00bd6f] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">WhatsApp</span>
                    <span className="text-[11px] font-semibold truncate block">+91-8678842995</span>
                  </div>
                </a>

                <a 
                  href="https://www.crevings.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100 text-slate-700"
                >
                  <Info className="w-4 h-4 text-[#00bd6f] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Website</span>
                    <span className="text-[11px] font-semibold truncate block">www.crevings.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
