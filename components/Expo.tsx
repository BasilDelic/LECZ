
import React, { useState, useRef, useEffect } from 'react';
import { ExpoSession, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { 
  Users, X, Heart, Share2, ShoppingCart, 
  Video, Mic, PhoneCall, Gift, ExternalLink, GraduationCap, Radio, 
  TrendingUp, Star, Award, Presentation, Download, MessageCircle, 
  VideoOff, MicOff, Maximize2, MessageSquare
} from 'lucide-react';

interface ExpoProps {
  session: ExpoSession;
  onClose: () => void;
}

const Expo: React.FC<ExpoProps> = ({ session, onClose }) => {
  const [likes, setLikes] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { user: 'SarahJ', text: 'Does it support 5G?' },
    { user: 'BizOwner', text: 'Is there a bulk discount for offices?' },
    { user: 'Affiliate_1', text: 'Ready for the training session!' },
  ]);
  const [input, setInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const featuredProduct = session.featuredProductId ? MOCK_PRODUCTS[session.featuredProductId] : null;

  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera access denied, showing mock feed");
      }
    };
    startStream();
    
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setChatMessages([...chatMessages, { user: 'You', text: input }]);
    setInput('');
  };

  const addLike = () => {
    setLikes(prev => prev + 1);
  };

  const getCategoryTheme = () => {
    switch (session.category) {
      case 'PRODUCT_MARKETING': return { label: 'MARKETING EXPO', icon: <TrendingUp size={12} />, color: 'bg-purple-600' };
      case 'PRODUCT_REVIEW': return { label: 'PRODUCT REVIEW', icon: <Star size={12} />, color: 'bg-amber-500' };
      case 'AFFILIATE_TRAINING': return { label: 'TRAINING SESSION', icon: <GraduationCap size={12} />, color: 'bg-blue-600' };
      case 'PRODUCT_LAUNCH': return { label: 'PRODUCT LAUNCH', icon: <Award size={12} />, color: 'bg-sky-600' };
      default: return { label: 'LIVE EXPO', icon: <Radio size={12} />, color: 'bg-red-600' };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Live Video Layer */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`h-full w-full object-cover transition-all duration-700 ${isCalling ? 'scale-110 blur-2xl opacity-30' : 'grayscale-[0.2]'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 p-4 flex justify-between items-start pt-12">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-500">
            <img src={session.hostAvatar} className="w-full h-full object-cover" alt={session.hostName} />
          </div>
          <div className="pr-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest leading-none text-white">{session.hostName}</h3>
            <p className="text-[9px] font-bold text-zinc-400 mt-1 flex items-center gap-1">
              <Users size={10} className="text-sky-500" /> {session.viewerCount.toLocaleString()} viewing
            </p>
          </div>
          <button className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/30 active:scale-95 transition-all">
            FOLLOW
          </button>
        </div>

        <button 
          onClick={onClose}
          className="p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 text-white hover:bg-black/60 transition-colors shadow-2xl"
        >
          <X size={20} />
        </button>
      </div>

      {/* Category Theme Badge */}
      {!isCalling && (
        <div className="relative z-10 px-4 mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-xl ${theme.color} text-white`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            {theme.label}
          </div>
          {session.category === 'AFFILIATE_TRAINING' && (
            <button 
              onClick={() => setShowResources(!showResources)}
              className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border border-white/10 text-white animate-bounce"
            >
              <Download size={12} />
              TRAINING ASSETS
            </button>
          )}
        </div>
      )}

      {/* Chat Area */}
      {!isCalling && (
        <div className="flex-1 relative z-10 flex flex-col justify-end p-4 pb-28 overflow-hidden pointer-events-none">
          <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar mask-gradient-top pointer-events-auto">
            {chatMessages.map((m, i) => (
              <div key={i} className="flex items-start gap-2 animate-in slide-in-from-left duration-300">
                <div className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/5 max-w-[85%] shadow-lg">
                  <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest mr-2">{m.user}:</span>
                  <span className="text-xs text-white/90 font-medium leading-relaxed">{m.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Product Spotlight */}
      {featuredProduct && !isCalling && (
        <div className="absolute bottom-24 left-4 right-4 z-20 animate-in slide-in-from-bottom duration-500">
           <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-4 rounded-[2.5rem] flex items-center gap-4 shadow-2xl relative overflow-hidden group border border-white/10 ring-1 ring-white/5">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-transparent opacity-50"></div>
              <div className="w-16 h-16 rounded-2xl bg-white shrink-0 shadow-lg overflow-hidden ring-1 ring-black/10">
                <img src={featuredProduct.image} className="w-full h-full object-cover" alt={featuredProduct.name} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-sky-400 uppercase tracking-[0.2em] mb-0.5 flex items-center gap-1">
                  <Award size={10} />
                  {session.category === 'PRODUCT_REVIEW' ? 'REVIEWED ITEM' : 'LIVE EXCLUSIVE'}
                </p>
                <h4 className="text-sm font-black text-white truncate">{featuredProduct.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tighter text-white">${featuredProduct.price}</span>
                  <span className="text-[10px] font-bold text-white/40 line-through">${(featuredProduct.price * 1.2).toFixed(2)}</span>
                </div>
              </div>
              <button className="bg-white text-black p-4 rounded-3xl shadow-2xl active:scale-95 transition-all hover:bg-sky-500 hover:text-white">
                <ShoppingCart size={20} strokeWidth={3} />
              </button>
           </div>
        </div>
      )}

      {/* Control Bar */}
      {!isCalling && (
        <div className="absolute bottom-6 left-4 right-4 z-30 flex items-center justify-between gap-3">
          <div className="flex-1 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center px-4 py-1 shadow-2xl">
            <input 
              type="text" 
              placeholder="Ask the business host..." 
              className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-white placeholder:text-white/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={addLike} className="text-sky-500 p-2 hover:scale-110 active:scale-90 transition-all">
              <Heart size={20} fill={likes > 0 ? "currentColor" : "none"} strokeWidth={likes > 0 ? 0 : 2} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsCalling(true)}
              className="p-4 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl text-white shadow-2xl active:scale-95 hover:bg-sky-500/20"
              title="Arena Meet Call"
            >
              <PhoneCall size={20} />
            </button>
            <button className="p-4 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl text-white shadow-2xl active:scale-95">
              <Share2 size={20} />
            </button>
            <button className="p-4 bg-sky-500 text-white rounded-3xl shadow-2xl shadow-sky-500/20 active:scale-95 hover:shadow-sky-500/40">
               <Gift size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Arena Meet Call Overlay - Modernized B2B/Affiliate Call UI */}
      {isCalling && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-3xl p-6 flex flex-col animate-in zoom-in duration-300">
           {/* Header of the Call */}
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                 <div className="bg-sky-500 p-2 rounded-xl">
                    <PhoneCall size={16} className="text-white" />
                 </div>
                 <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Arena Meet</h2>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">B2B Private Session</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">04:12</span>
                <button onClick={() => setIsCalling(false)} className="text-white/40 hover:text-white"><Maximize2 size={18} /></button>
              </div>
           </div>

           {/* Call Grid */}
           <div className="flex-1 grid grid-cols-1 gap-4 overflow-hidden mb-12">
              {/* Host Stream */}
              <div className="relative bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                    {session.hostName} (Host)
                 </div>
                 <div className="absolute top-4 right-4 flex gap-2">
                    <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10"><Mic size={14} className="text-white" /></div>
                    <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10"><Presentation size={14} className="text-white" /></div>
                 </div>
              </div>

              {/* Your Stream / Small View */}
              <div className="relative aspect-video bg-zinc-800 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl w-32 h-44 absolute bottom-32 right-10 ring-4 ring-black">
                 {!videoActive ? (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                       <VideoOff size={24} className="text-zinc-700" />
                    </div>
                 ) : (
                   <div className="w-full h-full bg-sky-500/20 flex items-center justify-center">
                     <Users size={32} className="text-sky-500 opacity-20" />
                   </div>
                 )}
                 <div className="absolute bottom-2 left-2 text-[8px] font-black uppercase text-white/60">You</div>
              </div>
           </div>

           {/* Call Controls */}
           <div className="flex justify-center items-center gap-6 pb-12">
              <button 
                onClick={() => setMicActive(!micActive)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl border ${micActive ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white text-black border-white'}`}
              >
                {micActive ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              
              <button 
                onClick={() => setIsCalling(false)}
                className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 active:scale-90 transition-all border border-red-400"
              >
                <X size={32} strokeWidth={3} />
              </button>

              <button 
                onClick={() => setVideoActive(!videoActive)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl border ${videoActive ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white text-black border-white'}`}
              >
                {videoActive ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
           </div>
           
           <div className="flex justify-center gap-8 mb-4">
              <button className="flex flex-col items-center gap-2 group">
                 <div className="p-3 bg-zinc-900 rounded-2xl group-hover:bg-zinc-800 transition-colors border border-zinc-800"><Presentation size={18} className="text-zinc-400" /></div>
                 <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Present</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                 <div className="p-3 bg-zinc-900 rounded-2xl group-hover:bg-zinc-800 transition-colors border border-zinc-800"><MessageSquare size={18} className="text-zinc-400" /></div>
                 <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">In-Call Chat</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                 <div className="p-3 bg-zinc-900 rounded-2xl group-hover:bg-zinc-800 transition-colors border border-zinc-800"><Users size={18} className="text-zinc-400" /></div>
                 <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Participants</span>
              </button>
           </div>

           <div className="flex items-center justify-center gap-2 text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em]">
             <Shield size={10} className="text-green-500" />
             End-to-End Encrypted B2B Session
           </div>
        </div>
      )}

      {/* Affiliate Training Resources Sheet */}
      {showResources && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-[#0a0a0a] rounded-t-[3rem] p-8 border-t border-white/10 animate-in slide-in-from-bottom duration-300 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="text-sky-500" />
                Training Portal
              </h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Resources for @{session.hostName} Affiliates</p>
            </div>
            <button onClick={() => setShowResources(false)} className="p-2 bg-zinc-900 rounded-full text-zinc-500"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 gap-4 pb-12">
            {[
              { title: 'Marketing Master Kit', type: 'PDF • 12MB', icon: <FileText size={18} className="text-red-400" /> },
              { title: 'HD B-Roll Content', type: 'ZIP • 420MB', icon: <Video className="text-blue-400" /> },
              { title: 'Affiliate Pitch Deck', type: 'PPT • 15MB', icon: <Presentation className="text-amber-400" /> },
              { title: 'Sample Audio Tracks', type: 'MP3 • 22MB', icon: <Music size={18} className="text-sky-400" /> }
            ].map((res, i) => (
              <div key={i} className="bg-zinc-900 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-zinc-800 transition-all border border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-black rounded-2xl group-hover:bg-zinc-900 transition-all">{res.icon}</div>
                  <div>
                    <h4 className="text-sm font-black text-white">{res.title}</h4>
                    <p className="text-[10px] font-bold text-zinc-500">{res.type}</p>
                  </div>
                </div>
                <button className="bg-white/5 p-3 rounded-2xl text-zinc-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-xl">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>

          <button 
            className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-95 transition-all mb-4"
          >
            <ExternalLink size={18} />
            OPEN AFFILIATE DASHBOARD
          </button>
        </div>
      )}
    </div>
  );
};

// Local component for FileText icon with required size prop
const Shield = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

// Local component for FileText icon with required size prop
const FileText = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

// Local component for Music icon with required size prop
const Music = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export default Expo;
