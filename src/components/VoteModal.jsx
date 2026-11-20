import React, { useState } from 'react';
import { Heart, X, Sparkles, Award, Quote } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VoteModal({ contestant, onClose, onVote }) {
  const [hasVoted, setHasVoted] = useState(false);

  if (!contestant) return null;

  const handleVoteClick = () => {
    if (hasVoted) return;

    // Trigger celebration confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#22c55e', '#3b82f6']
    });

    setHasVoted(true);
    onVote(contestant.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#131d36] to-[#0a0f1d] border border-amber-400/40 rounded-3xl shadow-[0_0_35px_rgba(251,191,36,0.25)] overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-slate-300 hover:text-white hover:bg-black/60 transition"
        >
          <X size={18} />
        </button>

        <div className="p-5 text-center">
          
          {/* Owner Avatar & Style badge */}
          <div className="relative inline-block mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.35)] mx-auto bg-slate-800">
              <img
                src={contestant.photo}
                alt={contestant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md border border-white/20 whitespace-nowrap"
              style={{ backgroundColor: contestant.color || '#22c55e' }}
            >
              {contestant.styleName || 'กระทงไทย'}
            </div>
          </div>

          {/* Name & Votes */}
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center justify-center gap-1.5">
            {contestant.name}
          </h3>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 border border-amber-400/30 rounded-full my-2.5">
            <Award size={15} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-200">
              คะแนนโหวตปัจจุบัน: <strong className="text-amber-300 text-sm">{contestant.votes}</strong> คะแนน
            </span>
          </div>

          {/* Wish / Prayer Card */}
          <div className="my-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left relative">
            <Quote size={16} className="text-amber-400/50 absolute top-2 left-2" />
            <p className="text-xs text-slate-300 pl-4 italic leading-relaxed">
              "{contestant.wish}"
            </p>
          </div>

          {/* Vote Action Button */}
          <div className="mt-4">
            <button
              onClick={handleVoteClick}
              disabled={hasVoted}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95 ${
                hasVoted
                  ? 'bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
              }`}
            >
              <Heart
                size={18}
                className={hasVoted ? 'fill-emerald-300 text-emerald-300' : 'fill-white animate-pulse'}
              />
              {hasVoted ? 'โหวตให้กระทงนี้สำเร็จแล้ว!' : 'กดโหวตให้กระทงนี้ (+1)'}
            </button>
            <p className="text-[10px] text-slate-400 mt-2">
              แตะส่วนใดก็ได้เพื่อปิด หรือคลิกกระทงอื่นเพื่อชมต่อ
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

