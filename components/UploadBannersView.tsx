import React, { useState } from 'react';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadBannersViewProps {
  onBack: () => void;
}

interface Banner {
  id: string;
  url: string;
  name: string;
}

export const UploadBannersView: React.FC<UploadBannersViewProps> = ({ onBack }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (banners.length >= 6) {
      setError("Maximum of 6 banners allowed.");
      return;
    }

    const file = files[0];
    
    // Check file size (50MB = 50 * 1024 * 1024 bytes)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit.");
      return;
    }

    // In a real app, we would validate resolution (1000x1500) here using an Image object
    // and upload to a server. For this UI demo, we'll create a local object URL.
    const url = URL.createObjectURL(file);
    
    const newBanner: Banner = {
      id: Date.now().toString(),
      url,
      name: ''
    };

    setBanners([...banners, newBanner]);
  };

  const handleNameChange = (id: string, newName: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, name: newName } : b));
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20">
      <div className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center px-4 sticky top-0 z-20">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Upload Banners</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 shadow-sm border border-slate-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Banner Guidelines</h2>
              <p className="text-sm text-slate-500 mt-1">Upload high-quality banners to showcase your restaurant.</p>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-slate-600 mb-5">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              Resolution: 1000 × 1500 pixels
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              Maximum file size: 50MB
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              Maximum 6 banners allowed ({banners.length}/6 uploaded)
            </li>
          </ul>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-600 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <label className={`w-full h-[120px] border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center gap-2 transition-colors ${banners.length >= 6 ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer text-blue-600'}`}>
            <Upload size={24} />
            <span className="text-sm font-medium">Tap to upload banner</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={banners.length >= 6}
            />
          </label>
        </div>

        {banners.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 px-1">Uploaded Banners</h3>
            <div className="grid grid-cols-1 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-slate-100 flex gap-4">
                  <div className="w-[80px] h-[120px] rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img src={banner.url} alt="Banner preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Banner Name</label>
                      <input 
                        type="text" 
                        value={banner.name}
                        onChange={(e) => handleNameChange(banner.id, e.target.value)}
                        placeholder="e.g., Weekend Special"
                        className="w-full h-[40px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="self-end flex items-center gap-1.5 text-sm font-medium text-rose-500 active:scale-95 transition-transform px-2 py-1.5 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
