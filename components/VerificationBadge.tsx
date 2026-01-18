
import React from 'react';
import { UserRole } from '../types';
import { CheckCircle2, ShieldCheck, Factory, Store, Star } from 'lucide-react';

interface VerificationBadgeProps {
  role: UserRole;
  size?: number;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ role, size = 14 }) => {
  switch (role) {
    case UserRole.MANUFACTURER:
      return (
        <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded-full text-purple-400" title="Verified Manufacturer">
          <Factory size={size - 4} />
          <span className="text-[8px] font-black uppercase">MFG</span>
        </div>
      );
    case UserRole.DISTRIBUTOR:
      return (
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-full text-amber-400" title="Verified Wholesaler">
          <ShieldCheck size={size - 4} />
          <span className="text-[8px] font-black uppercase">WHOLE</span>
        </div>
      );
    case UserRole.RETAILER:
      return (
        <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded-full text-cyan-400" title="Verified Retailer">
          <Store size={size - 4} />
          <span className="text-[8px] font-black uppercase">RETAIL</span>
        </div>
      );
    case UserRole.ADMIN:
      return (
        <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 px-1.5 py-0.5 rounded-full text-red-400" title="Platform Administrator">
          <Star size={size - 4} />
          <span className="text-[8px] font-black uppercase">ROOT</span>
        </div>
      );
    default:
      return <CheckCircle2 size={size} className="text-sky-500 fill-sky-500/20" />;
  }
};

export default VerificationBadge;
