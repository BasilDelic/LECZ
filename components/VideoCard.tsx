
import React, { useState, useRef, useEffect } from 'react';
import { Video, UserRole } from '../types';
import { Heart, MessageCircle, Share2, ShoppingCart, UserPlus, Music, Volume2, VolumeX, Play, Check } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_SOUNDS } from '../constants';
import ProductPage from './ProductPage';
import VerificationBadge from './VerificationBadge';

interface VideoCardProps {
  video: Video;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isFollowing, onToggleFollow }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const product = MOCK_PRODUCTS[video.productId];
  const sound = MOCK_SOUNDS.find(s => s.id === video.soundId);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            }
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="h-full w-full relative bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full object-cover cursor-pointer"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
      />

      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/10 cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="bg-black/40 backdrop-blur-xl p-6 rounded-full border border-white/20 animate-in zoom-in duration-200">
            <Play size={48} fill="white" className="text-white ml-1" />
          </div>
        </div>
      )}

      <button 
        onClick={toggleMute}
        className="absolute top-20 right-4 p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 text-white z-20"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="absolute right-4 bottom-28 flex flex-col space-y-6 items-center z-20">
        <div className="relative mb-2">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-zinc-800 shadow-xl">
            <img src={video.sellerAvatar} alt={video.sellerName} className="w-full h-full object-cover" />
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFollow(); }}
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full p-1 shadow-lg ring-2 ring-black transition-all duration-300 transform ${isFollowing ? 'bg-white text-sky-500 scale-110' : 'bg-sky-500 text-white'}`}
          >
            {isFollowing ? <Check size={12} strokeWidth={4} /> : <UserPlus size={12} strokeWidth={3} />}
          </button>
        </div>
        
        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center group">
          <Heart size={32} fill={liked ? '#0ea5e9' : 'none'} className={liked ? 'text-sky-500' : 'text-white drop-shadow-md'} />
          <span className="text-[10px] mt-1 font-black uppercase tracking-tighter">{video.likes.toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center">
          <MessageCircle size={32} className="text-white drop-shadow-md" />
          <span className="text-[10px] mt-1 font-black uppercase tracking-tighter">{video.comments.toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center">
          <Share2 size={32} className="text-white drop-shadow-md" />
          <span className="text-[10px] mt-1 font-black uppercase tracking-tighter">{video.shares.toLocaleString()}</span>
        </button>

        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 p-2 animate-spin-slow flex items-center justify-center shadow-lg">
           <Music size={18} className="text-white" />
        </div>
      </div>

      <div className="absolute bottom-6 left-4 right-20 space-y-4 z-20 pointer-events-none">
        <div className="space-y-2 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="font-black text-lg tracking-tight shadow-black drop-shadow-md">@{video.sellerName}</span>
            <VerificationBadge role={video.sellerRole || UserRole.RETAILER} size={14} />
            {isFollowing && (
              <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest backdrop-blur-md border border-white/10">Following</span>
            )}
          </div>
          <p className="text-sm line-clamp-2 text-zinc-100 font-medium leading-snug drop-shadow-md">{video.caption}</p>
        </div>

        {product && (
          <div 
            onClick={() => setShowProduct(true)} 
            className="bg-white/10 backdrop-blur-2xl rounded-2xl p-3 flex items-center space-x-3 cursor-pointer border border-white/20 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl pointer-events-auto"
          >
            <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shadow-inner shrink-0">
              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-300 truncate">{product.name}</h4>
              <p className="text-sm font-black text-sky-400 tracking-tight">${product.price}</p>
            </div>
            <div className="bg-sky-500 p-2.5 rounded-xl shadow-lg shadow-sky-500/30 text-white">
              <ShoppingCart size={18} strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {showProduct && <ProductPage product={product} onClose={() => setShowProduct(false)} />}
    </div>
  );
};

export default VideoCard;
