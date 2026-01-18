
import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Search, Percent, Rocket, Link2, CheckCircle2, Copy } from 'lucide-react';

const AffiliateMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedPrograms, setJoinedPrograms] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const products = Object.values(MOCK_PRODUCTS).filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = (id: string) => {
    setJoinedPrograms([...joinedPrograms, id]);
  };

  const copyLink = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Percent className="text-sky-500" />
          ARENA PARTNER
        </h2>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Monetize your content with verified products.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="Search for high-commission products..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-white shrink-0 shadow-lg">
                <img src={product.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase text-sky-500 tracking-tighter bg-sky-500/10 w-fit px-2 py-0.5 rounded-full mb-1">
                  {product.affiliateCommission}% Commission
                </span>
                <h3 className="font-black text-lg line-clamp-1">{product.name}</h3>
                <p className="text-xs text-zinc-500 font-bold">${product.price} MSRP</p>
                <div className="mt-2 text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1">
                  <Rocket size={10} /> Potential Earnings: ${(product.price * (product.affiliateCommission || 0) / 100).toFixed(2)}/sale
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {joinedPrograms.includes(product.id) ? (
                <>
                  <button 
                    onClick={() => copyLink(product.id)}
                    className="flex-1 bg-zinc-800 text-zinc-300 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-zinc-700 active:scale-95 transition-all"
                  >
                    {copiedId === product.id ? <CheckCircle2 size={14} className="text-green-500" /> : <Link2 size={14} />}
                    {copiedId === product.id ? 'LINK COPIED' : 'COPY AFFILIATE LINK'}
                  </button>
                  <button className="px-5 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all">
                    PROMOTE
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleJoin(product.id)}
                  className="w-full bg-white text-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                >
                  <Rocket size={14} />
                  JOIN AFFILIATE PROGRAM
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffiliateMarketplace;
