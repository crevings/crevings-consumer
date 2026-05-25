import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, AlertCircle, CheckCircle2, MoreVertical, Edit2, Trash2, Package, AlertTriangle, X, Download, History, FileText, Mic } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lowStockThreshold: number;
  costPerUnit: number;
}

interface InventoryLog {
  id: string;
  itemId: string;
  itemName: string;
  action: 'ADD' | 'REMOVE' | 'WASTAGE';
  amount: number;
  unit: string;
  date: string;
  remarks: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Pizza Dough', category: 'Raw Material', stock: 15, unit: 'kg', lowStockThreshold: 20, costPerUnit: 120 },
  { id: 'INV-002', name: 'Mozzarella Cheese', category: 'Dairy', stock: 8, unit: 'kg', lowStockThreshold: 10, costPerUnit: 450 },
  { id: 'INV-003', name: 'Tomato Sauce', category: 'Sauces', stock: 25, unit: 'liters', lowStockThreshold: 15, costPerUnit: 80 },
  { id: 'INV-004', name: 'Chicken Breast', category: 'Meat', stock: 5, unit: 'kg', lowStockThreshold: 10, costPerUnit: 280 },
  { id: 'INV-005', name: 'Onions', category: 'Vegetables', stock: 40, unit: 'kg', lowStockThreshold: 15, costPerUnit: 40 },
  { id: 'INV-006', name: 'Packaging Boxes (Large)', category: 'Packaging', stock: 120, unit: 'pcs', lowStockThreshold: 200, costPerUnit: 12 },
  { id: 'INV-007', name: 'Coca Cola 500ml', category: 'Beverages', stock: 0, unit: 'bottles', lowStockThreshold: 24, costPerUnit: 35 },
];

