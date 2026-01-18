
import React, { useState } from 'react';
import { Product } from '../types';
import { X, CreditCard, ShieldCheck, Truck, ArrowRight, Check } from 'lucide-react';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  selectedVariant?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose, selectedVariant }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [variant, setVariant] = useState(selectedVariant || product.variants[0]);

  const currentPrice = product.variantDetails?.[variant]?.price || product.price;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end">
      <div className="bg-zinc-900 w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto border-t border-zinc-800 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">Escrow Checkout</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Safe & Secure Transaction</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-800 rounded-full text-zinc-400">
            <X size={20} />
          </button>
        </div>

        {step === 'details' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex space-x-5">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-white shadow-lg ring-4 ring-zinc-800 shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-black text-lg line-clamp-1">{product.name}</h3>
                <p className="text-sky-500 font-black text-2xl tracking-tight">${currentPrice.toFixed(2)}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase">
                  <Check size={10} className="text-green-500" strokeWidth={4} /> {variant}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm Configuration</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button 
                    key={v} 
                    onClick={() => setVariant(v)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                      variant === v 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-800/40 p-5 rounded-3xl space-y-4 border border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                   <ShieldCheck size={16} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-zinc-300">BA Escrow Protection</p>
                  <p className="text-[9px] text-zinc-500">Merchant is paid only after you confirm delivery.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                   <Truck size={16} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-zinc-300">Expedited Logistics</p>
                  <p className="text-[9px] text-zinc-500">Tracking code provided within 24 hours.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('payment')}
              className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all"
            >
              <span>Secure Payment</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-zinc-500">Order Subtotal</span>
                <span>${currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-zinc-500">Arena Shipping</span>
                <span className="text-green-400">INCLUDED</span>
              </div>
              <div className="flex justify-between font-black text-2xl pt-4 border-t border-white/10 text-white">
                <span>Total Due</span>
                <span className="text-sky-500">${currentPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  className="w-full bg-zinc-800 border-none rounded-3xl py-5 pl-14 pr-6 text-white font-bold text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 bg-zinc-800 border-none rounded-3xl py-5 px-6 text-white font-bold text-sm outline-none" />
                <input type="text" placeholder="CVC" className="w-1/2 bg-zinc-800 border-none rounded-3xl py-5 px-6 text-white font-bold text-sm outline-none" />
              </div>
            </div>

            <button 
              onClick={() => setStep('success')}
              className="w-full bg-sky-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-2xl shadow-sky-500/30 active:scale-95 transition-all"
            >
              <span>Confirm & Pay Now</span>
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <ShieldCheck size={56} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tight">Success!</h3>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto">Your funds are in escrow. The merchant is preparing your {variant} for shipment.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-zinc-800 text-white py-5 rounded-3xl font-black uppercase tracking-widest border border-zinc-700"
            >
              Return to Arena
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
