
import React, { useState, useEffect } from 'react';
import VideoFeed from './components/VideoFeed';
import CreatorTools from './components/CreatorTools';
import SellerDashboard from './components/SellerDashboard';
import Profile from './components/Profile';
import MessagingSystem from './components/MessagingSystem';
import AdminDashboard from './components/AdminDashboard';
import AffiliateMarketplace from './components/AffiliateMarketplace';
import ExpoList from './components/ExpoList';
import BidsPage from './components/BidsPage';
import ArenaVault from './components/ArenaVault';
import PitchArena from './components/PitchArena';
import SearchOverlay from './components/SearchOverlay';
import Auth from './components/Auth';
import { User, UserRole } from './types';
import { MOCK_USER } from './constants';
import { Home, PlusSquare, User as UserIcon, MessageCircle, Shield, ShoppingBag, Radio, Gavel, Wallet, Rocket, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'messages' | 'create' | 'analytics' | 'profile' | 'admin' | 'partners' | 'expo' | 'bids' | 'vault' | 'pitch'>('feed');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      setFollowingIds(currentUser.followingIds || []);
      // If it's the first login, force them to the profile tab to complete profile
      if (isFirstLogin || !currentUser.isProfileComplete) {
        setActiveTab('profile');
      }
    }
  }, [currentUser, isFirstLogin]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleFollow = (id: string) => {
    setFollowingIds(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const handleLoginSuccess = (user: User, isNew: boolean) => {
    setIsFirstLogin(isNew);
    setCurrentUser(user);
  };

  // RBAC Helper
  const hasAccess = (tab: typeof activeTab) => {
    if (!currentUser) return false;
    const role = currentUser.role;
    switch (tab) {
      case 'admin': return role === UserRole.ADMIN || role === UserRole.OPS_ASSISTANT;
      case 'analytics': return [UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER, UserRole.ADMIN].includes(role);
      case 'create': return [UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER, UserRole.ADMIN].includes(role);
      case 'partners': return [UserRole.RETAILER, UserRole.CONSUMER, UserRole.ADMIN].includes(role);
      default: return true;
    }
  };

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'feed': return <VideoFeed followingIds={followingIds} onToggleFollow={toggleFollow} />;
      case 'messages': return <MessagingSystem />;
      case 'create': return <CreatorTools />;
      case 'analytics': return <SellerDashboard />;
      case 'profile': return <Profile theme={theme} onToggleTheme={toggleTheme} user={currentUser} onLogout={() => setCurrentUser(null)} initialEditMode={isFirstLogin} />;
      case 'admin': return <AdminDashboard />;
      case 'partners': return <AffiliateMarketplace />;
      case 'expo': return <ExpoList />;
      case 'bids': return <BidsPage />;
      case 'vault': return <ArenaVault />;
      case 'pitch': return <PitchArena />;
      default: return <VideoFeed followingIds={followingIds} onToggleFollow={toggleFollow} />;
    }
  };

  if (!currentUser) {
    return (
      <div className={theme}>
        <Auth onLogin={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className={`${theme} h-screen flex justify-center bg-zinc-200 dark:bg-zinc-950 transition-colors duration-500`}>
      <div className="flex flex-col h-full w-full max-w-md bg-white dark:bg-black text-black dark:text-white relative shadow-2xl overflow-hidden border-x border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
        
        <header className="absolute top-0 w-full z-50 flex justify-between items-center p-4 bg-gradient-to-b from-white/90 dark:from-black/90 to-transparent">
          <div className="flex space-x-4 text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-white/50 overflow-x-auto no-scrollbar pr-4">
            <button className={activeTab === 'feed' ? 'text-black dark:text-white border-b-2 border-sky-500 pb-1' : 'whitespace-nowrap'} onClick={() => setActiveTab('feed')}>ARENA</button>
            <button className={activeTab === 'pitch' ? 'text-black dark:text-white border-b-2 border-sky-500 pb-1' : 'whitespace-nowrap'} onClick={() => setActiveTab('pitch')}>PITCH</button>
            <button className={activeTab === 'expo' ? 'text-black dark:text-white border-b-2 border-sky-500 pb-1' : 'whitespace-nowrap'} onClick={() => setActiveTab('expo')}>EXPO</button>
            <button className={activeTab === 'bids' ? 'text-black dark:text-white border-b-2 border-sky-500 pb-1' : 'whitespace-nowrap'} onClick={() => setActiveTab('bids')}>BIDS</button>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 bg-black/5 dark:bg-white/5 rounded-full text-zinc-500 dark:text-white/70 hover:scale-110 active:scale-95 transition-all"
            >
              <Search size={18} />
            </button>
            <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-[10px] font-black italic shadow-lg">
              <ShoppingBag size={12} fill="currentColor" />
              BIZ ARENA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>

        <nav className="h-24 bg-white dark:bg-black border-t border-zinc-100 dark:border-white/5 flex items-center justify-around px-2 z-50 pb-6 transition-colors duration-500">
          <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center ${activeTab === 'feed' ? 'text-sky-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
            <Home size={22} strokeWidth={activeTab === 'feed' ? 3 : 2} />
            <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Home</span>
          </button>
          
          <button onClick={() => setActiveTab('vault')} className={`flex flex-col items-center ${activeTab === 'vault' ? 'text-sky-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
            <Wallet size={22} strokeWidth={activeTab === 'vault' ? 3 : 2} />
            <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Vault</span>
          </button>

          {hasAccess('create') ? (
            <button onClick={() => setActiveTab('create')} className="bg-black dark:bg-white rounded-3xl p-3.5 text-white dark:text-black hover:scale-110 active:scale-95 transition-all -mt-8 shadow-2xl ring-4 ring-white dark:ring-black">
              <PlusSquare size={28} strokeWidth={2.5} />
            </button>
          ) : (
            <button onClick={() => setActiveTab('pitch')} className={`flex flex-col items-center ${activeTab === 'pitch' ? 'text-sky-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
               <Rocket size={22} strokeWidth={activeTab === 'pitch' ? 3 : 2} />
               <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Pitch</span>
            </button>
          )}

          {hasAccess('analytics') ? (
            <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center ${activeTab === 'analytics' ? 'text-sky-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
              <Shield size={22} strokeWidth={activeTab === 'analytics' ? 3 : 2} />
              <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Biz</span>
            </button>
          ) : (
            <button onClick={() => setActiveTab('bids')} className={`flex flex-col items-center ${activeTab === 'bids' ? 'text-sky-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
              <Gavel size={22} strokeWidth={activeTab === 'bids' ? 3 : 2} />
              <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Bids</span>
            </button>
          )}
          
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-sky-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
            <UserIcon size={22} strokeWidth={activeTab === 'profile' ? 3 : 2} />
            <span className="text-[8px] mt-1 font-black uppercase tracking-widest">Me</span>
          </button>
        </nav>

        {isSearchOpen && (
          <SearchOverlay 
            onClose={() => setIsSearchOpen(false)}
            onNavigateToStore={(id) => { setIsSearchOpen(false); setActiveTab('profile'); }}
            onNavigateToProduct={(id) => { setIsSearchOpen(false); setActiveTab('feed'); }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
