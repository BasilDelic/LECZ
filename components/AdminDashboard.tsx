
import React from 'react';
import { Shield, Users, Video, AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="h-full bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black flex items-center gap-2"><Shield className="text-blue-500" /> Admin Ops</h2>
        <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20 flex items-center gap-1">
          <AlertTriangle size={12} /> 12 Urgent Reports
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Commission Rev</p>
          <div className="text-xl font-black mt-1">$42,910</div>
          <div className="text-green-500 text-[10px] font-bold">+18% this month</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">New Sellers</p>
          <div className="text-xl font-black mt-1">124</div>
          <div className="text-blue-500 text-[10px] font-bold">8 Pending Approval</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2"><Video size={16} /> Content Moderation Queue</h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4">
              <div className="w-16 h-24 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                <img src={`https://picsum.photos/seed/mod${i}/100/150`} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="text-xs font-bold text-zinc-300">Potential Copyright Infringement</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">Uploaded by @QuickMart • 12m ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-green-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"><CheckCircle size={12} /> Approve</button>
                  <button className="flex-1 py-2 bg-red-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"><XCircle size={12} /> Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2"><Users size={16} /> Dispute Resolution</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold">Case #88219 - Refund Dispute</span>
            <span className="text-zinc-500">2h ago</span>
          </div>
          <div className="p-3 bg-black rounded-xl text-[10px] text-zinc-400">
            "Buyer claims product arrived damaged. Seller refuses refund citing buyer negligence."
          </div>
          <button className="w-full py-2 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-lg">Assign Mediator</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
