
import React, { useState } from 'react';
import { MOCK_EXPO_SESSIONS, MOCK_USER, MOCK_PRODUCTS } from '../constants';
import { ExpoSession } from '../types';
import Expo from './Expo';
import { Radio, Users, RadioReceiver, PlusCircle, GraduationCap, TrendingUp, Star, X, ShoppingBag, LayoutGrid } from 'lucide-react';

const ExpoList: React.FC = () => {
  const [activeSession, setActiveSession] = useState<ExpoSession | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExpoTitle, setNewExpoTitle] = useState('');
  const [newExpoCategory, setNewExpoCategory] = useState<ExpoSession['category']>('PRODUCT_MARKETING');
  const [filter, setFilter] = useState<ExpoSession['category'] | 'ALL'>('ALL');

  const handleStartLive = () => {
    const session: ExpoSession = {
      id: `live_${Date.now()}`,
      hostId: MOCK_USER.id,
      hostName: MOCK_USER.displayName,
      hostAvatar: MOCK_USER.avatar,
      title: newExpoTitle || 'My Business Expo',
      viewerCount: 1,
      status: 'LIVE',
      category: newExpoCategory,
      featuredProductId: 'p1' // Default for mock
    };
    setActiveSession(session);
    setShowCreateModal(false);
  };

  const filteredSessions = filter === 'ALL' 
    ? MOCK_EXPO_SESSIONS 
    : MOCK_EXPO_SESSIONS.filter(s => s.category === filter);

  const getCategoryIcon = (category: ExpoSession['category']) => {
    switch (category) {
      case 'AFFILIATE_TRAINING': return <GraduationCap size={16} />;
      case 'PRODUCT_MARKETING': return <TrendingUp size={16} />;
      case 'PRODUCT_REVIEW': return <Star size={16} />;
      default: return <Radio size={16} />;
    }
  };

  const getCategoryColor = (category: ExpoSession['category']) => {
    switch (category) {
      case 'AFFILIATE_TRAINING': return 'bg-blue-600';
      case 'PRODUCT_MARKETING': return 'bg-purple-600';
      case 'PRODUCT_REVIEW': return 'bg-amber-500';
      case 'PRODUCT_LAUNCH': return 'bg-sky-600';
      default: return 'bg-red-600';
    }
  };

  return (
    <div className="h-full bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-6 no-scrollbar">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Radio className="text-sky-500 animate-pulse" />
            ARENA EXPO
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Connect live with top brands.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-sky-500/10 text-sky-500 p-2.5 rounded-2xl border border-sky-500/20 active:scale-95 transition-all shadow-lg"
        >
          <PlusCircle size={24} />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'ALL', label: 'All Arena', icon: <LayoutGrid size={14} /> },
          { id: 'PRODUCT_MARKETING', label: 'Marketing', icon: <TrendingUp size={14} /> },
          { id: 'AFFILIATE_TRAINING', label: 'Training', icon: <GraduationCap size={14} /> },
          { id: 'PRODUCT_REVIEW', label: 'Reviews', icon: <Star size={14} /> }
        ].map((btn) => (
          <button 
            key={btn.id}
            onClick={() => setFilter(btn.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              filter === btn.id 
              ? 'bg-white text-black border-white shadow-xl scale-105' 
              : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      {/* Featured Live Banner */}
      <div className="relative h-48 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 ring-1 ring-white/5">
        <img 
          src="https://picsum.photos/seed/expo_featured/800/400" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
          alt="Featured Expo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-600/30">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          HEADLINE EXPO
        </div>
        <div className="absolute bottom-6 left-6 right-6 space-y-1">
           <h3 className="text-xl font-black tracking-tight leading-none text-white">Global Partner Summit 2025</h3>
           <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2">
             <RadioReceiver size={12} className="text-sky-500" /> Featuring 12 High-Value Brands
           </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredSessions.map(session => (
          <div 
            key={session.id} 
            onClick={() => setActiveSession(session)}
            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden group cursor-pointer relative shadow-xl hover:border-sky-500/30 transition-all active:scale-[0.98]"
          >
            <div className="aspect-[3/4] relative">
              <img 
                src={session.hostAvatar} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                alt={session.hostName}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              <div className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-red-600/20">
                LIVE
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border border-white/5 shadow-xl">
                <Users size={10} className="text-sky-500" />
                {session.viewerCount}
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                 <div className={`w-fit px-2 py-0.5 rounded-md flex items-center gap-1 text-[7px] font-black uppercase tracking-tighter text-white mb-1 shadow-lg ${getCategoryColor(session.category)}`}>
                    {getCategoryIcon(session.category)}
                    {session.category.replace('_', ' ')}
                 </div>
                 <h4 className="text-[11px] font-black line-clamp-2 leading-tight uppercase tracking-tight text-white">{session.title}</h4>
                 <p className="text-[9px] text-zinc-400 font-bold">@{session.hostName}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Start Live Placeholder */}
        <div 
          onClick={() => setShowCreateModal(true)}
          className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[2rem] aspect-[3/4] flex flex-col items-center justify-center p-6 text-center space-y-4 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all cursor-pointer group shadow-xl"
        >
           <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-sky-500 group-hover:text-white group-hover:rotate-12 transition-all shadow-xl">
              <Radio size={32} />
           </div>
           <div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-300">START YOUR EXPO</h4>
             <p className="text-[9px] text-zinc-500 font-bold mt-2">Engage your audience live.</p>
           </div>
        </div>
      </div>

      {/* Create Expo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[3rem] p-8 space-y-8 shadow-2xl relative">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-white">Setup Your Expo</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Choose your broadcast style</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-2">Expo Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., UltraTab Pro Deep Dive"
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-zinc-700"
                    value={newExpoTitle}
                    onChange={(e) => setNewExpoTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-2">Broadcast Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'PRODUCT_MARKETING', label: 'Marketing', icon: <TrendingUp size={16} /> },
                      { id: 'PRODUCT_REVIEW', label: 'Review', icon: <Star size={16} /> },
                      { id: 'AFFILIATE_TRAINING', label: 'Training', icon: <GraduationCap size={16} /> },
                      { id: 'LIVE_SALE', label: 'Live Sale', icon: <ShoppingBag size={16} /> }
                    ].map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => setNewExpoCategory(cat.id as ExpoSession['category'])}
                        className={`p-5 rounded-[1.5rem] border flex flex-col items-center gap-3 transition-all ${
                          newExpoCategory === cat.id 
                          ? 'bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-500/30 scale-105' 
                          : 'bg-black/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        {cat.icon}
                        <span className="text-[10px] font-black uppercase tracking-tighter">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleStartLive}
                className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all hover:bg-sky-500 hover:text-white"
              >
                <Radio size={22} strokeWidth={3} />
                GO LIVE NOW
              </button>
           </div>
        </div>
      )}

      {activeSession && <Expo session={activeSession} onClose={() => setActiveSession(null)} />}
    </div>
  );
};

export default ExpoList;
