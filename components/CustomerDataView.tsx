import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  MessageCircle, 
  MessageSquare, 
  Tag, 
  X,
  User,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Award,
  Download
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  type: 'New' | 'Existing';
  source: 'Online Only' | 'Offline Only' | 'Both';
  totalOrders: number;
  revenue: number;
  lastOrderDate: string;
  tags: string[];
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.s@example.com',
    gender: 'Male',
    type: 'Existing',
    source: 'Both',
    totalOrders: 24,
    revenue: 12500,
    lastOrderDate: '12 Feb 2026',
    tags: ['High Spender', 'Frequent Buyer']
  },
  {
    id: 'CUST-002',
    name: 'Priya Patel',
    phone: '+91 9876543211',
    email: 'priya.p@example.com',
    gender: 'Female',
    type: 'Existing',
    source: 'Online Only',
    totalOrders: 2,
    revenue: 850,
    lastOrderDate: '15 Jan 2026',
    tags: ['Inactive 30 days']
  },
  {
    id: 'CUST-003',
    name: 'Amit Kumar',
    phone: '+91 9876543212',
    email: 'amit.k@example.com',
    gender: 'Male',
    type: 'New',
    source: 'Offline Only',
    totalOrders: 1,
    revenue: 450,
    lastOrderDate: '20 Mar 2026',
    tags: ['New']
  }
];

interface CustomerDataViewProps {
  onBack?: () => void;
}

