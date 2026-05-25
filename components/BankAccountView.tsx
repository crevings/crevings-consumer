import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Plus, ShieldCheck, X } from 'lucide-react';

interface BankAccountViewProps {
  onBack: () => void;
}

interface BankAccount {
  id: number;
  bankName: string;
  holderName: string;
  accountNumber: string;
  ifscCode: string;
  isPrimary: boolean;
}

export const BankAccountView: React.FC<BankAccountViewProps> = ({ onBack }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: 1, bankName: 'HDFC Bank', holderName: 'Amit Sharma', accountNumber: '123456784821', ifscCode: 'HDFC0001234', isPrimary: true },
    { id: 2, bankName: 'ICICI Bank', holderName: 'Amit Sharma', accountNumber: '987654329012', ifscCode: 'ICIC0009876', isPrimary: false }
  ]);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    bankName: '',
    holderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ bankName: '', holderName: '', accountNumber: '', confirmAccountNumber: '', ifscCode: '' });
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (account: BankAccount) => {
    setEditingId(account.id);
    setFormData({
      bankName: account.bankName,
      holderName: account.holderName,
      accountNumber: account.accountNumber,
      confirmAccountNumber: account.accountNumber,
      ifscCode: account.ifscCode
    });
    setErrors({});
    setActiveMenuId(null);
    setShowAddModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setShowDeleteConfirm(id);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm !== null) {
      setAccounts(accounts.filter(a => a.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
    }
  };

  const handleSetPrimary = (id: number) => {
    setAccounts(accounts.map(a => ({ ...a, isPrimary: a.id === id })));
    setActiveMenuId(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank Name is required';
    if (!formData.holderName.trim()) newErrors.holderName = 'Account Holder Name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    if (!formData.confirmAccountNumber.trim()) newErrors.confirmAccountNumber = 'Please re-enter account number';
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC Code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC Code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (editingId !== null) {
        setAccounts(accounts.map(a => a.id === editingId ? {
          ...a,
          bankName: formData.bankName,
          holderName: formData.holderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase()
        } : a));
      } else {
        setAccounts([...accounts, {
          id: Date.now(),
          bankName: formData.bankName,
          holderName: formData.holderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase(),
          isPrimary: accounts.length === 0
        }]);
      }
      setShowAddModal(false);
    }
  };

  const maskAccountNumber = (accNum: string) => {
    if (accNum.length <= 4) return accNum;
    return `**** **** ${accNum.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Bank Accounts</h1>
        </div>
        <button onClick={handleOpenAdd} className="w-10 h-10 flex items-center justify-center -mr-2 text-[#1E90FF] active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {/* Security Indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <p className="text-[12px] font-medium text-slate-500">Your bank details are securely stored and encrypted</p>
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900">{account.bankName}</h3>
                  {account.isPrimary && (
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold uppercase tracking-wide">
                      Primary Account
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === account.id ? null : account.id)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 active:bg-slate-50 rounded-full -mr-2 -mt-2"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[12px] text-slate-500 font-medium mb-0.5">Account Holder Name</p>
                  <p className="text-[15px] font-semibold text-slate-900">{account.holderName}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-500 font-medium mb-0.5">Account Number</p>
                  <p className="text-[16px] font-mono font-semibold text-slate-900 tracking-wider">{maskAccountNumber(account.accountNumber)}</p>
                </div>
              </div>

              {/* 3-Dot Menu Dropdown */}
              {activeMenuId === account.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                  <div className="absolute right-4 top-12 w-48 bg-[#FFFFFF] rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => handleOpenEdit(account)} className="w-full px-4 py-3 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-50">
                      Edit
                    </button>
                    {!account.isPrimary && (
                      <button onClick={() => handleSetPrimary(account.id)} className="w-full px-4 py-3 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-50">
                        Set as Primary
                      </button>
                    )}
                    <button onClick={() => handleDeleteClick(account.id)} className="w-full px-4 py-3 text-left text-[14px] font-medium text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Bank Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[24px] p-4 pb-8 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#FFFFFF] z-10 py-2">
              <h2 className="text-[18px] font-bold text-slate-900">{editingId ? 'Edit Bank Account' : 'Add Bank Account'}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Bank Name</label>
                <input 
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  className={`w-full h-[48px] px-3 bg-[#FFFFFF] border ${errors.bankName ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[12px] text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] transition-colors`}
                  placeholder="e.g. HDFC Bank"
                />
                {errors.bankName && <p className="text-red-500 text-[12px] mt-1">{errors.bankName}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Account Holder Name</label>
                <input 
                  type="text"
                  value={formData.holderName}
                  onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                  className={`w-full h-[48px] px-3 bg-[#FFFFFF] border ${errors.holderName ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[12px] text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] transition-colors`}
                  placeholder="e.g. Amit Sharma"
                />
                {errors.holderName && <p className="text-red-500 text-[12px] mt-1">{errors.holderName}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Account Number</label>
                <input 
                  type="password"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className={`w-full h-[48px] px-3 bg-[#FFFFFF] border ${errors.accountNumber ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[12px] text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] transition-colors`}
                  placeholder="Enter account number"
                />
                {errors.accountNumber && <p className="text-red-500 text-[12px] mt-1">{errors.accountNumber}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Re-enter Account Number</label>
                <input 
                  type="text"
                  value={formData.confirmAccountNumber}
                  onChange={(e) => setFormData({...formData, confirmAccountNumber: e.target.value})}
                  className={`w-full h-[48px] px-3 bg-[#FFFFFF] border ${errors.confirmAccountNumber ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[12px] text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] transition-colors`}
                  placeholder="Re-enter account number"
                />
                {errors.confirmAccountNumber && <p className="text-red-500 text-[12px] mt-1">{errors.confirmAccountNumber}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">IFSC Code</label>
                <input 
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                  className={`w-full h-[48px] px-3 bg-[#FFFFFF] border ${errors.ifscCode ? 'border-red-500' : 'border-[#E5E7EB]'} rounded-[12px] text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] transition-colors uppercase`}
                  placeholder="e.g. HDFC0001234"
                />
                {errors.ifscCode && <p className="text-red-500 text-[12px] mt-1">{errors.ifscCode}</p>}
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSave}
                  className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[14px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shadow-sm"
                >
                  Save Bank Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[20px] p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-bold text-slate-900 mb-2">Delete Bank Account</h3>
            <p className="text-[15px] text-slate-600 mb-6">Are you sure you want to delete this bank account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 h-[48px] bg-slate-100 text-slate-700 rounded-xl font-semibold text-[15px] active:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 h-[48px] bg-red-600 text-white rounded-xl font-semibold text-[15px] active:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
