import React, { useState } from 'react';
import { ArrowLeft, Edit2, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface BusinessDocumentsViewProps {
  onBack: () => void;
}

export const BusinessDocumentsView: React.FC<BusinessDocumentsViewProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState([
    { id: 'gst', name: 'GST Number', value: '27ABCDE1234F1Z5', verified: true },
    { id: 'fssai', name: 'FSSAI License Number', value: '11521014000123', verified: true },
    { id: 'cin', name: 'CIN Number', value: 'U74999MH2021PTC351234', verified: false },
    { id: 'pan', name: 'PAN Number', value: 'ABCDE1234F', verified: true }
  ]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Business Docs</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-4 mb-6">
          <p className="text-[13px] text-blue-800 leading-relaxed">
            Upload your business registration documents. Supported formats: PDF, JPG, PNG.
          </p>
        </div>

        {documents.map(doc => (
          <div key={doc.id} className="bg-[#FFFFFF] rounded-[18px] p-5 border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-medium text-slate-500">{doc.name}</h3>
                {doc.verified && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
              <button className="w-8 h-8 flex items-center justify-center text-[#1E90FF] bg-blue-50 rounded-full active:scale-95 transition-transform">
                <Edit2 size={14} />
              </button>
            </div>
            <p className="text-[16px] font-bold text-slate-900 font-mono tracking-wider">{doc.value}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button className="w-full h-[52px] border border-slate-200 rounded-[16px] flex items-center justify-center gap-2 font-semibold text-[16px] text-slate-600 active:scale-[0.98] transition-all">
                <Upload size={16} />
                Upload {doc.name.split(' ')[0]} Certificate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
