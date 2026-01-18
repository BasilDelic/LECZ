
import React, { useState, useEffect } from 'react';
import { Settings, Grid, Bookmark, Heart, MoreVertical, Edit2, Moon, Sun, ShieldCheck, ChevronRight, LogOut, Bell, Shield, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../types';
import VerificationBadge from './VerificationBadge';

interface ProfileProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  user: User;
  onLogout: () => void;
  initialEditMode?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ theme, onToggleTheme, user, onLogout, initialEditMode }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode || false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (initialEditMode) {
      setIsEditing(true);
    }
  }, [initialEditMode]);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
      setIsEditing(false);
    }, 2000);
  };

  return (
    <div className="h-full bg-white dark:bg-zinc-950 overflow-y-auto pb-24 transition-colors relative">
      {/* Edit Profile Overlay / Mode */}
      {isEditing && (
        <div className="absolute inset-0 z-40 bg-white dark:bg-black p-8 animate-in fade-in duration-500 overflow-y-auto pb-32">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                 <Edit2 className="text-sky-500" />
                 {initialEditMode ? 'Complete Your Arena Profile' : 'Edit Profile'}
               </h2>
               {!initialEditMode && <button onClick={() => setIsEditing(false)} className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>}
            </div>

            {initialEditMode && (
              <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl flex items-start gap-3">
                 <Sparkles size={20} className="text-sky-500 shrink-0" />
                 <p className="text-[10px] text-zinc-500 font-bold leading-tight">Welcome to the Arena! Complete these details to unlock full seller and buyer capabilities.</p>
              </div>
            )}

            <div className="space-y-6">
               <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-2 border-sky-500 flex items-center justify-center relative group">
                     <img src={user.avatar} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={24} className="text-white" />
                     </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">Change Avatar</p>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-2">Display Name</label>
                    <input defaultValue={user.displayName} className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-2">Bio / Tagline</label>
                    <textarea placeholder="Tell the Arena about your business..." className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm h-32" />
                  </div>
                  {user.role !== UserRole.CONSUMER && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest ml-2">Business Address</label>
                      <input placeholder="Physical Warehouse/Store Address" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm" />
                    </div>
                  )}
               </div>

               <button 
                onClick={handleSaveProfile}
                className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-2"
               >
                 {profileSaved ? <CheckCircle2 /> : 'Save Arena Profile'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Profile View */}
      <div className="relative h-40 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        <img src={`https://picsum.photos/seed/${user.id}bg/800/200`} className="w-full h-full object-cover opacity-50 grayscale" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-black dark:text-white"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="flex items-end justify-between mb-4">
          <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-zinc-950 overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-xl">
            <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-black dark:text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-black dark:text-white">{user.displayName}</h1>
            <VerificationBadge role={user.role} size={18} />
          </div>
          <p className="text-zinc-500 text-sm font-medium">@{user.username}</p>
        </div>

        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
          {user.role === UserRole.CONSUMER 
            ? `Arena Explorer. Loving the latest ${user.gender === 'female' ? 'fashion' : 'tech'} trends. Age: ${user.age}` 
            : `Premium ${user.role.toLowerCase()} on the Arena. Verified B2B partner.`}
        </p>

        <div className="flex gap-8 mt-6">
          <div className="text-center">
            <div className="font-black text-lg text-black dark:text-white">{user.followersCount.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-black text-lg text-black dark:text-white">{user.followingIds?.length || 0}</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Following</div>
          </div>
          <div className="text-center">
            <div className="font-black text-lg text-black dark:text-white">{(user.totalSales || 0) > 0 ? user.totalSales?.toLocaleString() : '0'}</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Orders</div>
          </div>
        </div>

        <div className="flex border-b border-zinc-100 dark:border-zinc-900 mt-8 mb-4">
          <button className="flex-1 py-3 text-sky-500 border-b-2 border-sky-500 flex justify-center">
            <Grid size={20} />
          </button>
          <button className="flex-1 py-3 text-zinc-400 flex justify-center hover:text-sky-500 transition-colors">
            <Bookmark size={20} />
          </button>
          <button className="flex-1 py-3 text-zinc-400 flex justify-center hover:text-sky-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 pb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative group">
              <img 
                src={`https://picsum.photos/seed/post${user.id}${i}/300/400`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[0.2]" 
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-black text-white drop-shadow-lg">
                <Heart size={10} fill="#0ea5e9" className="text-sky-500" />
                {Math.floor(Math.random() * 50)}K
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[200] bg-zinc-200/60 dark:bg-black/80 backdrop-blur-xl flex items-end animate-in fade-in duration-300">
           <div className="bg-white dark:bg-zinc-950 w-full max-w-md mx-auto rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase flex items-center gap-3">
                   <Settings className="text-sky-500" />
                   ARENA SETTINGS
                 </h2>
                 <button onClick={() => setShowSettings(false)} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500"><X size={20} /></button>
              </div>

              <div className="space-y-4 pb-12">
                 <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2rem] flex items-center justify-between border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-500">
                          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                       </div>
                       <div>
                          <p className="text-xs font-black text-black dark:text-white uppercase tracking-widest">Sky Blue Theme</p>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Current: {theme === 'dark' ? 'Dark' : 'Light'}</p>
                       </div>
                    </div>
                    <button 
                      onClick={onToggleTheme}
                      className="w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 relative transition-colors duration-300"
                    >
                       <div className={`w-6 h-6 bg-sky-500 rounded-full shadow-lg transition-all duration-300 transform ${theme === 'light' ? 'translate-x-0' : 'translate-x-6'}`}></div>
                    </button>
                 </div>

                 <SettingItem icon={<Bell size={18} />} title="Push Notifications" />
                 <SettingItem icon={<Shield size={18} />} title="Vault Security (Sentinel)" />
                 
                 <button onClick={onLogout} className="w-full p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                          <LogOut size={20} />
                       </div>
                       <p className="text-xs font-black text-red-500 uppercase tracking-widest">Terminate Session</p>
                    </div>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SettingItem = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <button className="w-full bg-zinc-50 dark:bg-zinc-900 p-6 rounded-[2rem] flex items-center justify-between border border-zinc-100 dark:border-zinc-800 group hover:border-sky-500/30 transition-all active:scale-[0.98]">
    <div className="flex items-center gap-4">
       <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-2xl text-zinc-500 group-hover:text-sky-500 transition-all">
          {icon}
       </div>
       <p className="text-xs font-black text-black dark:text-white uppercase tracking-widest">{title}</p>
    </div>
    <ChevronRight size={18} className="text-zinc-400 group-hover:text-sky-500 transition-colors" />
  </button>
);

const Upload = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default Profile;
