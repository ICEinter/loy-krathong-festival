import React from 'react';
import { Trophy, X, Award, Heart } from 'lucide-react';

export default function LeaderboardModal({ isOpen, onClose, contestants, onSelectContestant }) {
  if (!isOpen) return null;

  // Sort contestants by votes descending
  const sorted = [...contestants].sort((a, b) => b.votes - a.votes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f172a]/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-900/40 via-amber-700/20 to-transparent border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            <h2 className="text-base font-bold text-amber-300">ตารางคะแนนโหวตกระทงยอดนิยม</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contestants List */}
        <div className="overflow-y-auto p-4 space-y-2">
          {sorted.map((item, index) => {
            const isTop3 = index < 3;
            const rankBadges = ['🥇', '🥈', '🥉'];

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectContestant(item);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                  isTop3
                    ? 'bg-amber-500/10 border-amber-400/40 hover:bg-amber-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-sm">
                    {isTop3 ? rankBadges[index] : index + 1}
                  </span>
                  
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                  />

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                      {item.name}
                    </h4>
                    <span
                      className="inline-block text-[10px] px-2 py-0.2 rounded-full text-white font-medium"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.styleName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-rose-400 font-bold text-xs sm:text-sm">
                  <Heart size={14} className="fill-rose-400" />
                  <span>{item.votes}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800 text-center text-slate-400 text-[11px]">
          คลิกที่รายชื่อเพื่อบินไปดูกระทงและกดโหวตในแม่น้ำ
        </div>
      </div>
    </div>
  );
}