export const InventoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['All', 'Raw Material', 'Dairy', 'Sauces', 'Meat', 'Vegetables', 'Packaging', 'Beverages']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filter, setFilter] = useState<'All' | 'Low Stock' | 'Out of Stock'>('All');
  const [activeTab, setActiveTab] = useState<'Stock' | 'History'>('Stock');
  
  // Modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // State for Modals
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [updateAmount, setUpdateAmount] = useState('');
  const [updateAction, setUpdateAction] = useState<'ADD' | 'REMOVE' | 'WASTAGE'>('ADD');
  const [updateRemarks, setUpdateRemarks] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

    let matchesFilter = true;
    if (filter === 'Low Stock') {
      matchesFilter = item.stock > 0 && item.stock <= item.lowStockThreshold;
    } else if (filter === 'Out of Stock') {
      matchesFilter = item.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const getStatusInfo = (item: InventoryItem) => {
    if (item.stock === 0) return { label: 'Out of Stock', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle };
    if (item.stock <= item.lowStockThreshold) return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertTriangle };
    return { label: 'In Stock', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
  };

  const handleUpdateStock = () => {
    if (!selectedItem || !updateAmount) return;
    
    const amount = parseFloat(updateAmount);
    if (isNaN(amount) || amount <= 0) return;

    let newStock = selectedItem.stock;
    if (updateAction === 'ADD') newStock += amount;
    else newStock = Math.max(0, newStock - amount);

    setItems(items.map(item => 
      item.id === selectedItem.id ? { ...item, stock: newStock } : item
    ));

    // Add to history log
    const newLog: InventoryLog = {
      id: `LOG-${Math.floor(Math.random() * 10000)}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      action: updateAction,
      amount: amount,
      unit: selectedItem.unit,
      date: new Date().toLocaleString(),
      remarks: updateRemarks || (updateAction === 'ADD' ? 'Restocked' : updateAction === 'WASTAGE' ? 'Marked as waste' : 'Consumed')
    };
    setLogs([newLog, ...logs]);
    
    setIsUpdateModalOpen(false);
    setSelectedItem(null);
    setUpdateAmount('');
    setUpdateRemarks('');
    setUpdateAction('ADD');
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.category || !formData.unit) return;

    if (selectedItem) {
      // Edit
      setItems(items.map(item => item.id === selectedItem.id ? { ...item, ...formData } as InventoryItem : item));
    } else {
      // Add
      const newItem: InventoryItem = {
        id: `INV-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        category: formData.category,
        stock: Number(formData.stock) || 0,
        unit: formData.unit,
        lowStockThreshold: Number(formData.lowStockThreshold) || 10,
        costPerUnit: Number(formData.costPerUnit) || 0
      };
      setItems([...items, newItem]);
    }
    setIsAddEditModalOpen(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
      setActiveDropdown(null);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Stock', 'Unit', 'Low Stock Threshold', 'Cost Per Unit', 'Total Value'];
    const rows = items.map(i => [
      i.id, 
      `"${i.name}"`, 
      `"${i.category}"`, 
      i.stock, 
      i.unit, 
      i.lowStockThreshold, 
      i.costPerUnit, 
      i.stock * i.costPerUnit
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalValue = items.reduce((sum, item) => sum + (item.stock * item.costPerUnit), 0);
  const lowStockCount = items.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold).length;
  const outOfStockCount = items.filter(i => i.stock === 0).length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans animate-in fade-in pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[60px] flex items-center px-4 justify-between lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900">Inventory Management</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="h-9 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
        {/* Desktop Header Actions */}
        <div className="hidden lg:flex justify-end mb-4">
          <button onClick={exportCSV} className="h-10 px-4 bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={18} />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Toggle Button */}
        <div className="relative flex p-1 bg-[#F3F4F6] rounded-full w-full max-w-md mx-auto">
          <div 
             className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-full shadow-sm transition-transform duration-300 ease-out"
             style={{ 
               left: '4px', 
               width: 'calc((100% - 8px) / 2)',
               transform: `translateX(${['Stock', 'History'].indexOf(activeTab) * 100}%)` 
             }}
          />
          <button 
            onClick={() => setActiveTab('Stock')}
            className={`relative z-10 flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 ${activeTab === 'Stock' ? 'text-[#1E90FF]' : 'text-[#6B7280] hover:text-slate-900'}`}
          >
            Current Stock
          </button>
          <button 
            onClick={() => setActiveTab('History')}
            className={`relative z-10 flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 ${activeTab === 'History' ? 'text-[#1E90FF]' : 'text-[#6B7280] hover:text-slate-900'}`}
          >
            Stock History
          </button>
        </div>

        {activeTab === 'Stock' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-[20px] border border-blue-100 shadow-sm">
                <div className="text-[13px] font-semibold text-blue-700 mb-1">Total Items</div>
                <div className="text-2xl font-black text-blue-900">{items.length}</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-[20px] border border-emerald-100 shadow-sm">
                <div className="text-[13px] font-semibold text-emerald-700 mb-1">Inventory Value</div>
                <div className="text-2xl font-black text-emerald-900">₹{totalValue.toLocaleString()}</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-[20px] border border-amber-100 shadow-sm">
                <div className="text-[13px] font-semibold text-amber-700 mb-1">Low Stock</div>
                <div className="text-2xl font-black text-amber-900">{lowStockCount}</div>
              </div>
              <div className="bg-rose-50 p-4 rounded-[20px] border border-rose-100 shadow-sm">
                <div className="text-[13px] font-semibold text-rose-700 mb-1">Out of Stock</div>
                <div className="text-2xl font-black text-rose-900">{outOfStockCount}</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="text" 
                placeholder="Search inventory items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-blue-500 text-[15px] font-medium transition-all"
              />
              <Mic 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E90FF] cursor-pointer" 
                size={20} 
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-[8px] overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
              <button 
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#EFF6FF] text-[#1E90FF] flex items-center gap-1.5"
              >
                <Plus size={18} />
                Add Category
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-[36px] px-[16px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    activeCategory === cat 
                      ? 'bg-[#1E90FF] text-white shadow-md shadow-blue-500/20' 
                      : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#4B5563] hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inventory List */}
            <div className="bg-[#FFFFFF] rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-3 py-2.5 font-semibold text-slate-600">Item Name</th>
                      <th className="px-3 py-2.5 font-semibold text-slate-600">Stock Level</th>
                      <th className="px-3 py-2.5 font-semibold text-slate-600">Status</th>
                      <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map(item => {
                      const status = getStatusInfo(item);
                      const StatusIcon = status.icon;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-3 py-2">
                            <div className="font-medium text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">₹{item.costPerUnit}/{item.unit}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-bold text-slate-900">{item.stock}</span>
                              <span className="text-xs text-slate-500">{item.unit}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsUpdateModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center h-7 px-2.5 rounded-md bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                              >
                                Update
                              </button>
                              <div className="relative">
                                <button 
                                  onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                {activeDropdown === item.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                    <div className="absolute right-0 mt-1 w-32 bg-[#FFFFFF] rounded-lg shadow-lg border border-slate-100 overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                                      <button 
                                        onClick={() => {
                                          setSelectedItem(item);
                                          setFormData(item);
                                          setIsAddEditModalOpen(true);
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <Edit2 size={14} /> Edit
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="w-full px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                      >
                                        <Trash2 size={14} /> Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                          <p className="text-base font-medium text-slate-900">No items found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'History' && (
          <div className="bg-[#FFFFFF] rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-3 py-2.5 font-semibold text-slate-600">Date & Time</th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600">Item</th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600">Action</th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600">Amount</th>
                    <th className="px-3 py-2.5 font-semibold text-slate-600">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 py-2 text-xs text-slate-600">{log.date}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">{log.itemName}</div>
                        <div className="text-[11px] text-slate-500">ID: {log.itemId}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          log.action === 'ADD' ? 'bg-emerald-100 text-emerald-700' : 
                          log.action === 'WASTAGE' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-bold text-slate-900">
                        {log.action === 'ADD' ? '+' : '-'}{log.amount} {log.unit}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">{log.remarks}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-base font-medium text-slate-900">No history logs yet</p>
                        <p className="text-sm mt-1">Stock updates will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Update Stock Modal */}
      {isUpdateModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl p-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Update Stock</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6 space-y-4">
              <div>
                <div className="text-sm font-medium text-slate-900 mb-1">{selectedItem.name}</div>
                <div className="text-sm text-slate-500">Current Stock: {selectedItem.stock} {selectedItem.unit}</div>
              </div>

              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setUpdateAction('ADD')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${updateAction === 'ADD' ? 'bg-[#FFFFFF] text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Restock (+)
                </button>
                <button 
                  onClick={() => setUpdateAction('REMOVE')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${updateAction === 'REMOVE' ? 'bg-[#FFFFFF] text-amber-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Consume (-)
                </button>
                <button 
                  onClick={() => setUpdateAction('WASTAGE')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${updateAction === 'WASTAGE' ? 'bg-[#FFFFFF] text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Wastage (-)
                </button>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Amount</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="e.g. 10" 
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                    className="w-full h-12 px-4 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                    {selectedItem.unit}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Remarks (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Received from supplier, Spoiled, etc." 
                  value={updateRemarks}
                  onChange={(e) => setUpdateRemarks(e.target.value)}
                  className="w-full h-12 px-4 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="flex-1 h-11 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStock}
                disabled={!updateAmount || parseFloat(updateAmount) <= 0}
                className="flex-1 h-11 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl p-5 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">{selectedItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Item Name *</label>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full h-11 px-3 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Category *</label>
                  <input 
                    type="text" 
                    value={formData.category || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g. Dairy, Meat"
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Unit *</label>
                  <input 
                    type="text" 
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="e.g. kg, liters, pcs"
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Cost Per Unit (₹)</label>
                  <input 
                    type="number" 
                    value={formData.costPerUnit || ''}
                    onChange={(e) => setFormData({...formData, costPerUnit: parseFloat(e.target.value)})}
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Low Stock Alert At</label>
                  <input 
                    type="number" 
                    value={formData.lowStockThreshold || ''}
                    onChange={(e) => setFormData({...formData, lowStockThreshold: parseFloat(e.target.value)})}
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              {!selectedItem && (
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Initial Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({...formData, stock: parseFloat(e.target.value)})}
                    className="w-full h-11 px-3 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddEditModalOpen(false)}
                className="flex-1 h-11 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveItem}
                disabled={!formData.name || !formData.category || !formData.unit}
                className="flex-1 h-11 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsAddCategoryModalOpen(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add Category</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category Name</label>
                <input 
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Beverages"
                  className="w-full h-12 px-4 bg-[#FFFFFF] border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
                      setCategories([...categories, newCategoryName.trim()]);
                      setIsAddCategoryModalOpen(false);
                      setNewCategoryName('');
                    }
                  }}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-semibold text-[16px] flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button 
        onClick={() => {
          setSelectedItem(null);
          setFormData({ stock: 0, lowStockThreshold: 10, costPerUnit: 0 });
          setIsAddEditModalOpen(true);
        }}
        className="fixed bottom-[100px] right-6 lg:bottom-10 lg:right-10 z-50 w-14 h-14 bg-[#1E90FF] text-[#FFFFFF] rounded-full flex items-center justify-center shadow-lg active:scale-[0.98] transition-all"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};
