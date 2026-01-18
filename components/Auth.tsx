
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Mail, Phone, User as UserIcon, Calendar, ArrowRight, ShieldCheck, Upload, MapPin, Loader2, Factory, Store, Users, ChevronLeft, ShoppingBag, Lock, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User, isNewUser: boolean) => void;
}

type AuthStep = 'LANDING' | 'LOGIN' | 'TYPE' | 'INFO_ORDINARY' | 'INFO_STORE' | 'DOCS' | 'LOCATION' | 'VERIFICATION_PENDING';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('LANDING');
  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    age: '',
    businessName: '',
    category: 'Electronics',
    regDoc: null as File | null,
  });

  const handleNext = () => {
    if (step === 'TYPE') {
      if (role === UserRole.CONSUMER) setStep('INFO_ORDINARY');
      else setStep('INFO_STORE');
    } else if (step === 'INFO_STORE') {
      if (role === UserRole.RETAILER) setStep('VERIFICATION_PENDING');
      else setStep('DOCS');
    } else if (step === 'DOCS') {
      setStep('LOCATION');
    } else if (step === 'LOCATION') {
      setStep('VERIFICATION_PENDING');
    } else if (step === 'INFO_ORDINARY') {
      setStep('VERIFICATION_PENDING');
    }
  };

  const validateLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          setIsLoading(false);
          handleNext();
        }, 1500);
      },
      (error) => {
        setIsLoading(false);
        alert("Location validation failed. Please enable GPS for business verification.");
      }
    );
  };

  const finalizeRegistration = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        username: formData.fullName.toLowerCase().replace(/\s/g, '_') || 'arena_user',
        displayName: role === UserRole.CONSUMER ? formData.fullName : (formData.businessName || formData.fullName),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar: `https://picsum.photos/seed/${formData.fullName || 'default'}/200`,
        role: role,
        gender: formData.gender,
        age: parseInt(formData.age) || 0,
        businessName: formData.businessName,
        isVerified: role === UserRole.CONSUMER,
        isEmailVerified: true,
        isProfileComplete: false, // Redirect to edit profile on first login
        walletBalance: 0,
        ledger: [],
        followingIds: [],
        followersCount: 0,
      };
      onLogin(newUser, true);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      alert("Please enter credentials");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Mock Login
      const existingUser: User = {
        id: 'u_existing',
        username: 'biz_explorer',
        displayName: 'Business Explorer',
        fullName: 'Explorer User',
        email: formData.email,
        phone: '+123456789',
        avatar: 'https://picsum.photos/seed/existing/200',
        role: UserRole.RETAILER,
        isVerified: true,
        isEmailVerified: true,
        isProfileComplete: true, // If they already logged in before
        walletBalance: 1200,
        ledger: [],
        followingIds: [],
        followersCount: 150,
      };
      onLogin(existingUser, false);
      setIsLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'LANDING':
        return (
          <div className="space-y-8 animate-in fade-in zoom-in duration-700 text-center">
            <div className="w-24 h-24 bg-sky-500 rounded-[2.5rem] mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-sky-500/30 transform rotate-12">
              <ShoppingBag size={48} className="text-white -rotate-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tighter text-black dark:text-white">BIZ ARENA</h1>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em]">The Future of Social Commerce</p>
            </div>
            <div className="space-y-4 pt-10">
              <button 
                onClick={() => setStep('LOGIN')}
                className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all"
              >
                Sign In
              </button>
              <button 
                onClick={() => setStep('TYPE')}
                className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-500/20 active:scale-95 transition-all"
              >
                Create Account
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Global Manufacturers • Wholesalers • Retailers</p>
          </div>
        );

      case 'LOGIN':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setStep('LANDING')} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
              <ChevronLeft size={16} /> BACK
            </button>
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter">WELCOME BACK</h2>
              <p className="text-zinc-500 text-sm font-medium">Access your BIZ ARENA dashboard</p>
            </div>
            <div className="space-y-4 pt-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="email"
                  placeholder="Email Address" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="password"
                  placeholder="Password" 
                  className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>
            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-2xl active:scale-95 disabled:opacity-50 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'SIGN IN TO ARENA'}
            </button>
            <div className="text-center">
              <button onClick={() => setStep('TYPE')} className="text-sky-500 text-[10px] font-black uppercase tracking-widest hover:underline">Don't have an account? Create one</button>
            </div>
          </div>
        );

      case 'TYPE':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setStep('LANDING')} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
              <ChevronLeft size={16} /> BACK
            </button>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black tracking-tighter">CHOOSE PATH</h1>
              <p className="text-zinc-500 text-sm font-medium">Select your account type</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { r: UserRole.CONSUMER, label: 'Ordinary Account', icon: <Users />, desc: 'Watch, buy, and follow brands' },
                { r: UserRole.RETAILER, label: 'Retailer Store', icon: <Store />, desc: 'Sell directly to consumers' },
                { r: UserRole.DISTRIBUTOR, label: 'Wholesale Distributor', icon: <ShieldCheck />, desc: 'Bulk supply for businesses' },
                { r: UserRole.MANUFACTURER, label: 'Manufacturer', icon: <Factory />, desc: 'Original brand production' }
              ].map((opt) => (
                <button
                  key={opt.r}
                  onClick={() => setRole(opt.r)}
                  className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${role === opt.r ? 'bg-sky-500/10 border-sky-500' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'}`}
                >
                  <div className={`p-3 rounded-2xl ${role === opt.r ? 'bg-sky-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                    {opt.icon}
                  </div>
                  <div>
                    <p className={`font-black text-sm uppercase tracking-widest ${role === opt.r ? 'text-sky-500' : 'text-zinc-500'}`}>{opt.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={handleNext} className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-2xl active:scale-95 mt-4">
              CONTINUE <ArrowRight size={18} />
            </button>
          </div>
        );

      case 'INFO_ORDINARY':
      case 'INFO_STORE':
        return (
          <div className="space-y-6 animate-in fade-in">
             <button onClick={() => setStep('TYPE')} className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
               <ChevronLeft size={16} /> BACK
             </button>
             <h2 className="text-2xl font-black uppercase tracking-tight">Profile Basics</h2>
             <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input placeholder="Full Name" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input placeholder="Email Address" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="password" placeholder="Set Password" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input placeholder="Phone Number" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>

                {step === 'INFO_ORDINARY' ? (
                  <div className="flex gap-3">
                    <select className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl outline-none font-bold text-sm text-zinc-400" onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option>Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input placeholder="Age" type="number" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input placeholder="Business Name" className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 font-bold text-sm" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                  </div>
                )}
             </div>
             <button onClick={handleNext} className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-2xl active:scale-95">
               {step === 'INFO_ORDINARY' || role === UserRole.RETAILER ? 'NEXT STEP' : 'STORE VERIFICATION'}
               <ArrowRight size={18} />
             </button>
          </div>
        );

      case 'DOCS':
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
             <h2 className="text-2xl font-black uppercase tracking-tight">Business Assets</h2>
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Required for {role}</p>
             
             <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto flex items-center justify-center text-zinc-400">
                   <Upload size={32} />
                </div>
                <div>
                   <p className="text-sm font-black uppercase">Registration Documents</p>
                   <p className="text-[10px] text-zinc-400 font-bold mt-1">Upload Business License (PDF/JPG)</p>
                </div>
                <input type="file" className="hidden" id="doc-upload" />
                <label htmlFor="doc-upload" className="inline-block py-3 px-8 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg">
                  Select File
                </label>
             </div>

             <button onClick={handleNext} className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-2xl">
               PROCEED TO LOCATION <ArrowRight size={18} />
             </button>
          </div>
        );

      case 'LOCATION':
        return (
          <div className="space-y-6 animate-in zoom-in text-center">
             <div className="w-24 h-24 bg-sky-500/10 rounded-full mx-auto flex items-center justify-center text-sky-500 relative">
                <MapPin size={48} />
                <div className="absolute inset-0 border-4 border-sky-500 rounded-full animate-ping opacity-20"></div>
             </div>
             <h2 className="text-2xl font-black uppercase tracking-tight">Site Validation</h2>
             <p className="text-zinc-500 text-xs font-bold leading-relaxed px-4">
               To ensure trust, we must validate the physical location of your factory or warehouse.
             </p>
             <button 
              onClick={validateLocation}
              disabled={isLoading}
              className="w-full py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
             >
               {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'VALIDATE SITE'}
             </button>
          </div>
        );

      case 'VERIFICATION_PENDING':
        return (
          <div className="space-y-8 animate-in zoom-in text-center">
             <div className="w-24 h-24 bg-green-500/10 rounded-full mx-auto flex items-center justify-center text-green-500 relative">
                <Mail size={48} />
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">Check Your Email</h2>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed px-4">
                  We've sent a verification link to <span className="text-sky-500">{formData.email || 'your email'}</span>. Please verify your account before signing in.
                </p>
             </div>
             <div className="space-y-4">
               <button 
                onClick={finalizeRegistration}
                className="w-full py-5 bg-green-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-2xl active:scale-95"
               >
                 I HAVE VERIFIED MY EMAIL
               </button>
               <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-sky-500 transition-colors">Resend Link</button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-white dark:bg-black p-8 flex flex-col justify-center overflow-y-auto no-scrollbar">
      <div className="w-full max-w-sm mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default Auth;
