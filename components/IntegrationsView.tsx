import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Plus, Blocks, CheckCircle2, Zap, Settings2,
  Lock, History, Wifi, ChevronRight, Activity, Terminal, ExternalLink,
  ShoppingBag, Truck, CreditCard, FileText, Database, Webhook,
  AlertCircle, ShieldCheck, ChevronLeft
} from 'lucide-react';

interface Integration {
  id: string;
  cat: string;
  title: string;
  desc: string;
  status: 'Connected' | 'Available' | 'Syncing' | 'Error';
  icon: React.ElementType;
  brand?: string;
  lastSync: string;
  uptime: string;
}

interface IntegrationsViewProps {
  onBack: () => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ onBack }) => {
  const [selectedNode, setSelectedNode] = useState<Integration | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'chan-1', cat: 'Delivery', title: 'Zomato', desc: 'Sync live menu and auto-accept orders directly from Zomato.', status: 'Connected', icon: ShoppingBag, brand: '#E23744', lastSync: '2m ago', uptime: '99.9%' },
    { id: 'chan-2', cat: 'Delivery', title: 'Swiggy', desc: 'Manage Swiggy stock and promotions from one dashboard.', status: 'Connected', icon: ShoppingBag, brand: '#FC8019', lastSync: '14m ago', uptime: '98.5%' },
    { id: 'pos-1', cat: 'POS', title: 'Petpooja', desc: 'Real-time billing & local inventory sync via Desktop agent.', status: 'Connected', icon: Database, lastSync: '1s ago', uptime: '100%' },
    { id: 'log-1', cat: 'Logistics', title: 'Dunzo', desc: 'Automated 3rd party delivery partner assignment & tracking.', status: 'Available', icon: Truck, lastSync: 'Never', uptime: '0%' },
    { id: 'pay-1', cat: 'Payments', title: 'Razorpay', desc: 'Instant payouts and vendor reconciliation hub.', status: 'Syncing', icon: CreditCard, lastSync: 'Now', uptime: '99.9%' },
    { id: 'erp-1', cat: 'Operations', title: 'Zoho Books', desc: 'Push sales data daily to your accounting platform.', status: 'Available', icon: FileText, lastSync: '24h ago', uptime: '95.0%' },
  ]);

  if (selectedNode) {
    return <IntegrationDetailView node={selectedNode} onBack={() => setSelectedNode(null)} />;
  }

  const filteredIntegrations = activeTab === 'All' ? integrations : integrations.filter(i => i.status === activeTab);

  return (
    <div className="min-h-screen bg-[#FFFFFF] animate-in slide-in-from-right duration-500 font-sans pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-slate-100 h-[60px] flex items-center px-4">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors mr-2">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[18px] font-bold text-slate-900">App Store</h1>
        <button className="w-9 h-9 ml-auto bg-slate-100 text-slate-700 rounded-full flex items-center justify-center active:scale-95 transition-transform">
           <Search size={18} />
        </button>
      </header>

      <div className="px-4 py-6">
        
        {/* Banner Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 relative overflow-hidden shadow-lg mb-6">
           <div className="absolute top-0 right-0 w-48 h-48 bg-[#1E90FF]/20 rounded-full blur-[40px] -mr-8 -mt-8"></div>
           <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md mb-4 border border-white/20">
                 <Blocks size={20} />
              </div>
              <h2 className="text-[20px] font-bold text-white mb-2 leading-tight">Supercharge your<br/>operations</h2>
              <p className="text-[13px] text-slate-300 font-medium leading-relaxed max-w-[85%]">
                 Connect with POS, delivery partners, and accounting tools in one click.
              </p>
           </div>
        </section>

        {/* Filters/Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4 sticky top-[60px] z-40 bg-slate-50 py-2">
           {['All', 'Connected', 'Available'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                 activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'bg-[#FFFFFF] border border-slate-200 text-slate-600 active:bg-slate-50'
               }`}
             >
               {tab} {tab === 'Connected' && `(${integrations.filter(i => i.status === 'Connected').length})`}
             </button>
           ))}
        </div>

        {/* Integration List */}
        <div className="space-y-3">
           {filteredIntegrations.map((item) => (
             <div 
               key={item.id}
               onClick={() => setSelectedNode(item)}
               className="bg-[#FFFFFF] rounded-[20px] p-4 border border-slate-100 flex items-center gap-4 hover:border-slate-300 transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
             >
                {/* Icon Wrapper */}
                <div className="w-14 h-14 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                   <item.icon size={26} className="text-slate-700" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[15px] font-bold text-slate-900 truncate">{item.title}</h3>
                      {item.status === 'Connected' && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      )}
                      {item.status === 'Syncing' && (
                        <div className="w-2 h-2 rounded-full bg-[#1E90FF] shadow-[0_0_8px_rgba(30,144,255,0.5)] animate-pulse"></div>
                      )}
                   </div>
                   <p className="text-[12px] font-medium text-slate-500 leading-tight line-clamp-2 pr-2">{item.desc}</p>
                </div>

                {/* Right Action */}
                <div className="shrink-0 flex items-center justify-center pl-2 border-l border-slate-100">
                   {item.status === 'Connected' || item.status === 'Syncing' ? (
                       <ChevronRight size={20} className="text-slate-300" />
                   ) : (
                       <button className="bg-slate-100/80 text-slate-700 px-3 py-1.5 rounded-full text-[12px] font-bold active:bg-slate-200 transition-colors">
                          Add
                       </button>
                   )}
                </div>
             </div>
           ))}
        </div>

        {/* Developer API Section */}
        <div className="mt-8 bg-[#EFF6FF] rounded-[24px] p-5 border border-[#BFDBFE] flex items-start gap-4">
           <div className="w-10 h-10 bg-[#FFFFFF] rounded-[14px] flex items-center justify-center text-[#1E90FF] shrink-0 shadow-sm border border-[#BFDBFE]/50">
              <Terminal size={20} />
           </div>
           <div>
              <h4 className="text-[15px] font-bold text-slate-900 mb-1">Developer API</h4>
              <p className="text-[12px] font-medium text-slate-600 mb-4 leading-relaxed">
                Connect custom logic or ERP systems using our authenticated REST endpoints.
              </p>
              <button className="text-[13px] font-bold text-[#FFFFFF] bg-[#1E90FF] px-4 py-2.5 rounded-xl active:scale-95 transition-transform flex items-center gap-1.5 shadow-md shadow-[#1E90FF]/25">
                 Generate Webhook
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const IntegrationDetailView: React.FC<{ node: Integration, onBack: () => void }> = ({ node, onBack }) => {
  const [activeTab, setActiveTab] = useState<'options' | 'logs' | 'auth'>('options');
  const [isLive, setIsLive] = useState(node.status === 'Connected' || node.status === 'Syncing');
  const [syncFreq, setSyncFreq] = useState('Real-time');

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFFFF] flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden font-sans">
       
       {/* Detail Hero Header */}
       <div className="bg-[#FFFFFF] border-b border-slate-100">
           {/* Top nav */}
           <div className="h-[60px] flex items-center justify-between px-4 sticky top-0 z-20 bg-[#FFFFFF]/90 backdrop-blur-md">
              <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 active:bg-slate-100 transition-colors -ml-2">
                 <ArrowLeft size={22} />
              </button>
              <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 active:bg-slate-100 transition-colors">
                    <ExternalLink size={20} />
                 </button>
              </div>
           </div>

           {/* App Info Banner */}
           <div className="px-5 pt-2 pb-6">
              <div className="flex items-start gap-4 mb-4">
                 <div className="w-20 h-20 rounded-[20px] bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
                    {node.brand && <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-[0.05]" style={{ backgroundColor: node.brand }}></div>}
                    <node.icon size={36} className="text-slate-800 relative z-10" />
                 </div>
                 <div className="pt-1">
                    <h2 className="text-[22px] font-bold text-slate-900 leading-tight mb-1">{node.title}</h2>
                    <p className="text-[13px] font-medium text-slate-500 mb-3">{node.cat} Integration</p>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border max-w-fit ${
                      isLive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                       {isLive ? 'Active Connection' : 'Not Connected'}
                    </div>
                 </div>
              </div>
              <p className="text-[13px] font-medium text-slate-600 leading-relaxed font-sans">
                 {node.desc} Complete two-way synchronization ensures you never miss an order or desync your inventory.
              </p>
           </div>

           {/* Tab Navigation */}
           <div className="flex overflow-x-auto no-scrollbar border-t border-slate-100">
               {[
                 { id: 'options', label: 'Settings' },
                 { id: 'auth', label: 'Credentials' },
                 { id: 'logs', label: 'Logs' },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 min-w-[100px] h-12 text-[13px] font-bold border-b-2 transition-all ${
                     activeTab === tab.id ? 'border-[#1E90FF] text-[#1E90FF]' : 'border-transparent text-slate-500 hover:bg-slate-50'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
           </div>
       </div>

       <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-24">
           
           {activeTab === 'options' && (
              <div className="animate-in fade-in duration-300 space-y-4">
                 {/* Connection Master Switch */}
                 <div className="bg-[#FFFFFF] rounded-[24px] p-5 flex items-center justify-between border border-slate-100 shadow-sm">
                    <div>
                       <h4 className="text-[15px] font-bold text-slate-900 leading-tight mb-1">Enable Integration</h4>
                       <p className="text-[12px] font-medium text-slate-500">Allow data transfer with this app</p>
                    </div>
                    <button 
                      onClick={() => setIsLive(!isLive)}
                      className={`w-12 h-7 rounded-full p-1 transition-all duration-300 shrink-0 ${isLive ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}
                    >
                       <div className={`w-5 h-5 bg-[#FFFFFF] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-300 ${isLive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 <div className="bg-[#FFFFFF] rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                       <h3 className="text-[13px] font-bold text-slate-900">Features</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                       {[
                         { label: 'Push Orders to POS', sub: 'Automatically inject remote orders' },
                         { label: 'Two-Way Menu Sync', sub: 'Update stock & prices in real-time' },
                         { label: 'Auto-Accept Orders', sub: 'Instantly confirm incoming tickets' },
                       ].map((opt, i) => (
                         <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                               <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">{opt.label}</h4>
                               <p className="text-[12px] font-medium text-slate-500">{opt.sub}</p>
                            </div>
                            <div className="w-5 h-5 rounded border border-[#1E90FF] bg-[#EFF6FF] flex items-center justify-center">
                               <div className="w-2.5 h-2.5 rounded-[1px] bg-[#1E90FF]"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-[#FFFFFF] rounded-[24px] border border-slate-100 overflow-hidden shadow-sm p-4">
                    <h3 className="text-[13px] font-bold text-slate-900 mb-3">Sync Frequency</h3>
                    <div className="grid grid-cols-3 gap-2">
                       {['Real-time', '5 mins', '15 mins'].map(freq => (
                         <button 
                           key={freq}
                           onClick={() => setSyncFreq(freq)}
                           className={`py-3 rounded-xl text-[12px] font-bold border transition-colors ${
                             syncFreq === freq ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E90FF]' : 'bg-[#FFFFFF] border-slate-200 text-slate-600 hover:bg-slate-50'
                           }`}
                         >
                           {freq}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'auth' && (
              <div className="animate-in fade-in duration-300 space-y-4">
                 <div className="bg-[#FFFFFF] rounded-[24px] border border-slate-100 shadow-sm p-5 space-y-5">
                    <div>
                       <h4 className="text-[15px] font-bold text-slate-900 mb-1">API Credentials</h4>
                       <p className="text-[12px] font-medium text-slate-500">Secure tokens provided to the platform</p>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-1">Merchant ID</label>
                          <div className="bg-slate-50 border border-slate-200 h-12 rounded-xl flex items-center justify-between px-4">
                             <span className="text-[13px] font-mono text-slate-800">CRT_7782_PROD</span>
                             <Lock size={14} className="text-slate-400" />
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-1">Secret Token</label>
                          <div className="bg-slate-50 border border-slate-200 h-12 rounded-xl flex items-center justify-between px-4">
                             <span className="text-[16px] font-mono text-slate-800 tracking-widest mt-1">••••••••••••</span>
                             <button className="h-7 px-3 bg-[#FFFFFF] border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 shadow-sm hover:bg-slate-100">
                               Reveal
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button className="w-full h-12 bg-rose-50 text-rose-600 rounded-[16px] text-[13px] font-bold border border-rose-100 active:bg-rose-100 transition-colors">
                    Revoke Connection
                 </button>
              </div>
           )}

           {activeTab === 'logs' && (
              <div className="animate-in fade-in duration-300">
                 <div className="bg-[#FFFFFF] rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                       <h3 className="text-[13px] font-bold text-slate-900">Activity History</h3>
                       <button className="text-[12px] font-bold text-[#1E90FF]">Refresh</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                       {[
                         { ev: 'Menu Sync Complete', time: '14:22', date: 'Today', res: 'Success' },
                         { ev: 'Push: Order #7712', time: '14:15', date: 'Today', res: 'Success' },
                         { ev: 'Inventory Error 401', time: '13:55', date: 'Today', res: 'Error' },
                         { ev: 'Auth Token Refresh', time: '11:30', date: 'Yesterday', res: 'Success' },
                       ].map((log, i) => (
                         <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                               <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${log.res === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                               <div>
                                  <p className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5">{log.ev}</p>
                                  <p className="text-[11px] font-medium text-slate-500">{log.date} at {log.time}</p>
                               </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}
       </div>

       {/* Floating Detail Action */}
       <div className="fixed bottom-0 inset-x-0 p-4 bg-[#FFFFFF]/90 backdrop-blur-xl border-t border-slate-100 z-[110]">
          <button 
            onClick={onBack}
            className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-bold text-[15px] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-sm"
          >
             Save Configuration
          </button>
       </div>
    </div>
  );
};