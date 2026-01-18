
import React, { useState, useEffect, useRef } from 'react';
import { Auction, BidEntry, Product } from '../types';
import { MOCK_PRODUCTS, MOCK_USER } from '../constants';
import { 
  Gavel, X, Users, Wallet, Trophy, Clock, Send, ShieldCheck, 
  TrendingUp, AlertCircle, History, Heart, Share2, Music, 
  Maximize2, Volume2, VolumeX, Radio, Sparkles, ShoppingBag 
} from 'lucide-react';

interface BidRoomProps {
  auction: Auction;
  onClose: () => void;
}

const BidRoom: React.FC<BidRoomProps> = ({ auction, onClose }) => {
  const [currentHighest, setCurrentHighest] = useState<BidEntry | undefined>(auction.currentHighestBid);
  const [bids, setBids] = useState<BidEntry[]>(currentHighest ? [currentHighest] : []);
  const [bidAmount, setBidAmount] = useState((currentHighest?.amount || auction.startingPrice) + auction.minBidIncrement);
  const [timeLeft, setTimeLeft] = useState(2712);
  const [showHistory, setShowHistory] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [likes, setLikes] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const product = MOCK_PRODUCTS[auction.productId];

  useEffect(() => {
    // Mimic the Expo stream start
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.warn("Camera access for host feed denied, showing product visual instead");
      }
    };
    startStream();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handlePlaceBid = () => {
    if (bidAmount > MOCK_USER.walletBalance) {
      alert(`❌ ARENA CAPITAL ERROR: You need $${bidAmount.toLocaleString()} in your wallet to place this bid. Current balance: $${MOCK_USER.walletBalance.toLocaleString()}.`);
      return;
    }
    if (currentHighest && bidAmount <= currentHighest.amount) {
      alert(`⚠️ OUTBID ERROR: The current highest bid is $${currentHighest.amount.toLocaleString()}. Your bid must be higher.`);
      return;
    }

    const newBid: BidEntry = {
      id: Date.now().toString(),
      bidderId: MOCK_USER.id,
      bidderName: MOCK_USER.displayName,
      bidderAvatar: MOCK_USER.avatar,
      amount: bidAmount,
      timestamp: new Date().toISOString()
    };

    setCurrentHighest(newBid);
    setBids([newBid, ...bids]);
    // Auto-increment the slider for next potential bid
    setBidAmount(bidAmount + auction.minBidIncrement);
    
    // Aesthetic "Winning" sound mock or haptic would go here
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Immersive Background Feed (Like Expo) */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted={isMuted} 
          className="h-full w-full object-cover opacity-40 blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        {/* Particle Effect Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)]"></div>
      </div>

      {/* Header Overlay (Synced with Expo UI) */}
      <div className="relative z-10 p-4 flex justify-between items-start pt-12">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-500">
            <img src={auction.sellerAvatar} className="w-full h-full object-cover" alt={auction.sellerName} />
          </div>
          <div className="pr-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest leading-none text-white">{auction.sellerName}</h3>
            <p className="text-[9px] font-bold text-zinc-400 mt-1 flex items-center gap-1 uppercase">
              <Radio size={10} className="text-sky-500 animate-pulse" /> Live Bidding
            </p>
          </div>
          <button className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95">
            FOLLOW
          </button>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setIsMuted(!isMuted)}
             className="p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 text-white"
           >
             {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
           <button 
             onClick={onClose}
             className="p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 text-white"
           >
             <X size={20} />
           </button>
        </div>
      </div>

      {/* Auction Status Badges */}
      <div className="relative z-10 px-4 mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          <div className="bg-red-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-xl text-white">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            ARENA LIVE BID
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border border-white/10 text-white">
            <Users size={12} className="text-sky-500" />
            {auction.totalBids + bids.length} PARTICIPANTS
          </div>
      </div>

      {/* Main Focus Area: The Product & Current Bid */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
         {/* Immersive Product Showcase */}
         <div className="w-full max-w-xs aspect-square relative rounded-[3rem] overflow-hidden shadow-[0_0_60px_-15px_rgba(14,165,233,0.3)] border border-white/10 group">
            <img src={product.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            {/* Bid Ticker Overlay (Expo-style) */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
               <div className="space-y-4">
                  <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl animate-in zoom-in duration-500">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Highest Arena Bid</span>
                        <div className="flex items-center gap-1 text-[8px] font-black text-white/40 uppercase">
                           <Clock size={10} /> {formatTime(timeLeft)}
                        </div>
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tighter text-white">
                          ${currentHighest?.amount.toLocaleString() || auction.startingPrice}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">USD</span>
                     </div>
                  </div>
                  
                  {currentHighest && (
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/5 px-4 py-2 rounded-2xl animate-in slide-in-from-left">
                       <img src={currentHighest.bidderAvatar} className="w-6 h-6 rounded-full border border-sky-500" />
                       <p className="text-[9px] font-black uppercase tracking-widest text-white truncate">
                          Currently Leading: <span className="text-sky-500">@{currentHighest.bidderName}</span>
                       </p>
                       <Trophy size={12} className="ml-auto text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Interactive Control Panel (Matches Expo Layout) */}
      <div className="relative z-20 bg-[#070707]/90 backdrop-blur-3xl border-t border-white/10 p-8 pt-6 pb-14 rounded-t-[3.5rem] shadow-2xl space-y-8 ring-1 ring-white/5">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-500 shadow-inner">
                 <Wallet size={18} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">My Liquid Capital</span>
                 <span className="text-sm font-black text-white tracking-tight">${MOCK_USER.walletBalance.toLocaleString()}</span>
              </div>
           </div>
           
           <div className="flex gap-2">
             <button 
               onClick={() => setShowHistory(!showHistory)}
               className="p-4 bg-white/5 rounded-2xl border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-90"
             >
                <History size={20} />
             </button>
             <button className="p-4 bg-white/5 rounded-2xl border border-white/10 text-zinc-400 active:scale-90">
                <Share2 size={20} />
             </button>
           </div>
        </div>

        {/* The "MAKE BID" Action Core */}
        <div className="flex items-center gap-4">
           <div className="flex-1 bg-black rounded-[2rem] border border-zinc-800 p-2 flex items-center justify-between shadow-inner">
              <button 
                onClick={() => setBidAmount(Math.max(bidAmount - auction.minBidIncrement, (currentHighest?.amount || auction.startingPrice) + auction.minBidIncrement))}
                className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 active:scale-90 transition-all font-black"
              >
                -
              </button>
              <div className="text-center px-4">
                 <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">My Proposal</p>
                 <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black tracking-tighter text-white">${bidAmount.toLocaleString()}</span>
                 </div>
              </div>
              <button 
                onClick={() => setBidAmount(bidAmount + auction.minBidIncrement)}
                className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 active:scale-90 transition-all font-black"
              >
                +
              </button>
           </div>
           <button 
             onClick={handlePlaceBid}
             className="bg-sky-500 text-white p-6 rounded-3xl shadow-[0_15px_30px_-5px_rgba(14,165,233,0.4)] active:scale-95 transition-all hover:scale-105 group relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Sparkles size={24} className="animate-spin-slow" />
              </div>
              <Gavel size={32} strokeWidth={2.5} className="group-hover:rotate-45 transition-transform duration-300" />
           </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">
           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> ARENA VERIFIED</div>
           <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
           <div className="flex items-center gap-1.5"><TrendingUp size={14} className="text-sky-500" /> {bids.length} NEW BIDS</div>
        </div>
      </div>

      {/* Bid History Drawer (Expo-style full sheet) */}
      {showHistory && (
        <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-8 flex flex-col animate-in slide-in-from-bottom duration-500">
           <div className="flex justify-between items-center mb-10 mt-6">
              <div>
                <h3 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                   <History className="text-sky-500" />
                   ROOM HISTORY
                </h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tracking the flow of Arena Capital</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-4 bg-zinc-900 rounded-full text-zinc-500 border border-white/5"><X size={24} /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {bids.length > 0 ? bids.map((bid, i) => (
                <div key={bid.id} className="bg-zinc-900/50 border border-white/5 p-5 rounded-[2.5rem] flex items-center justify-between shadow-lg relative group overflow-hidden">
                   <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="flex items-center gap-4 relative">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 p-0.5">
                         <img src={bid.bidderAvatar} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                           @{bid.bidderName}
                           {i === 0 && <span className="bg-sky-500 text-[7px] font-black px-2 py-0.5 rounded-full">TOP</span>}
                         </p>
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                      </div>
                   </div>
                   <div className="text-right relative">
                      <p className={`text-xl font-black ${i === 0 ? 'text-sky-500' : 'text-white/60'}`}>${bid.amount.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{i === 0 ? 'CURRENT LEADER' : 'OUTBID'}</p>
                   </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50 space-y-4">
                   <Gavel size={64} />
                   <p className="text-xs font-black uppercase tracking-widest">No bids placed in this session yet.</p>
                </div>
              )}
           </div>

           <button 
             onClick={() => setShowHistory(false)}
             className="mt-8 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all"
           >
             CLOSE HISTORY
           </button>
        </div>
      )}
    </div>
  );
};

export default BidRoom;
