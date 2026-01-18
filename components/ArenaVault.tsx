
import React, { useState } from 'react';
import { Wallet, ShieldCheck, History, ArrowUpRight, ArrowDownLeft, Lock, Loader2, AlertCircle, Fingerprint } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { auditArenaTransaction } from '../services/gemini';

const ArenaVault: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const simulateSecureTransfer = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const result = await auditArenaTransaction(MOCK_USER.id, 5000, "Secure Node Payout", MOCK_USER.walletBalance);
      setAuditResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="h-full bg-black overflow-y-auto p-6 pb-24 space-y-8 no-scrollbar">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <Fingerprint className="text-sky-500" />
            ARENA VAULT
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Google-Native Secure Infrastructure</p>
        </div>
        <div className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-green-500/20">
          <ShieldCheck size={12} />
          SECURE
        </div>
      </div>

      {/* Modern Card View */}
      <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={120} />
        </div>
        
        <div className="space-y-1 relative z-10">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Total Liquid Capital</p>
          <p className="text-4xl font-black tracking-tighter text-white">
            ${MOCK_USER.walletBalance.toLocaleString()}
          </p>
        </div>

        <div className="mt-12 flex gap-3 relative z-10">
          <button 
            onClick={simulateSecureTransfer}
            className="flex-1 bg-white text-black py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <ArrowUpRight size={16} />
            Transfer
          </button>
          <button className="flex-1 bg-zinc-800 text-white py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-zinc-700 active:scale-95 transition-all">
            <ArrowDownLeft size={16} />
            Receive
          </button>
        </div>
      </div>

      {/* AI Sentinel Audit View */}
      {isAuditing && (
        <div className="bg-zinc-900 border border-sky-500/30 p-6 rounded-[2rem] flex flex-col items-center gap-4 animate-pulse">
           <Loader2 className="text-sky-500 animate-spin" size={32} />
           <p className="text-[10px] font-black text-white uppercase tracking-widest">Sentinel AI Auditing Transaction...</p>
        </div>
      )}

      {auditResult && (
        <div className={`p-6 rounded-[2rem] border animate-in slide-in-from-bottom duration-300 ${auditResult.isSafe ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={20} className={auditResult.isSafe ? 'text-green-500' : 'text-red-500'} />
              <h4 className="text-sm font-black uppercase tracking-widest">Audit Outcome</h4>
           </div>
           <p className="text-xs font-medium text-zinc-300 leading-relaxed mb-4">{auditResult.reason}</p>
           <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black px-3 py-1 rounded-full ${auditResult.riskLevel === 'LOW' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                RISK: {auditResult.riskLevel}
              </span>
           </div>
        </div>
      )}

      {/* Secure History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
             <History size={14} />
             Internal Ledger
           </h3>
           <Lock size={12} className="text-zinc-700" />
        </div>
        
        <div className="space-y-3">
          {MOCK_USER.ledger.map(entry => (
            <div key={entry.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem] flex items-center justify-between group hover:border-zinc-600 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${entry.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                   {entry.type === 'CREDIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                   <p className="text-xs font-black text-white">{entry.description}</p>
                   <p className="text-[9px] text-zinc-500 font-bold uppercase">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black tracking-tight ${entry.type === 'CREDIT' ? 'text-green-500' : 'text-white'}`}>
                  {entry.type === 'CREDIT' ? '+' : '-'}${entry.amount.toLocaleString()}
                </p>
                {entry.verifiedByAI && (
                  <div className="text-[7px] font-black text-blue-500 uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                    <ShieldCheck size={8} /> AI VERIFIED
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 text-center">
         <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
           BIZ ARENA Vault logic utilizes encrypted ledgers. No external merchant data is shared.
         </p>
      </div>
    </div>
  );
};

export default ArenaVault;
