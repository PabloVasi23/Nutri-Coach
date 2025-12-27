
import React, { useState, useEffect } from 'react';
import { View, UserProfile } from './types';
import Onboarding from './views/Onboarding';
import UserDashboard from './views/UserDashboard';
import QuickScan from './views/QuickScan';
import AdminVerification from './views/AdminVerification';
import AdminDashboard from './views/AdminDashboard';
import { Shield, User, BarChart3, Settings, LogOut, Beaker, Globe, Camera, Zap, ChevronRight, Sun, Moon } from 'lucide-react';
import { Card, Button, Badge } from './components/UI';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView('user_home');
  };

  const navItems = [
    { id: 'user_home', label: 'Protocolo', icon: Beaker, hide: !userProfile },
    { id: 'admin_verification', label: 'Verificación', icon: Shield },
    { id: 'admin_dashboard', label: 'Analíticas', icon: BarChart3 },
    { id: 'calculators', label: 'Herramientas', icon: Settings },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 ${isDarkMode ? 'bg-[#080a0f] text-slate-300' : 'bg-[#f4f7fa] text-slate-700'}`}>
      {/* HUD Navigation */}
      <nav className={`backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950/80 border-slate-800/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-10">
              <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
                <div className="bg-cyan-500 p-1.5 rounded-lg text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform">
                  <Shield size={20} strokeWidth={3} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className={`font-black text-xl tracking-tighter uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>NutriCoach</span>
                  <span className="text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase">Pro Systems</span>
                </div>
              </div>
              
              <div className="hidden md:flex gap-2">
                {navItems.map(item => !item.hide && (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as View)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === item.id 
                      ? (isDarkMode ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-cyan-500 text-white shadow-md') 
                      : (isDarkMode ? 'text-slate-500 hover:text-white hover:bg-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100')}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Switcher */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {userProfile && (
                <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                   <Globe size={14} className="text-cyan-500" />
                   <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{userProfile.language}</span>
                </div>
              )}
              
              <button className={`transition-colors ${isDarkMode ? 'text-slate-600 hover:text-rose-500' : 'text-slate-400 hover:text-rose-600'}`} onClick={() => { setView('landing'); setUserProfile(null); }}>
                <LogOut size={18} />
              </button>
              
              <div className={`h-9 w-9 rounded-xl border flex items-center justify-center font-black text-xs shadow-inner overflow-hidden uppercase transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-cyan-600 shadow-sm'}`}>
                {userProfile?.name ? userProfile.name.charAt(0) : <User size={16} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Background Effect */}
      <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000 overflow-hidden">
         <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] ${isDarkMode ? 'opacity-20' : 'opacity-5'}`} />
         <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDarkMode ? 'from-[#080a0f]' : 'from-[#f4f7fa]'}`} />
      </div>

      {/* Content */}
      <main className="flex-grow relative z-10">
        {view === 'landing' && (
          <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
            <header className="text-center mb-16 animate-in fade-in zoom-in-95 duration-1000">
              <div className="mb-4">
                <Badge color="cyan">Version 2.5 Advanced</Badge>
              </div>
              <h1 className={`text-7xl md:text-8xl font-black tracking-tighter uppercase italic leading-none transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Bio Identity <span className="text-cyan-500">Access</span>
              </h1>
              <p className={`text-xl max-w-2xl mx-auto mt-10 font-medium leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                Integra tu biología con los sistemas más avanzados de suplementación deportiva y bio-hacking nutricional.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
              <Card 
                className={`group cursor-pointer transition-all duration-500 p-12 relative overflow-hidden ${isDarkMode ? 'hover:border-cyan-500/50 bg-slate-950/40' : 'hover:border-cyan-500 bg-white shadow-xl'}`}
                onClick={() => setView('onboarding')}
              >
                <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                   <Shield size={120} />
                </div>
                <div className="mb-10 w-20 h-20 bg-cyan-500 rounded-3xl flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                   <Zap size={40} strokeWidth={2.5} />
                </div>
                <h2 className={`text-4xl font-black uppercase italic tracking-tighter mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bio-Identity Scan</h2>
                <p className={`text-sm leading-relaxed mb-10 font-medium transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                  Perfil completo, análisis de grasa corporal por IA visual y plan nutricional regional personalizado.
                </p>
                <div className="flex items-center gap-3 text-cyan-400 font-black uppercase text-[10px] tracking-[0.4em] group-hover:translate-x-3 transition-transform">
                  Comenzar Protocolo <ChevronRight size={18} />
                </div>
              </Card>

              <Card 
                className={`group cursor-pointer transition-all duration-500 p-12 relative overflow-hidden ${isDarkMode ? 'hover:border-indigo-500/50 bg-slate-950/40' : 'hover:border-indigo-500 bg-white shadow-xl'}`}
                onClick={() => setView('quick_scan')}
              >
                <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                   <Camera size={120} />
                </div>
                <div className="mb-10 w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                   <Camera size={40} strokeWidth={2.5} />
                </div>
                <h2 className={`text-4xl font-black uppercase italic tracking-tighter mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fast Supp Scan</h2>
                <p className={`text-sm leading-relaxed mb-10 font-medium transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                  Identificación inmediata de suplementos por foto. Recibe protocolos de timing y dosis en segundos.
                </p>
                <div className="flex items-center gap-3 text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] group-hover:translate-x-3 transition-transform">
                  Acceso a Cámara <ChevronRight size={18} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {view === 'quick_scan' && <QuickScan onBack={() => setView('landing')} onUpgrade={() => setView('onboarding')} />}
        {view === 'onboarding' && (
          <Onboarding 
            onComplete={handleOnboardingComplete} 
            onCancel={() => setView('landing')} 
          />
        )}
        {view === 'user_home' && userProfile && <UserDashboard profile={userProfile} setView={setView} isDarkMode={isDarkMode} />}
        {view === 'admin_verification' && <AdminVerification />}
        {view === 'admin_dashboard' && <AdminDashboard />}
        
        {view === 'calculators' && (
          <div className="max-w-xl mx-auto py-32 text-center px-4">
             <div className="relative inline-block mb-10">
               <Settings size={80} className={`${isDarkMode ? 'text-slate-800' : 'text-slate-200'} animate-spin-slow opacity-20`} />
               <Beaker size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500" />
             </div>
             <h2 className={`text-4xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tools Hub / Under Construction</h2>
             <p className={`text-sm mt-6 leading-relaxed uppercase tracking-[0.3em] font-black ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                Neural calculators for professional bio-hacking being calibrated.
             </p>
             <Button variant="outline" className="mt-12" onClick={() => setView('landing')}>Volver al Panel</Button>
          </div>
        )}
      </main>

      <footer className={`border-t py-16 relative z-10 transition-colors ${isDarkMode ? 'bg-slate-950/80 border-slate-900' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2">
            <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
               <Shield size={16} className={isDarkMode ? 'text-cyan-900' : 'text-cyan-200'} /> AES-256 Science Verified Ecosystem
            </div>
            <p className="text-slate-700 text-[9px] uppercase tracking-widest">© 2024 NutriCoach Systems. All Rights Reserved.</p>
          </div>
          <div className={`flex gap-10 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Safety</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Neural Hub</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .cyber-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .cyber-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .cyber-scroll::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#1e293b' : '#e2e8f0'};
          border-radius: 10px;
        }
        .cyber-scroll::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default App;
