
import React, { useState, useEffect } from 'react';
import { generateMarketingScript, generateProductMetadata, generateAdVideo } from '../services/gemini';
import { Sparkles, Video as VideoIcon, Type, FileText, Send, Loader2, Hash, Wand2, Scissors, Music, CheckCircle2, AlertCircle, ShoppingBag, Plus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

const CreatorTools: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [metadata, setMetadata] = useState<{ hashtags: string[], caption: string, musicSuggestions: string[] } | null>(null);
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);

  const handleStep1 = async () => {
    if (!productInfo) return;
    setIsLoading(true);
    setLoadingMsg('Analyzing product for Arena compatibility...');
    try {
      const result = await generateProductMetadata(productInfo);
      setMetadata(result);
      setActiveStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async () => {
    setIsLoading(true);
    setLoadingMsg('Crafting the perfect sales script...');
    try {
      const result = await generateMarketingScript(productInfo);
      setScript(result || '');
      setActiveStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3 = async () => {
    setIsLoading(true);
    try {
      const prompt = `Highly engaging promo for ${productInfo}. Focus on: ${script}`;
      const url = await generateAdVideo(prompt, (msg) => setLoadingMsg(msg));
      if (url) {
        setGeneratedVideo(url);
        setActiveStep(4);
      } else {
        alert("Failed to generate video. Please ensure you've selected a valid API key with billing enabled.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    setIsLoading(true);
    setLoadingMsg('Uploading to BIZ ARENA CDN...');
    setTimeout(() => {
      setIsLoading(false);
      setIsPublished(true);
    }, 2000);
  };

  const pickProduct = (id: string) => {
    const p = MOCK_PRODUCTS[id];
    setSelectedProduct(id);
    setProductInfo(p.description);
    setShowProductPicker(false);
  };

  if (isPublished) {
    return (
      <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black">CONGRATS!</h2>
        <p className="text-zinc-400">Your AI-generated promotion is now live in the Arena. Get ready for orders!</p>
        <button 
          onClick={() => {
            setIsPublished(false);
            setActiveStep(1);
            setProductInfo('');
            setGeneratedVideo(null);
            setSelectedProduct(null);
          }}
          className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest"
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-950 overflow-y-auto p-6 pb-24 space-y-8 no-scrollbar relative">
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin text-sky-500" size={64} strokeWidth={3} />
            <Sparkles className="absolute inset-0 m-auto text-white animate-pulse" size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-widest">Generating...</h3>
            <p className="text-zinc-400 text-sm italic h-10">{loadingMsg}</p>
          </div>
          <p className="text-[10px] text-zinc-600 font-bold uppercase mt-12 max-w-xs">
            Note: Veo generation can take a minute. Please keep this tab open for the best experience.
          </p>
        </div>
      )}

      <div className="space-y-1">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <Wand2 className="text-sky-500" />
          ARENA STUDIO
        </h2>
        <p className="text-zinc-500 text-xs font-medium">Powering your business with Gemini & Veo Intelligence.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-between items-center px-4 relative">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-900 -z-10"></div>
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
              activeStep >= step ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-zinc-900 text-zinc-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Step 1: Input */}
      {activeStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-2 text-zinc-300 font-bold text-sm">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-sky-500" />
              Promotion Target
            </div>
            <button 
              onClick={() => setShowProductPicker(true)}
              className="text-[10px] font-black uppercase tracking-widest text-sky-500 flex items-center gap-1 bg-sky-500/10 px-3 py-1.5 rounded-full border border-sky-500/20"
            >
              <ShoppingBag size={12} />
              Tag Partner Product
            </button>
          </div>

          {selectedProduct ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex items-center gap-4 relative animate-in zoom-in duration-200">
              <img src={MOCK_PRODUCTS[selectedProduct].image} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="flex-1">
                <h4 className="text-sm font-black">{MOCK_PRODUCTS[selectedProduct].name}</h4>
                <p className="text-[10px] font-bold text-sky-500 uppercase">{MOCK_PRODUCTS[selectedProduct].affiliateCommission}% Partner Commission</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1.5 border border-zinc-700">
                <Plus size={14} className="rotate-45" />
              </button>
            </div>
          ) : (
            <textarea
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
              placeholder="Describe your product value... (e.g. Premium wireless headphones with active noise cancellation, 40h battery life...)"
              className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-zinc-700"
            />
          )}

          <button
            onClick={handleStep1}
            disabled={isLoading || (!productInfo && !selectedProduct)}
            className="w-full py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95"
          >
            <Sparkles size={18} />
            GENERATE ARENA METADATA
          </button>

          {/* Product Picker Modal */}
          {showProductPicker && (
            <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md p-6 flex items-center justify-center">
              <div className="bg-zinc-900 w-full max-w-sm rounded-[2.5rem] border border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="font-black text-lg">Your Partner List</h3>
                  <button onClick={() => setShowProductPicker(false)}><Plus className="rotate-45" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {Object.values(MOCK_PRODUCTS).map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => pickProduct(p.id)}
                      className="bg-black/40 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-sky-500/50 transition-colors"
                    >
                      <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-black">{p.name}</p>
                        <p className="text-[9px] text-sky-500 font-bold uppercase">{p.affiliateCommission}% Earn</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Metadata & Captions */}
      {activeStep === 2 && metadata && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm uppercase tracking-wider text-[10px]">
              <Type size={14} className="text-sky-500" />
              Proposed Caption
            </div>
            <div className="bg-zinc-900 p-5 rounded-3xl text-sm italic text-zinc-300 border border-zinc-800 shadow-inner">
              "{metadata.caption}"
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm uppercase tracking-wider text-[10px]">
              <Hash size={14} className="text-sky-500" />
              Strategic Hashtags
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.hashtags.map(h => (
                <span key={h} className="px-4 py-2 bg-zinc-900 rounded-2xl text-[10px] font-black text-sky-400 border border-sky-500/20">
                  {h}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleStep2}
            disabled={isLoading}
            className="w-full py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Sparkles size={18} />
            CONTINUE TO SCRIPTING
          </button>
        </div>
      )}

      {/* Step 3: Script Review */}
      {activeStep === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm uppercase tracking-wider text-[10px]">
            <Scissors size={14} className="text-sky-500" />
            AI Commercial Script
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-xs font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto custom-scrollbar shadow-inner">
            {script}
          </div>
          <div className="bg-blue-500/10 p-4 rounded-2xl flex items-start gap-3 border border-blue-500/20">
            <AlertCircle size={20} className="text-blue-500 shrink-0" />
            <p className="text-[10px] text-zinc-400 leading-tight">
              Ready to generate? You must have a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-500 underline">paid API key</a> selected for Veo video generation.
            </p>
          </div>
          <button
            onClick={handleStep3}
            disabled={isLoading}
            className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-sky-500/30 transition-transform active:scale-95"
          >
            <VideoIcon size={18} />
            GENERATE VEO PROMOTION
          </button>
        </div>
      )}

      {/* Step 4: Video Preview */}
      {activeStep === 4 && generatedVideo && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-12">
          <div className="aspect-[9/16] bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative ring-4 ring-zinc-900">
            <video src={generatedVideo} className="w-full h-full object-cover" controls autoPlay loop muted />
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
              <Sparkles size={12} className="text-sky-500 animate-pulse" />
              VEo AI PRODUCTION
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveStep(1)}
              className="flex-1 py-4 bg-zinc-900 text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-zinc-800"
            >
              Restart
            </button>
            <button 
              onClick={handlePublish}
              className="flex-[2] py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-white/10"
            >
              <Send size={18} />
              PUBLISH TO ARENA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorTools;
