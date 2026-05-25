import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, MoreVertical, Edit2, Trash2, X, Check, Search, Mic, SlidersHorizontal, User, Shield, Store, Loader2, CheckCircle2 } from 'lucide-react';
import { VoiceSearchModal } from './VoiceSearchModal';

interface StaffManagementViewProps {
  onBack: () => void;
  isEmbedded?: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  outlet: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  permissions: Record<string, boolean>;
}

const initialStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Amit Kumar',
    role: 'Manager',
    outlet: 'All Outlets',
    phone: '9876543210',
    email: 'amit@example.com',
    status: 'Active',
    permissions: {
      orders: true,
      menu: true,
      table: true,
      payout: true,
      customer: true,
      reports: true,
      settings: true
    }
  },
  {
    id: '2',
    name: 'Priya Singh',
    role: 'Cashier',
    outlet: 'Gourmet Kitchen',
    phone: '8765432109',
    email: 'priya@example.com',
    status: 'Active',
    permissions: {
      orders: true,
      menu: false,
      table: true,
      payout: false,
      customer: false,
      reports: false,
      settings: false
    }
  }
];

const PERMISSIONS_LIST = [
  { id: 'orders', label: 'Orders Access' },
  { id: 'menu', label: 'Menu Management' },
  { id: 'table', label: 'Table Management' },
  { id: 'payout', label: 'Payout & Finance Access' },
  { id: 'customer', label: 'Customer Data Access' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'settings', label: 'Settings Access' }
];

