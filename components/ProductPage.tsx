
import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShieldCheck, Truck, ChevronRight, MessageSquare, ShoppingCart, Check, Package, Info, Rocket, Percent, Scale } from 'lucide-react';
import { MOCK_REVIEWS } from '../constants';
import CheckoutModal from './CheckoutModal';
import ArenaNegotiator from './ArenaNegotiator';

interface ProductPageProps {
  product: Product;
  onClose: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onClose }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showNegotiator, setShowNegotiator] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [negotiatedDeal, setNegotiatedDeal] = useState<{ price: number, qty: number } | null>(null);
  
  const reviews = MOCK_REVIEWS[product.id] || [];
  const currentVariantInfo = product.variantDetails?.[selectedVariant] || { 
    price: product.price, 
    stockStatus: 'In Stock' 
  };

  const isOutOfStock = currentVariantInfo.stockStatus.toLowerCase().includes('out of stock');
  const activePrice = negotiatedDeal ? negotiatedDeal.price : currentVariantInfo.price;

  const handleFinalizeNegotiation = (price: number, qty: number) => {
    setNegotiatedDeal({ price, qty });
    setShowNegotiator(false);
    setShowCheckout(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black animate-in slide-in-from-bottom duration-500 overflow-y-auto pb-32 no-scrollbar">
      {/* Top Banner */}
      <div className="relative aspect-square w-full bg-zinc-900 group">
        <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" alt={product.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-white hover:bg-black/80 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-6 -mt-10 relative z-10 space-y-8">
        {/* Header - Dynamic Price Section */}
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight leading-tight">{product.name}</h1>
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex text-sky-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(product.avgRating) ? "currentColor" : "none"} 
                      className={i >= Math.floor(product.avgRating) ? "opacity-30" : ""} 
                    />
                  ))}
                </div>
                <span className="text-zinc-500 font-bold">{product.avgRating} ({product.reviewCount})</span>
              </div>
            </div>
            <div className="text-right">
              {negotiatedDeal && (
                <div className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full mb-1 uppercase animate-pulse">
                  AI Negotiated Deal
                </div>
              )}
              <div className={`text-3xl font-black tracking-tight ${negotiatedDeal ? 'text-green-500' : 'text-sky-500'}`}>
                ${activePrice.toFixed(2)}
              </div>
              <div className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${isOutOfStock ? 'text-red-500' : 'text-green-400'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : negotiatedDeal ? `${negotiatedDeal.qty} UNITS` : currentVariantInfo.stockStatus}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Configuration</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button 
                  key={v} 
                  onClick={() => setSelectedVariant(v)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                    selectedVariant === v 
                    ? 'bg-white text-black border-white scale-105 shadow-lg' 
                    : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* B2B Negotiation Promo */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col gap-4 shadow-xl">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                 <Scale className="text-sky-500" size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Bulk Negotiation</h4>
                 <p className="text-[10px] text-zinc-500 font-bold leading-tight">Buying for your business? Start a real-time price haggle with our AI sales agent.</p>
              </div>
           </div>
           <button 
             onClick={() => setShowNegotiator(true)}
             className="w-full py-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:bg-zinc-700 transition-colors"
           >
              NEGOTIATE BULK PRICE
           </button>
        </div>

        {/* Protection Alert */}
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-start gap-3">
          <ShieldCheck size={20} className="text-green-500 shrink-0" />
          <div className="space-y-1">
            <h5 className="text-[11px] font-black text-green-500 uppercase">BA Verified Transaction</h5>
            <p className="text-[10px] text-zinc-400 leading-tight">Funds held in escrow. Payout to seller only after your delivery confirmation.</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3 px-2">
          <h3 className="font-black text-sm uppercase tracking-wider text-zinc-400">Specifications</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">{product.description}</p>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-4 left-4 right-4 flex gap-3 z-[110] max-w-md mx-auto">
        <button className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
          <MessageSquare size={24} />
        </button>
        <button 
          onClick={() => !isOutOfStock && setShowCheckout(true)} 
          disabled={isOutOfStock}
          className={`flex-1 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${
            isOutOfStock 
            ? 'bg-zinc-800 text-zinc-500' 
            : 'bg-sky-500 text-white shadow-sky-500/40'
          }`}
        >
          <ShoppingCart size={20} />
          {negotiatedDeal ? `BUY ${negotiatedDeal.qty} UNITS` : 'BUY NOW'}
        </button>
      </div>

      {showCheckout && (
        <CheckoutModal 
          product={{
            ...product,
            price: activePrice
          }} 
          onClose={() => setShowCheckout(false)} 
        />
      )}

      {showNegotiator && (
        <ArenaNegotiator 
          product={product} 
          onClose={() => setShowNegotiator(false)}
          onFinalize={handleFinalizeNegotiation}
        />
      )}
    </div>
  );
};

export default ProductPage;
