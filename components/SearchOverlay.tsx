
import React, { useState } from 'react';
import { Search, X, ShoppingBag, Store, ArrowRight, TrendingUp, History } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_STORES, MOCK_USER } from '../constants';

interface SearchOverlayProps {
  onClose: () => void;
  onNavigateToStore: (storeId: string) => void;
  onNavigateToProduct: (productId: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onNavigateToStore, onNavigateToProduct }) => {
  const [query, setQuery] = useState('');
  
  const filteredProducts = query.length > 1 ? Object.values(MOCK_PRODUCTS).filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const filteredStores = query.length > 1 ? MOCK_STORES.filter(s => 
    s.displayName.toLowerCase().includes(query.toLowerCase()) || 
    s.username.toLowerCase().includes(query.toLowerCase())
  ).concat(MOCK_USER.displayName.toLowerCase().includes(query.toLowerCase()) ? [MOCK_USER] : []) : [];

  return (
    <div className="fixed inset-0 z-[200] bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col">
      <div className="p-6 pt-12 flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input 
            autoFocus
            type="text"
            placeholder="Search Products or Stores..."
            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-6 text-black dark:text-white font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button onClick={onClose} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-zinc-500">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {query.length <= 1 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={14} /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Industrial Tablet', 'Solar Panels', 'Titan Store', 'Neural Link'].map(tag => (
                  <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-[10px] font-black uppercase text-zinc-500 hover:text-sky-500 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Trending Arenas
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {['Smart Logistics 2024', 'Bulk Electronics', 'Eco-Construction Materials'].map(topic => (
                  <div key={topic} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <span className="text-sm font-black text-black dark:text-white">{topic}</span>
                    <ArrowRight size={16} className="text-sky-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-300">
            {filteredStores.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">
                  <Store size={14} /> BIZ STORES ({filteredStores.length})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {filteredStores.map(store => (
                    <div 
                      key={store.id} 
                      onClick={() => onNavigateToStore(store.id)}
                      className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-sky-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <img src={store.avatar} className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <p className="text-sm font-black text-black dark:text-white">{store.displayName}</p>
                          <p className="text-[10px] font-bold text-zinc-500">@{store.username}</p>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-zinc-300 group-hover:text-sky-500 transition-all" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {filteredProducts.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag size={14} /> PRODUCTS ({filteredProducts.length})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id} 
                      onClick={() => onNavigateToProduct(product.id)}
                      className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-sky-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <p className="text-sm font-black text-black dark:text-white">{product.name}</p>
                          <p className="text-[10px] font-bold text-sky-500">${product.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-zinc-300 group-hover:text-sky-500 transition-all" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {filteredProducts.length === 0 && filteredStores.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                  <Search size={32} />
                </div>
                <p className="text-zinc-500 font-bold">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
