import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, Sparkles, Check, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { KRATHONG_STYLES } from '../data/mockContestants';
import { compressImageToMaxKB } from '../utils/imageCompressor';

export default function SelfieModal({ isOpen, onClose, onSubmitKrathong }) {
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(KRATHONG_STYLES[0]);
  const [photoData, setPhotoData] = useState(null);
  const [photoSizeKB, setPhotoSizeKB] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraError('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตสิทธิ์ หรือเลือกอัปโหลดรูปภาพแทน');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Process and compress image to ensure <= 500KB
  const processAndCompress = async (rawSource) => {
    setIsCompressing(true);
    try {
      const compressed = await compressImageToMaxKB(rawSource, 500);
      setPhotoData(compressed);
      
      // Calculate byte size
      const base64 = compressed.split(',')[1] || '';
      const sizeKB = Math.round((base64.length * 3) / 4 / 1024);
      setPhotoSizeKB(sizeKB);
    } catch (err) {
      console.error("Compression error:", err);
      setPhotoData(rawSource);
    } finally {
      setIsCompressing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Mirrored selfie capture
    ctx.translate(600, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, 0, 0, 600, 600);

    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    processAndCompress(rawDataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndCompress(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const fallbackPhoto = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

      const newContestant = {
        id: `krathong-${Date.now()}`,
        name: name.trim(),
        wish: wish.trim() || 'ขอขมาพระแม่คงคา และขอให้มีแต่ความสุขความเจริญตลอดปี',
        votes: 1,
        color: selectedStyle.color,
        candleColor: selectedStyle.candleColor,
        style: selectedStyle.id,
        styleName: selectedStyle.name,
        photo: photoData || fallbackPhoto,
        initialPos: { x: 0, z: 2 },
        photoSizeKB: photoSizeKB || 0
      };

      await onSubmitKrathong(newContestant);
      stopCamera();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e172a]/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-900/40 via-amber-700/20 to-transparent border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪷</span>
            <div>
              <h2 className="text-lg font-bold text-amber-300">ลอยกระทง & ส่งประกวด</h2>
              <p className="text-[10px] text-amber-400/80">จัดเก็บข้อมูลและรูปถ่ายลง Firebase Firestore</p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-4">

          {/* Photo Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)] bg-slate-900 flex items-center justify-center">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : isCompressing ? (
                <div className="flex flex-col items-center justify-center text-amber-400 text-xs gap-1.5 p-2">
                  <Loader2 size={24} className="animate-spin" />
                  <span>กำลังบีบอัดรูป...</span>
                </div>
              ) : photoData ? (
                <img
                  src={photoData}
                  alt="Selfie"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <Camera size={36} className="mx-auto text-amber-400/70 mb-1" />
                  <span className="text-xs">ถ่ายรูปตัวเอง</span>
                </div>
              )}
            </div>

            {/* Photo Size & Compression Indicator */}
            {photoData && photoSizeKB !== null && (
              <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-[11px] text-emerald-300">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>ขนาดรูป: <strong>{photoSizeKB} KB</strong> (ผ่านเกณฑ์ &le; 500 KB สำหรับ Firestore)</span>
              </div>
            )}

            {/* Camera / Upload buttons */}
            <div className="flex items-center gap-2 mt-3">
              {isCameraActive ? (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-full text-xs shadow-md flex items-center gap-1.5 transition"
                >
                  <Camera size={15} /> กดชัตเตอร์
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-full text-xs flex items-center gap-1.5 transition"
                  >
                    <Camera size={14} /> {photoData ? 'ถ่ายใหม่' : 'เปิดกล้องเซลฟี่'}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-full text-xs flex items-center gap-1.5 transition"
                  >
                    <ImageIcon size={14} /> เลือกรูปภาพ
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {cameraError && (
              <p className="text-xs text-rose-400 mt-2 text-center">{cameraError}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Input Name */}
            <div>
              <label className="block text-xs font-medium text-amber-200/90 mb-1">
                ชื่อผู้เข้าประกวด / ผู้ส่งกระทง <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น น้องมะลิ พิมพ์ใจ หรือ ครอบครัวใจดี"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-sm outline-none transition"
              />
            </div>

            {/* Input Wish */}
            <div>
              <label className="block text-xs font-medium text-amber-200/90 mb-1">
                คำอธิษฐานลอยกระทง
              </label>
              <textarea
                rows={2}
                maxLength={150}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="ขอขมาพระแม่คงคา ขอให้สุขภาพแข็งแรงและมีแต่ความสุข..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-sm outline-none transition resize-none"
              />
            </div>

            {/* Krathong Style Selector */}
            <div>
              <label className="block text-xs font-medium text-amber-200/90 mb-1.5">
                เลือกรูปแบบกระทง
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {KRATHONG_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition ${
                      selectedStyle.id === style.id
                        ? 'border-amber-400 bg-amber-400/15 shadow-sm'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 shadow-inner flex items-center justify-center text-xs"
                      style={{ backgroundColor: style.color }}
                    >
                      {selectedStyle.id === style.id && <Check size={12} className="text-white drop-shadow" />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white truncate">{style.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{style.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isCompressing}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 text-sm transition transform active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>กำลังบันทึกลง Firestore...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>บันทึกและปล่อยกระทงลงแม่น้ำ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
