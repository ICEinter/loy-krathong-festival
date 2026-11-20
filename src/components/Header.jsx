import React from 'react';
import { Trophy, Flame, Music, VolumeX, Sparkles } from 'lucide-react';

export default function Header({
  totalVotes,
  contestantCount,
  isFirestoreConnected,
  isPlayingMusic,
  onToggleMusic,
  onOpenLeaderboard,
  onFocusMyKrathong,
  hasMyKrathong
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-5 flex justify-between items-start gap-2">
      
      {/* Title & Theme Banner */}
      <div className="pointer-events-auto bg-slate-900/75 backdrop-blur-md border border-amber-400/35 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-lg flex items-center gap-3 max-w-[65vw] sm:max-w-md">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-xl shadow-md flex-shrink-0 animate-pulse-glow">
          🌕
        </div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 font-charm">
              ประเพณีลอยกระทง 3D ออนไลน์
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Flame size={10} className="text-amber-400" /> Firestore Realtime
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-1">
            ร่วมสืบสานประเพณีไทย ถ่ายรูป ปล่อยกระทง และโหวตกระทงยอดนิยม
          </p>
        </div>
      </div>

      {/* Action Controls: Music & Leaderboard */}
      <div className="pointer-events-auto flex items-center gap-2">
        
        {/* Loy Krathong Music Button */}
        <button
          onClick={onToggleMusic}
          title={isPlayingMusic ? "ปิดเพลงลอยกระทง" : "เปิดเพลงลอยกระทง"}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shadow-lg transition active:scale-95 ${
            isPlayingMusic
              ? 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse'
              : 'bg-slate-900/75 backdrop-blur-md border-amber-400/30 text-slate-300 hover:text-amber-300 hover:bg-slate-800'
          }`}
        >
          {isPlayingMusic ? <Music size={15} className="text-amber-400 animate-spin" /> : <VolumeX size={15} />}
          <span className="hidden sm:inline">{isPlayingMusic ? "กำลังเล่นเพลง 🎵" : "เปิดเพลงลอยกระทง"}</span>
        </button>

        {/* Find My Krathong Button */}
        {hasMyKrathong && (
          <button
            onClick={onFocusMyKrathong}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 shadow-lg text-xs font-bold transition active:scale-95"
          >
            <span>👑</span>
            <span className="hidden sm:inline">กระทงของฉัน</span>
          </button>
        )}

        {/* Leaderboard Button */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/75 backdrop-blur-md border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 shadow-lg text-xs font-semibold transition active:scale-95"
        >
          <Trophy size={15} className="text-amber-400" />
          <span className="hidden sm:inline">อันดับกระทง</span>
          <span className="px-1.5 py-0.5 rounded-full bg-amber-400/25 text-[10px] text-amber-200 font-bold">
            {contestantCount}
          </span>
        </button>

      </div>

    </header>
  );
}
