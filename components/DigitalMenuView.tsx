import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, MoreVertical, FileText, Image as ImageIcon, X } from 'lucide-react';

interface DigitalMenuViewProps {
  onBack: () => void;
}

export const DigitalMenuView: React.FC<DigitalMenuViewProps> = ({ onBack }) => {
  const [menus, setMenus] = useState([
    { id: 1, name: 'Main Menu', type: 'image', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: 'Dessert Menu', type: 'pdf', url: '' },
    { id: 3, name: 'Drinks Menu', type: 'image', url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=400&auto=format&fit=crop' }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = (type: 'image' | 'pdf') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf';
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    if (newMenuName.trim() && selectedFile) {
      const isPdf = selectedFile.type === 'application/pdf';
      const url = URL.createObjectURL(selectedFile);
      
      setMenus([...menus, { 
        id: Date.now(), 
        name: newMenuName, 
        type: isPdf ? 'pdf' : 'image', 
        url 
      }]);
      
      setShowUploadModal(false);
      setNewMenuName('');
      setSelectedFile(null);
    }
  };

  const handleDelete = (id: number) => {
    setMenus(menus.filter(m => m.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Digital Menu</h1>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="text-[#1E90FF] font-semibold text-[15px] px-2 active:opacity-70">
          Upload
        </button>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-4 mb-6">
          <p className="text-[13px] text-blue-800 leading-relaxed">
            Upload your menu photos or PDF files. Supported formats: JPG, PNG, PDF. Recommended image size: 1000 × 1000 pixels.
          </p>
        </div>

        {menus.map(menu => (
          <div key={menu.id} className="bg-[#FFFFFF] rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm flex items-center gap-4 relative">
            <div className="w-16 h-16 rounded-[12px] bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
              {menu.type === 'image' ? (
                <img src={menu.url} alt={menu.name} className="w-full h-full object-cover" />
              ) : (
                <FileText size={24} className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-semibold text-slate-900 truncate">{menu.name}</h3>
              <p className="text-[12px] text-slate-500 uppercase tracking-wider mt-1">{menu.type}</p>
            </div>
            <button 
              onClick={() => setActiveMenuId(activeMenuId === menu.id ? null : menu.id)}
              className="w-10 h-10 flex items-center justify-center text-slate-400 active:bg-slate-50 rounded-full"
            >
              <MoreVertical size={20} />
            </button>

            {activeMenuId === menu.id && (
              <div className="absolute right-4 top-14 w-48 bg-[#FFFFFF] rounded-xl shadow-lg border border-slate-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full px-4 py-3 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-50">Edit Name</button>
                <button className="w-full px-4 py-3 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-50">Replace File</button>
                <button onClick={() => handleDelete(menu.id)} className="w-full px-4 py-3 text-left text-[14px] font-medium text-red-600 hover:bg-red-50">Delete Menu</button>
              </div>
            )}
          </div>
        ))}

        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full h-[52px] bg-[#FFFFFF] border-2 border-dashed border-[#D1D5DB] text-[#1E90FF] rounded-[16px] font-semibold text-[15px] flex items-center justify-center gap-2 active:bg-slate-50 transition-colors mt-6"
        >
          <Upload size={18} />
          Upload Menu
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[24px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-slate-900">Upload Menu</h2>
              <button onClick={() => { setShowUploadModal(false); setSelectedFile(null); setNewMenuName(''); }} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-600">Menu Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Dinner Menu"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] focus:bg-[#FFFFFF] transition-colors"
                />
              </div>

              <div className="pt-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                
                {!selectedFile ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleUploadClick('image')} className="h-24 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-600 hover:border-[#1E90FF] hover:text-[#1E90FF] transition-colors">
                      <ImageIcon size={24} />
                      <span className="text-[13px] font-medium">Image</span>
                    </button>
                    <button onClick={() => handleUploadClick('pdf')} className="h-24 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-600 hover:border-[#1E90FF] hover:text-[#1E90FF] transition-colors">
                      <FileText size={24} />
                      <span className="text-[13px] font-medium">PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-24 rounded-xl border border-[#1E90FF] bg-blue-50 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {selectedFile.type === 'application/pdf' ? <FileText className="text-[#1E90FF] shrink-0" /> : <ImageIcon className="text-[#1E90FF] shrink-0" />}
                      <span className="text-[14px] font-medium text-slate-900 truncate">{selectedFile.name}</span>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="p-2 text-slate-500 hover:text-red-500 rounded-full shrink-0">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={handleUpload}
                disabled={!newMenuName.trim() || !selectedFile}
                className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shadow-sm mt-4 disabled:opacity-50"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
