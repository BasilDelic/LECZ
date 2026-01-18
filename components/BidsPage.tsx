
import React, { useState } from 'react';
import { MOCK_AUCTIONS, MOCK_PRODUCTS, MOCK_USER } from '../constants';
import { Auction } from '../types';
import { Gavel, Clock, Users, ShieldAlert, Plus, Wallet, Trophy, ArrowRight, Lock, Unlock, Zap } from 'lucide-react';
import BidRoom from './BidRoom';

const BidsPage: React.FC = () => {
  const [activeAuction, setActiveAuction] = useState<Auction | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleJoinAuction = (auction: Auction) => {
    // 1. Restriction Check
    if (auction.type === 'RESTRICTED' && !auction.registeredUserIds.includes(MOCK_USER.id)) {
      alert(`⚠️ RESTRICTED BID: You must be pre-registered by @${auction.sellerName} to enter this arena.`);
      return;
    }
    
    // 2. Arena Wallet Threshold Check (MANDATORY REQUIREMENT)
    if (MOCK_USER.walletBalance < auction.startingPrice) {
      alert(`❌ INSUFFICIENT FUNDS: This bid requires a minimum Arena Wallet balance of $${auction.startingPrice.toLocaleString()}. Current balance: $${MOCK_USER.walletBalance.toLocaleString()}.`);
      return;
    }

    setActiveAuction(auction);
  };

  return (
    <div className="h-full bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-8 no-scrollbar">
      <div className="flex justify-between items-center pt-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black flex items-center gap-2 tracking-tighter">
            <Gavel className="text-sky-500" />
            THE ARENA BIDS
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">High-Stakes B2B Auctions</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-sky-500/10 text-sky-500 p-3 rounded-2xl border border-sky-500/20 active:scale-95 transition-all shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Wallet Status Card */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative">
          <div className="p-4 bg-sky-500/10 rounded-2xl text-sky-500 ring-1 ring-sky-500/20 shadow-inner">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Available Arena Capital</p>
            <p className="text-2xl font-black tracking-tight text-white">${MOCK_USER.walletBalance.toLocaleString()}</p>
          </div>
        </div>
        <button className="bg-white text-black text-[10px] font-black uppercase px-6 py-3 rounded-full tracking-widest shadow-xl active:scale-95 transition-all hover:bg-sky-500 hover:text-white">
          TOP UP
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500">Live & Hot</h3>
           <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 animate-pulse">
              <Zap size={10} className="text-red-500" />
              <span className="text-[9px] font-black text-red-500 uppercase">Real-time Trading</span>
           </div>
        </div>
        
        {MOCK_AUCTIONS.filter(a => a.status === 'LIVE').map(auction => {
          const product = MOCK_PRODUCTS[auction.productId];
          return (
            <div 
              key={auction.id}
              onClick={() => handleJoinAuction(auction)}
              className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden group cursor-pointer relative shadow-2xl active:scale-[0.98] transition-all hover:border-sky-500/30"
            >
              <div className="aspect-video relative">
                <img src={product.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="bg-red-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl border border-red-400">
                     <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                     LIVE ROOM
                   </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                  {auction.type === 'RESTRICTED' ? <Lock size={12} className="text-sky-500" /> : <Unlock size={12} className="text-green-500" />}
                  {auction.type}
                </div>

                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Starting Price</p>
                      <p className="text-xl font-black text-white">${auction.startingPrice.toLocaleString()}</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Active Bidders</p>
                      <div className="flex -space-x-2">
                         {[...Array(3)].map((_, i) => (
                           <img key={i} src={`https://picsum.photos/seed/bidder${i}/50`} className="w-6 h-6 rounded-full border-2 border-black object-cover" />
                         ))}
                         <div className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 text-[8px] font-black flex items-center justify-center">+12</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-7 space-y-6">
                <div>
                  <h4 className="text-xl font-black tracking-tighter uppercase leading-none mb-2">{product.name}</h4>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                        <img src={auction.sellerAvatar} className="w-full h-full object-cover" />
                     </div>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">@{auction.sellerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Top Bid</p>
                    <p className="text-lg font-black text-sky-500">${auction.currentHighestBid?.amount.toLocaleString() || auction.startingPrice}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Time Left</p>
                    <p className="text-lg font-black text-white font-mono">08:42:12</p>
                  </div>
                </div>

                <button className="w-full py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-2xl active:scale-95">
                  ENTER BIDDING ARENA
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Coming Soon</h3>
        {MOCK_AUCTIONS.filter(a => a.status === 'UPCOMING').map(auction => {
          const product = MOCK_PRODUCTS[auction.productId];
          const isRegistered = auction.registeredUserIds.includes(MOCK_USER.id);
          return (
            <div 
              key={auction.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-5 flex items-center gap-5 group opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-zinc-800 shadow-xl">
                <img src={product.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <h4 className="text-sm font-black truncate uppercase tracking-widest text-white">{product.name}</h4>
                <div className="flex flex-wrap gap-4 text-[9px] font-black text-zinc-500 uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-sky-500" /> TOMORROW 2PM</span>
                  <span className="flex items-center gap-1.5"><Trophy size={12} className="text-amber-500" /> START ${auction.startingPrice}</span>
                </div>
                <div className="flex gap-3 pt-1">
                   <button 
                     disabled={isRegistered}
                     className={`flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${isRegistered ? 'bg-zinc-800 text-green-500 border border-green-500/20' : 'bg-white text-black active:scale-95'}`}
                   >
                     {isRegistered ? 'REGISTERED' : 'JOIN REGISTRY'}
                   </button>
                   <button className="p-3 bg-zinc-800 rounded-2xl text-zinc-400 border border-zinc-700">
                     <ShieldAlert size={16} />
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeAuction && <BidRoom auction={activeAuction} onClose={() => setActiveAuction(null)} />}
    </div>
  );
};

export default BidsPage;
