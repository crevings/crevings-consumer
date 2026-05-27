
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, Move, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface CropProfileImageViewProps {
  imageUri: string;
  onBack: () => void;
  onSave: (croppedUri: string) => void;
}

export const CropProfileImageView: React.FC<CropProfileImageViewProps> = ({ imageUri, onBack, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CROP_SIZE = 280;

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    setOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const displayWidth = img.clientWidth * zoom;
    const displayHeight = img.clientHeight * zoom;
    const drawX = (CROP_SIZE / 2) - (displayWidth / 2) + offset.x;
    const drawY = (CROP_SIZE / 2) - (displayHeight / 2) + offset.y;
    ctx.drawImage(img, drawX, drawY, displayWidth, displayHeight);
    onSave(canvas.toDataURL('image/png', 1.0));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans select-none overflow-hidden">
      <div className="px-5 py-6 flex items-center justify-between z-20">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg text-white">Adjust Photo</h1>
        <div className="w-10" />
      </div>
      <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden touch-none" onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
        <div className="absolute transition-transform duration-75" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
            <img ref={imgRef} src={imageUri} alt="Original" className="max-w-[120%] h-auto pointer-events-none" />
        </div>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
            <div className="relative rounded-full border-2 border-blue-500 shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]" style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-px h-full bg-white/10"></div>
                    <div className="w-full h-px bg-white/10 absolute"></div>
                </div>
            </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <Move className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Drag to reposition</span>
            </div>
        </div>
      </div>
      <div className="bg-[#0a0a0a] border-t border-white/5 p-8 pb-10 flex flex-col items-center gap-8">
        <div className="w-full max-w-[280px] space-y-4">
            <div className="flex justify-between items-center text-white/40">
                <ZoomOut className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Zoom Level</span>
                <ZoomIn className="w-4 h-4" />
            </div>
            <input type="range" min="0.5" max="3" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" />
        </div>
        <div className="flex gap-4">
            <button onClick={() => setZoom(1)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 border border-white/5 active:scale-90 transition-all"><RotateCw className="w-5 h-5" /></button>
            <button onClick={handleApplyCrop} className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                <Check className="w-5 h-5" />
                Apply Changes
            </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
