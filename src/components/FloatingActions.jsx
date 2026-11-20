import React, { useState } from 'react';
import { Camera, RotateCcw, Music, VolumeX, HelpCircle, Sparkles } from 'lucide-react';

export default function FloatingActions({
  onOpenSelfie,
  onResetCamera,
  isPlayingMusic,
  onToggleMusic,
  hasMyKrathong,
  onFocusMyKrathong
}) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {/* Help tooltip popup */}
      {showHelp && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-sm p-4 bg-slate-900/95 border border-amber-400/40 rounded-2xl shadow-2xl backdrop-blur-md text-xs text-slate-200 animate-fade-in">
          <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
            <HelpCircle size={15} /> วิธีการใช้งานระบบ 3D
          </h4>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li>• <strong>หมุนมุมกล้อง:</strong> ลากเมาส์คลิกซ้าย หรือลาก 1 นิ้วบนหน้าจอมือถือ</li>
            <li>• <strong>ซูมเข้า / ซูมออก:</strong> เลื่อน Scroll เมาส์ หรือใช้ 2 นิ้วบีบ/ขยาย (Pinch)</li>
            <li>• <strong>โหวตกระทง:</strong> แตะ/คลิกที่กระทงเพื่อเปิดดูข้อมูลและกดโหวต</li>
            <li>• <strong>กระทงของคุณ:</strong> มีเสาแสงสีทองและป้าย 👑 ส่องเด่นเฉพาะเครื่องคุณ</li>
            <li>• <strong>กระทงจำลอง:</strong> ลอยประดับแม่น้ำให้บรรยากาศงดงามทั่วสายน้ำ</li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-3 w-full py-1 text-center bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[11px] font-semibold"
          >
            เข้าใจแล้ว
          </button>
        </div>
      )}

      {/* Main Bottom Floating Bar */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 bg-slate-900/80 backdrop-blur-lg border border-amber-400/30 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.6)]">
        
        {/* Reset Camera Button */}
        <button
          onClick={onResetCamera}
          title="รีเซ็ตมุมกล้อง"
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 shadow transition active:scale-90"
        >
          <RotateCcw size={16} />
        </button>

        {/* Music Button */}
        <button
          onClick={onToggleMusic}
          title={isPlayingMusic ? "ปิดเพลงลอยกระทง" : "เปิดเพลงลอยกระทง"}
          className={`p-2.5 rounded-full border shadow transition active:scale-90 ${
            isPlayingMusic
              ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
              : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          {isPlayingMusic ? <Music size={16} className="text-amber-400 animate-spin" /> : <VolumeX size={16} />}
        </button>

        {/* Big Launch Krathong & Selfie Button */}
        <button
          onClick={onOpenSelfie}
          className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center gap-2 transition transform active:scale-95"
        >
          <Camera size={17} />
          <span>ลอยกระทง & ส่งประกวด</span>
        </button>

        {/* Focus My Krathong shortcut */}
        {hasMyKrathong && (
          <button
            onClick={onFocusMyKrathong}
            title="ไปที่กระทงของฉัน"
            className="p-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 shadow transition active:scale-90 text-sm"
          >
            👑
          </button>
        )}

        {/* Help Toggle Button */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          title="วิธีใช้งาน"
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 shadow transition active:scale-90"
        >
          <HelpCircle size={16} />
        </button>

      </div>
    </>
  );
}