export const CustomerDataView: React.FC<CustomerDataViewProps> = ({ onBack }) => {
  const [viewState, setViewState] = useState<'main' | 'filtered' | 'detail'>('main');
  const [selectedFilterTitle, setSelectedFilterTitle] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleInsightClick = (title: string) => {
    setSelectedFilterTitle(title);
    setViewState('filtered');
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewState('detail');
  };

  const handleDownloadExcel = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Gender', 'Type', 'Source', 'Total Orders', 'Revenue', 'Last Order Date', 'Tags'];
    
    const csvRows = MOCK_CUSTOMERS.map(c => {
      return [
        c.id,
        `"${c.name}"`,
        `"${c.phone}"`,
        `"${c.email}"`,
        c.gender,
        c.type,
        c.source,
        c.totalOrders,
        c.revenue,
        `"${c.lastOrderDate}"`,
        `"${c.tags.join(', ')}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'customers_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (viewState === 'filtered') {
    return (
      <FilteredCustomerList 
        title={selectedFilterTitle} 
        onBack={() => setViewState('main')} 
        onCustomerClick={handleCustomerClick}
      />
    );
  }

  if (viewState === 'detail' && selectedCustomer) {
    return (
      <CustomerDetail 
        customer={selectedCustomer} 
        onBack={() => setViewState('main')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20 font-sans">
      {/* Header */}
      <header className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Customers info</h1>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleDownloadExcel}
            className="w-10 h-10 flex items-center justify-center text-emerald-600 active:scale-95 transition-transform"
            title="Download Excel (CSV)"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 flex items-center justify-center -mr-2 text-blue-600 active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-6 lg:p-8 lg:max-w-7xl lg:mx-auto">
        {/* Top Insight Cards */}
        <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 gap-3 snap-x lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5">
          {[
            { label: 'New Customers', value: '240', color: 'text-blue-600' },
            { label: 'Repeat Customers', value: '560', color: 'text-emerald-600' },
            { label: 'Inactive Customers', value: '1,000', color: 'text-amber-600' },
            { label: 'High Value Customers', value: '120', color: 'text-purple-600' },
            { label: 'Lost Customers (30+ days)', value: '320', color: 'text-rose-600' }
          ].map((card, idx) => (
            <button 
              key={idx}
              onClick={() => handleInsightClick(card.label)}
              className="snap-start shrink-0 w-[150px] h-[80px] bg-[#FFFFFF] rounded-[16px] border border-[#E5E7EB] p-3 flex flex-col justify-center text-left active:scale-95 transition-transform shadow-sm"
            >
              <span className={`text-2xl font-black ${card.color} leading-none mb-1`}>{card.value}</span>
              <span className="text-[11px] font-semibold text-slate-500 leading-tight">{card.label}</span>
            </button>
          ))}
        </div>

        {/* Smart Insights & Automation Grid */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 space-y-6">
          <div className="space-y-6">
            {/* Smart Insights Banner */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-[16px] p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="text-xl mt-0.5">🔥</div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">320 customers haven't ordered in 30 days</h3>
                  <p className="text-xs text-slate-600 mt-1 mb-3">Send them an offer to increase repeat orders</p>
                  <button className="h-[36px] px-4 bg-rose-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-sm">
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>

            {/* Revenue Insights */}
            <div className="bg-slate-900 rounded-[16px] p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Revenue Insight</p>
                  <p className="text-sm font-bold text-white">Top 20% customers contribute 65% revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Automation Suggestions */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Automation Suggestions</h2>
            <div className="space-y-3">
              <div className="bg-[#FFFFFF] border border-slate-200 rounded-[16px] p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-lg mt-0.5">⚡</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Offer 10% discount to inactive customers</p>
                  </div>
                </div>
                <button className="h-[32px] px-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold active:scale-95 transition-transform whitespace-nowrap ml-2">
                  Create
                </button>
              </div>
              <div className="bg-[#FFFFFF] border border-slate-200 rounded-[16px] p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-lg mt-0.5">🔥</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Promote combo to high spenders</p>
                  </div>
                </div>
                <button className="h-[32px] px-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold active:scale-95 transition-transform whitespace-nowrap ml-2">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">All Customers</h2>
            <button className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600">
              <Search size={16} />
            </button>
          </div>
          
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {MOCK_CUSTOMERS.map((customer) => (
              <div 
                key={customer.id}
                onClick={() => handleCustomerClick(customer)}
                className="bg-[#FFFFFF] border border-slate-200 rounded-[16px] p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{customer.name}</h3>
                    <p className="text-sm text-slate-600">{customer.phone}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
                
                <div className="text-xs text-slate-500 mb-2">
                  {customer.email} • {customer.gender}
                </div>
                
                <div className="text-xs font-medium text-slate-700 mb-3 bg-slate-50 inline-block px-2 py-1 rounded-md border border-slate-100">
                  {customer.type} • {customer.source}
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{customer.totalOrders} Orders • ₹{customer.revenue.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Last Order: {customer.lastOrderDate}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {customer.tags.map((tag, i) => (
                      <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tag === 'High Spender' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                        tag === 'Inactive 30 days' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        tag === 'New' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

// --- Sub Components ---

const FilteredCustomerList: React.FC<{ title: string, onBack: () => void, onCustomerClick: (c: Customer) => void }> = ({ title, onBack, onCustomerClick }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === MOCK_CUSTOMERS.length) {
      setSelectedIds(newSet => new Set());
    } else {
      setSelectedIds(new Set(MOCK_CUSTOMERS.map(c => c.id)));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32 font-sans relative">
      <header className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">{title}</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center -mr-2 text-slate-700 active:scale-95 transition-transform">
          <Filter size={20} />
        </button>
      </header>

      {/* Filters Bar */}
      <div className="bg-[#FFFFFF] border-b border-slate-100 px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar sticky top-[56px] z-10">
        {['Customer Type', 'Order Source', 'Gender', 'Last Order Date'].map((filter, i) => (
          <button key={i} className="h-[32px] px-3 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap flex items-center gap-1">
            {filter} <ChevronDown size={14} />
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-600">{MOCK_CUSTOMERS.length} Customers</p>
          <button onClick={selectAll} className="text-sm font-bold text-blue-600">
            {selectedIds.size === MOCK_CUSTOMERS.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {MOCK_CUSTOMERS.map((customer) => (
            <div 
              key={customer.id}
              onClick={() => onCustomerClick(customer)}
              className={`bg-[#FFFFFF] border rounded-[16px] p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative ${selectedIds.has(customer.id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}
            >
              <div 
                onClick={(e) => toggleSelect(customer.id, e)}
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.has(customer.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}
              >
                {selectedIds.has(customer.id) && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>

              <div className="pr-8">
                <h3 className="font-bold text-slate-900">{customer.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{customer.phone}</p>
                
                <div className="text-xs text-slate-500 mb-2">
                  {customer.email} • {customer.gender}
                </div>
                
                <div className="text-xs font-medium text-slate-700 mb-3 bg-slate-50 inline-block px-2 py-1 rounded-md border border-slate-100">
                  {customer.type} • {customer.source}
                </div>
                
                <p className="text-sm font-bold text-slate-900">{customer.totalOrders} Orders • ₹{customer.revenue.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Last Order: {customer.lastOrderDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bottom Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-slate-200 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 animate-in slide-in-from-bottom-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-900">{selectedIds.size} Selected</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 h-[44px] bg-blue-50 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-100">
              <Tag size={16} /> Send Offer
            </button>
            <button className="flex-1 h-[44px] bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-100">
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button className="flex-1 h-[44px] bg-amber-50 text-amber-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-100">
              <MessageSquare size={16} /> SMS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerDetail: React.FC<{ customer: Customer, onBack: () => void }> = ({ customer, onBack }) => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20 font-sans">
      <header className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center px-4 sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Customer Profile</h1>
      </header>

      <div className="p-4 space-y-4 lg:p-8 lg:max-w-3xl lg:mx-auto">
        {/* Profile Card */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-6 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3">
            {customer.name.charAt(0)}
          </div>
          <h2 className="text-xl font-black text-slate-900">{customer.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{customer.phone}</p>
          <p className="text-sm text-slate-500">{customer.email}</p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {customer.tags.map((tag, i) => (
              <span key={i} className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <ShoppingBag size={16} className="text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Orders</p>
            <p className="text-xl font-black text-slate-900">{customer.totalOrders}</p>
          </div>
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Spend</p>
            <p className="text-xl font-black text-slate-900">₹{customer.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-2">
              <Award size={16} className="text-amber-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Avg Order Value</p>
            <p className="text-xl font-black text-slate-900">₹{Math.round(customer.revenue / customer.totalOrders)}</p>
          </div>
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mb-2">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Last Order</p>
            <p className="text-sm font-black text-slate-900 mt-1">{customer.lastOrderDate}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="h-[48px] bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button className="h-[48px] bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
            <Tag size={18} /> Send Offer
          </button>
        </div>

        {/* Order History (Mock) */}
        <div className="pt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Orders</h3>
          <div className="bg-[#FFFFFF] border border-slate-100 rounded-[16px] overflow-hidden shadow-sm">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className={`p-4 flex justify-between items-center ${i !== 2 ? 'border-b border-slate-100' : ''}`}>
                <div>
                  <p className="font-bold text-slate-900">ORD-10{i}4</p>
                  <p className="text-xs text-slate-500 mt-0.5">{customer.lastOrderDate} • Delivery</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{Math.round(customer.revenue / customer.totalOrders)}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddCustomerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    type: 'New'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // Save logic here
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] sm:rounded-[24px] overflow-hidden animate-in slide-in-from-bottom-8">
        <div className="h-[56px] border-b border-slate-100 flex items-center justify-between px-4">
          <h2 className="text-lg font-bold text-slate-900">Add Customer</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-95">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Customer Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                className={`w-full h-[48px] pl-10 pr-4 bg-slate-50 border ${errors.name ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-colors`}
              />
            </div>
            {errors.name && <p className="text-[10px] text-rose-500 mt-1 ml-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-slate-400" />
              </div>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                placeholder="10 digit mobile number"
                className={`w-full h-[48px] pl-10 pr-4 bg-slate-50 border ${errors.phone ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-colors`}
              />
            </div>
            {errors.phone && <p className="text-[10px] text-rose-500 mt-1 ml-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email ID (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="customer@email.com"
                className={`w-full h-[48px] pl-10 pr-4 bg-slate-50 border ${errors.email ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-colors`}
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-500 mt-1 ml-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full h-[48px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-colors appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Customer Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full h-[48px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-colors appearance-none"
              >
                <option value="New">New</option>
                <option value="Existing">Existing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 h-[48px] bg-slate-100 text-slate-700 rounded-xl font-bold text-sm active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 h-[48px] bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform shadow-sm"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ChevronDown: React.FC<{size?: number, className?: string}> = ({size=24, className=""}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const Check: React.FC<{size?: number, className?: string, strokeWidth?: number}> = ({size=24, className="", strokeWidth=2}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
);
