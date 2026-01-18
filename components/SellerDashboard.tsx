
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Eye, ArrowUpRight, Rocket, Percent } from 'lucide-react';
import { MOCK_USER } from '../constants';

const DATA = [
  { name: 'Mon', views: 4000, sales: 2400, affiliate: 800 },
  { name: 'Tue', views: 3000, sales: 1398, affiliate: 900 },
  { name: 'Wed', views: 2000, sales: 9800, affiliate: 3200 },
  { name: 'Thu', views: 2780, sales: 3908, affiliate: 1200 },
  { name: 'Fri', views: 1890, sales: 4800, affiliate: 1500 },
  { name: 'Sat', views: 2390, sales: 3800, affiliate: 1100 },
  { name: 'Sun', views: 3490, sales: 4300, affiliate: 2100 },
];

const COLORS = ['#0ea5e9', '#0284c7', '#3b82f6', '#10b981'];

const SellerDashboard: React.FC = () => {
  return (
    <div className="h-full bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-6 no-scrollbar">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">Performance</h2>
        <div className="text-[10px] bg-zinc-900 px-3 py-1.5 rounded-full text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest">
          Live Arena Stats
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-wider">
            <DollarSign size={14} className="text-sky-500" />
            Total Sales
          </div>
          <div className="text-2xl font-black">${MOCK_USER.totalSales?.toLocaleString()}</div>
          <div className="flex items-center text-[10px] text-green-500 font-black uppercase">
            <ArrowUpRight size={12} strokeWidth={3} />
            12.4% Surge
          </div>
        </div>
        <div className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-wider">
            <Percent size={14} className="text-blue-400" />
            Partner Earnings
          </div>
          <div className="text-2xl font-black text-blue-400">${MOCK_USER.affiliateEarnings?.toLocaleString()}</div>
          <div className="flex items-center text-[10px] text-zinc-500 font-black uppercase">
            <Rocket size={12} className="text-blue-500" />
            Affiliate Power
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 space-y-6 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sales Attribution</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-sky-500"></div>
              <span className="text-[9px] font-black uppercase text-zinc-500">Direct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-[9px] font-black uppercase text-zinc-500">Affiliate</span>
            </div>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DATA}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} tickMargin={10} fontStyle="bold" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="affiliate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAff)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 space-y-4 shadow-xl">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Viral Traffic Sources</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA.slice(0, 4)}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} fontStyle="bold" />
              <Bar dataKey="views" radius={[12, 12, 0, 0]}>
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Recent Commissions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center font-black text-zinc-500 overflow-hidden">
                  <img src={`https://picsum.photos/seed/aff${i}/100`} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-tight">Referral Sale: Pro Keyboard</div>
                  <div className="text-[10px] text-zinc-500 font-bold">Via @ArenaCreator_{i}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-green-400">+$14.99</div>
                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">Settled</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
