
import React, { useState } from 'react';
import { MOCK_PITCHES, MOCK_USER } from '../constants';
import { PitchDeck } from '../types';
import { Rocket, Users, Target, ShieldCheck, Play, ArrowUpRight, Plus, Info, Zap, Loader2, Sparkles } from 'lucide-react';

const PitchArena: React.FC = () => {
  const [activePitch, setActivePitch] = useState<PitchDeck | null>(null);
  const [isBacking, setIsBacking] = useState(false);

  const handleBackPitch = (pitch: PitchDeck) => {
    setIsBacking(true);
    setTimeout(() => {
      alert(`SUCCESS: You have backed ${pitch.title} for $5,000. Transaction secured in Arena Vault.`);
      setIsBacking(false);
      setActivePitch(null);
    }, 2000);
  };

  return (
    <div className="h-full bg-white dark:bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-8 no-scrollbar transition-colors">
      <div className="flex justify-between items-center pt-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black flex items-center gap-2 tracking-tighter text-black dark:text-white">
            <Rocket className="text-sky-500" />
            PITCH ARENA
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Build the Future, Invest in Impact</p>
        </div>
        <button className="bg-sky-500/10 text-sky-500 p-3 rounded-2xl border border-sky-500/20 active:scale-95 shadow-lg">
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-sky-500 text-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-[5s]">
           <Sparkles size={120} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-tighter relative z-10">Exclusive Access</h3>
        <p className="text-[10px] font-bold text-white/80 mt-1 mb-6 uppercase tracking-widest relative z-10">Only funded products sell here.</p>
        <button className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase px-6 py-3 rounded-full tracking-widest relative z-10 shadow-xl active:scale-95 transition-all">
          LEARN MORE
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500">Live Pitches</h3>
           <div className="flex items-center gap-1.5 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              <Zap size={10} className="text-sky-500" />
              <span className="text-[9px] font-black text-sky-500 uppercase">Early Stage</span>
           </div>
        </div>

        {MOCK_PITCHES.map(pitch => (
          <div 
            key={pitch.id}
            onClick={() => setActivePitch(pitch)}
            className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden group cursor-pointer relative shadow-xl active:scale-[0.98] transition-all"
          >
            <div className="aspect-video relative bg-zinc-800">
               <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={48} className="text-white/40 group-hover:text-sky-500 transition-colors" />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div className="space-y-1 text-white">
                     <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Developer</p>
                     <div className="flex items-center gap-2">
                        <img src={pitch.developerAvatar} className="w-5 h-5 rounded-full" />
                        <span className="text-[10px] font-black uppercase">@{pitch.developerName}</span>
                     </div>
                  </div>
                  <div className="bg-sky-500 px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                    {Math.round((pitch.currentFunding / pitch.fundingGoal) * 100)}% FUNDED
                  </div>
               </div>
            </div>
            
            <div className="p-7 space-y-4">
               <h4 className="text-xl font-black tracking-tighter uppercase text-black dark:text-white leading-none">{pitch.title}</h4>
               <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{pitch.description}</p>
               
               <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 transition-all duration-1000 shadow-[0_0_10px_rgba(14,165,233,0.5)]" 
                    style={{ width: `${(pitch.currentFunding / pitch.fundingGoal) * 100}%` }}
                  ></div>
               </div>

               <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-zinc-500">
                     <Users size={14} className="text-sky-500" />
                     <span className="text-[10px] font-black">{pitch.backers} BACKERS</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                     <Target size={14} className="text-sky-500" />
                     <span className="text-[10px] font-black uppercase tracking-tighter">${pitch.fundingGoal.toLocaleString()} GOAL</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {activePitch && (
        <div className="fixed inset-0 z-[150] bg-white dark:bg-black p-6 flex flex-col animate-in slide-in-from-bottom duration-500">
           <div className="flex justify-between items-center mb-8 pt-8">
              <button onClick={() => setActivePitch(null)} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500"><Plus size={24} className="rotate-45" /></button>
              <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white">PITCH DETAILS</h3>
              <button className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500"><Info size={24} /></button>
           </div>

           <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
              <div className="aspect-[9/16] bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
                 <video src={activePitch.videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
                 <div className="absolute bottom-12 left-8 right-8 space-y-4">
                    <h4 className="text-3xl font-black tracking-tighter text-white uppercase">{activePitch.title}</h4>
                    <p className="text-sm text-white/70 leading-relaxed font-medium">{activePitch.description}</p>
                 </div>
              </div>

              <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-[3rem] space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Equity Reward</p>
                       <p className="text-2xl font-black text-sky-500">{activePitch.equityOffered}% STAKE</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Backing Unit</p>
                       <p className="text-2xl font-black text-black dark:text-white">$5,000</p>
                    </div>
                 </div>
                 
                 <div className="bg-blue-500/10 p-4 rounded-2xl flex items-start gap-3 border border-blue-500/20">
                    <ShieldCheck size={20} className="text-sky-500 shrink-0" />
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-tight">
                       Arena Secure Sentinel verifies this developer's ID and factory capacity before listing.
                    </p>
                 </div>
              </div>
           </div>

           <div className="pt-6 pb-8 flex gap-4">
              <button className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-5 rounded-3xl font-black uppercase tracking-widest text-xs">FOLLOW DEV</button>
              <button 
                onClick={() => handleBackPitch(activePitch)}
                disabled={isBacking}
                className="flex-[2] bg-sky-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-sky-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {isBacking ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} strokeWidth={3} />}
                BACK THIS PITCH
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PitchArena;