const OUTLETS = ['All Outlets', 'Gourmet Kitchen', 'Gourmet Kitchen Express'];

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({ onBack, isEmbedded }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  
  const [roles, setRoles] = useState(['All', 'Manager', 'Cashier', 'Kitchen Staff', 'Delivery Coordinator', 'Custom Role']);
  const [activeRoleFilter, setActiveRoleFilter] = useState('All');

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          staff.phone.includes(searchQuery) ||
                          staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRoleFilter === 'All' || staff.role === activeRoleFilter;
    return matchesSearch && matchesRole;
  });

  // State for Add Role Bottom Sheet
  const [showAddRoleSheet, setShowAddRoleSheet] = useState(false);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    permissions: PERMISSIONS_LIST.reduce((acc, p) => ({ ...acc, [p.id]: false }), {} as Record<string, boolean>)
  });

  // Flow State for Staff Add/Edit Modal
  const [showStaffSheet, setShowStaffSheet] = useState(false);
  const [staffFlowState, setStaffFlowState] = useState<'form' | 'confirm_save' | 'confirm_cancel' | 'processing' | 'success'>('form');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Cashier',
    outlet: 'All Outlets',
    status: 'Active' as 'Active' | 'Inactive',
    permissions: PERMISSIONS_LIST.reduce((acc, p) => ({ ...acc, [p.id]: false }), {} as Record<string, boolean>)
  });
  const [fullAccess, setFullAccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenStaffSheet = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name,
        phone: staff.phone,
        email: staff.email,
        role: staff.role,
        outlet: staff.outlet || 'All Outlets',
        status: staff.status,
        permissions: { ...staff.permissions }
      });
      const hasAllPerms = Object.values(staff.permissions).every(v => v);
      setFullAccess(hasAllPerms && staff.role === 'Manager');
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        role: 'Cashier',
        outlet: 'All Outlets',
        status: 'Active',
        permissions: PERMISSIONS_LIST.reduce((acc, p) => ({ ...acc, [p.id]: false }), {})
      });
      setFullAccess(false);
    }
    setErrors({});
    setStaffFlowState('form');
    setShowStaffSheet(true);
    setActiveMenuId(null);
  };

  const handleCloseStaffSheet = () => {
    setShowStaffSheet(false);
    setTimeout(() => {
      setStaffFlowState('form');
      setEditingStaff(null);
    }, 300);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (!validateForm()) return;
    setStaffFlowState('confirm_save');
  };

  const executeSave = () => {
    setStaffFlowState('processing');
    setTimeout(() => {
      // Perform the save
      if (editingStaff) {
        setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
      } else {
        setStaffList(prev => [...prev, { id: Date.now().toString(), ...formData }]);
      }
      setStaffFlowState('success');
      setTimeout(() => {
        handleCloseStaffSheet();
      }, 2000);
    }, 1500);
  };

  const handleRoleSave = () => {
    if (roleFormData.name.trim() && !roles.includes(roleFormData.name.trim())) {
      setRoles(prev => [...prev, roleFormData.name.trim()]);
    }
    setShowAddRoleSheet(false);
    setRoleFormData({ name: '', permissions: PERMISSIONS_LIST.reduce((acc, p) => ({ ...acc, [p.id]: false }), {}) });
  };

  const handleDelete = (id: string) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    if (role !== 'Manager') {
      setFullAccess(false);
    }
  };

  const handleFullAccessToggle = () => {
    const newValue = !fullAccess;
    setFullAccess(newValue);
    if (newValue) {
      const allPerms = PERMISSIONS_LIST.reduce((acc, p) => ({ ...acc, [p.id]: true }), {});
      setFormData(prev => ({ ...prev, permissions: allPerms }));
    }
  };

  const handlePermissionToggle = (permId: string) => {
    setFormData(prev => {
      const newPerms = { ...prev.permissions, [permId]: !prev.permissions[permId] };
      if (prev.role === 'Manager') {
        const hasAllPerms = Object.values(newPerms).every(v => v);
        setFullAccess(hasAllPerms);
      }
      return { ...prev, permissions: newPerms };
    });
  };

  const handleRolePermissionToggle = (permId: string) => {
    setRoleFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permId]: !prev.permissions[permId]
      }
    }));
  };

  const Wrapper = isEmbedded ? 'div' : 'div';
  const wrapperClass = isEmbedded ? "flex-1 flex flex-col h-full bg-[#FFFFFF] font-sans animate-in fade-in duration-300" : "min-h-screen bg-[#FFFFFF] font-sans animate-in fade-in duration-300 pb-20";

  return (
    <Wrapper className={wrapperClass}>
      {/* Header */}
      {!isEmbedded && (
        <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-[18px] font-semibold text-slate-900">Staff Management</h1>
          </div>
        </header>
      )}

      <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 flex-1 overflow-y-auto w-full">
        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <div className="text-amber-600 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-800">Notice</h4>
            <p className="text-sm text-amber-700 mt-1">
              Add staff feature is not working for test user you can add user but the user is not able to login the app.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
          <input 
            type="text" 
            placeholder="Search staff by name, phone, or email" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-blue-500 text-[15px] font-medium transition-all shadow-sm"
          />
          <Mic 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E90FF] cursor-pointer" 
            size={20} 
            onClick={() => setShowVoiceSearch(true)}
          />
        </div>

        {/* Roles Filter Chips */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar pb-2 mb-2 lg:flex-wrap text-[14px]">
          <button 
            onClick={() => setShowAddRoleSheet(true)}
            className="h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans border border-dashed border-[#1E90FF] text-[#1E90FF] bg-blue-50/50 hover:bg-blue-50"
          >
            <Plus size={16} strokeWidth={2.5} /> Add Staff Role
          </button>
          
          {roles.map(role => (
            <button 
              key={`role-${role}`}
              onClick={() => setActiveRoleFilter(role)}
              className={`h-[36px] px-[14px] rounded-[18px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                activeRoleFilter === role 
                  ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Staff List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {/* Add Staff Card */}
          <button 
            onClick={() => handleOpenStaffSheet()}
            className="w-full bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[16px] p-4 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-colors text-center min-h-[160px]"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Plus size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-blue-700">Add New Staff</h3>
              <p className="text-[12px] text-blue-600/80 mt-0.5">Click here to add</p>
            </div>
          </button>

          {filteredStaff.map(staff => (
            <div key={staff.id} className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm relative flex flex-col items-center gap-3 text-center min-h-[160px]">
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === staff.id ? null : staff.id)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {/* 3-dot Menu Dropdown */}
                {activeMenuId === staff.id && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenuId(null)} />
                    <div className="absolute top-8 right-0 bg-[#FFFFFF] border border-slate-100 shadow-lg rounded-xl w-36 py-1 z-[110] animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={() => {
                          handleOpenStaffSheet(staff);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit2 size={16} /> Edit Profile
                      </button>
                      <button 
                        onClick={() => {
                          setDeleteConfirmId(staff.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-2 border border-blue-100">
                <User size={28} className="text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <h3 className="text-[15px] font-bold text-slate-900 truncate">{staff.name}</h3>
                <p className="text-[13px] font-medium text-[#1E90FF] mb-1">{staff.role}</p>
                <div className="flex flex-col items-center justify-center gap-1.5 text-[11px] text-slate-500 mb-2">
                  <span className="truncate">{staff.phone}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    <Store size={10} /> {staff.outlet}
                  </span>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {staff.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VoiceSearchModal 
        isOpen={showVoiceSearch} 
        onClose={() => setShowVoiceSearch(false)} 
        onResult={(text) => setSearchQuery(text)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Staff</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to remove this staff member? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 h-12 rounded-xl font-medium text-slate-700 bg-slate-100 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 h-12 rounded-xl font-medium text-white bg-rose-600 active:scale-95 transition-transform"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Role Bottom Sheet */}
      {showAddRoleSheet && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[24px] w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <header className="h-[60px] border-b border-slate-100 flex items-center justify-between px-5 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-900">Add Staff Role</h2>
              <button onClick={() => setShowAddRoleSheet(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-transform">
                <X size={18} />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Name</label>
                <input 
                  type="text" 
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:bg-[#FFFFFF] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Floor Manager"
                />
              </div>

              <div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-1">Page Access</h3>
                <p className="text-[13px] text-slate-500 mb-4">Select the sections this role can access.</p>
                <div className="space-y-1 bg-slate-50 rounded-xl border border-slate-100 p-2">
                  {PERMISSIONS_LIST.map(perm => (
                    <div key={perm.id} className="flex items-center justify-between py-3 px-2 border-b border-slate-100/60 last:border-0">
                      <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                         <Shield size={16} className="text-slate-400" />
                         {perm.label}
                      </span>
                      <button 
                        onClick={() => handleRolePermissionToggle(perm.id)}
                        className={`relative w-11 h-6 rounded-full p-1 transition-colors outline-none ${roleFormData.permissions[perm.id] ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform ${roleFormData.permissions[perm.id] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] pb-safe">
              <button 
                onClick={handleRoleSave}
                disabled={!roleFormData.name.trim()}
                className="w-full h-[52px] rounded-[16px] font-bold text-[16px] text-white bg-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Staff Bottom Sheet Multi-Step Flow */}
      {showStaffSheet && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[24px] w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-full duration-300 overflow-hidden relative">
            
            {staffFlowState === 'form' && (
              <>
                <header className="h-[60px] border-b border-slate-100 flex items-center justify-between px-5 shrink-0">
                  <h2 className="text-[18px] font-bold text-slate-900">{editingStaff ? 'Edit Staff Details' : 'Add New Staff'}</h2>
                  <button onClick={() => setStaffFlowState('confirm_cancel')} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-transform">
                    <X size={18} />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* Form Component exactly like before but with Outlet select */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full h-12 px-4 rounded-xl border ${errors.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'} focus:bg-[#FFFFFF] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="e.g. Rahul Sharma"
                      />
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
                        <input 
                          type="tel" 
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                          className={`w-full h-12 pl-12 pr-4 rounded-xl border ${errors.phone ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'} focus:bg-[#FFFFFF] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full h-12 px-4 rounded-xl border ${errors.email ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'} focus:bg-[#FFFFFF] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                        placeholder="rahul@example.com"
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Outlet Affiliation</label>
                      <select 
                        value={formData.outlet}
                        onChange={(e) => setFormData({...formData, outlet: e.target.value})}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-[#FFFFFF] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        {OUTLETS.map(outlet => <option key={outlet} value={outlet}>{outlet}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                      <select 
                        value={formData.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-[#FFFFFF] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        {roles.filter(r => r !== 'All').map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setFormData({...formData, status: 'Active'})}
                          className={`flex-1 h-12 rounded-[14px] font-[600] border transition-all ${formData.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}
                        >
                          Active
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, status: 'Inactive'})}
                          className={`flex-1 h-12 rounded-[14px] font-[600] border transition-all ${formData.status === 'Inactive' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}
                        >
                          Inactive
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Permissions Section */}
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-900 mb-4">Permissions</h3>
                    
                    {formData.role === 'Manager' && (
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-blue-900">Full Access</p>
                          <p className="text-xs text-blue-700 mt-0.5">Enable all permissions automatically</p>
                        </div>
                        <button 
                          onClick={handleFullAccessToggle}
                          className={`relative w-12 h-6 rounded-full p-1 transition-colors outline-none ${fullAccess ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform ${fullAccess ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    )}

                    <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-2">
                      {PERMISSIONS_LIST.map(perm => (
                        <div key={perm.id} className="flex items-center justify-between py-3 px-2 border-b border-slate-100/60 last:border-0">
                          <span className="text-[14px] text-slate-700 font-medium">{perm.label}</span>
                          <button 
                            onClick={() => handlePermissionToggle(perm.id)}
                            className={`relative w-11 h-6 rounded-full p-1 transition-colors outline-none ${formData.permissions[perm.id] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform ${formData.permissions[perm.id] ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] flex gap-3 pb-safe">
                  <button 
                    onClick={() => setStaffFlowState('confirm_cancel')}
                    className="flex-1 h-[52px] rounded-[16px] font-bold text-slate-700 bg-slate-100 active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveClick}
                    className="flex-1 h-[52px] rounded-[16px] font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {/* Save Confirmation Screen */}
            {staffFlowState === 'confirm_save' && (
              <div className="p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-200 py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                   <User size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Staff Details</h3>
                <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
                  Are you sure you want to {editingStaff ? 'update' : 'add'} this staff member with the designated permissions and outlet?
                </p>
                <div className="w-full flex gap-3">
                  <button 
                    onClick={() => setStaffFlowState('form')}
                    className="flex-1 h-[52px] rounded-[16px] font-bold text-slate-700 bg-slate-100 active:scale-95 transition-transform"
                  >
                     Back
                  </button>
                  <button 
                    onClick={executeSave}
                    className="flex-1 h-[52px] rounded-[16px] font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-transform"
                  >
                    Yes, Save
                  </button>
                </div>
              </div>
            )}

            {/* Cancel Confirmation Screen */}
            {staffFlowState === 'confirm_cancel' && (
              <div className="p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-200 py-12">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                   <Trash2 size={32} className="text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Discard Changes?</h3>
                <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
                  You have unsaved changes. Are you sure you want to discard them?
                </p>
                <div className="w-full flex gap-3">
                  <button 
                    onClick={() => setStaffFlowState('form')}
                    className="flex-1 h-[52px] rounded-[16px] font-bold text-slate-700 bg-slate-100 active:scale-95 transition-transform"
                  >
                     Go Back
                  </button>
                  <button 
                    onClick={handleCloseStaffSheet}
                    className="flex-1 h-[52px] rounded-[16px] font-bold text-white bg-rose-600 active:scale-[0.98] transition-transform"
                  >
                    Yes, Discard
                  </button>
                </div>
              </div>
            )}

            {/* Processing Screen */}
            {staffFlowState === 'processing' && (
              <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-200 py-16">
                <Loader2 size={48} className="text-blue-600 animate-spin mb-6" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Processing Data...</h3>
                <p className="text-sm text-slate-500">Please wait while we securely save the staff details on the server.</p>
              </div>
            )}

            {/* Success Screen */}
            {staffFlowState === 'success' && (
              <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300 py-16">
                <div className="w-20 h-20 bg-emerald-50 border-[6px] border-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Successfully Saved!</h3>
                <p className="text-[15px] text-slate-500 font-medium">The staff details have been recorded safely.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </Wrapper>
  );
};
