import React, { useState, useEffect } from 'react';
import { View, UserProfile } from './types.ts';
import Onboarding from './views/Onboarding.tsx';
import UserDashboard from './views/UserDashboard.tsx';
import QuickScan from './views/QuickScan.tsx';
import { Shield, Camera, ChevronRight } from 'lucide-react';
import { Badge } from './components/UI.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView('user_home');
  };

  return (
    <div className="app-root">
      <nav className="navbar hud-nav sticky-top py-3">
        <div className="container">
          <div className="d-flex align-items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => setView('landing')}>
            <div className="bg-info rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '40px', height: '40px' }}>
              <Shield size={20} color="black" />
            </div>
            <span className="fw-bold h5 mb-0 text-uppercase tracking-tighter" style={{ color: 'var(--text-main)' }}>NutriCoach</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {userProfile ? (
              <img 
                src={userProfile.avatarImages[0]} 
                className="rounded-circle border border-info" 
                style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setView('user_home')}
                alt="Avatar"
              />
            ) : (
              <button className="btn-initialize py-2 px-4" style={{ fontSize: '0.7rem' }} onClick={() => setView('onboarding')}>
                BIO-SYNC
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container py-5 mt-md-5">
        {view === 'landing' && (
          <div className="row justify-content-center text-center py-5">
            <div className="col-lg-9 col-xl-8">
              <Badge className="mb-4">SYSTEM READY v3.2</Badge>
              <h1 className="display-1 hero-title mb-4">
                BODY SCAN <span>IA COACH</span>
              </h1>
              <p className="lead mb-5 opacity-75 fw-medium mx-auto" style={{ maxWidth: '650px', color: 'var(--text-dim)' }}>
                Análisis biomecánico avanzado y optimización de protocolos mediante visión artificial de última generación.
              </p>
              
              <div className="d-flex flex-column flex-md-row justify-content-center gap-4">
                <button className="btn-initialize px-5 py-4" onClick={() => setView('onboarding')}>
                  INICIAR ESCANEO <ChevronRight size={20} className="ms-2" />
                </button>
                <button className="btn-tactical-outline px-5 py-4" onClick={() => setView('quick_scan')}>
                  <Camera size={20} className="me-2" /> ANALIZAR SUPLEMENTO
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'quick_scan' && <QuickScan onBack={() => setView('landing')} onUpgrade={() => setView('onboarding')} />}
        {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} onCancel={() => setView('landing')} />}
        {view === 'user_home' && userProfile && <UserDashboard profile={userProfile} setView={setView} isDarkMode={true} />}
      </main>

      <footer className="container py-5 mt-5 text-center border-top border-secondary border-opacity-10">
        <p className="small text-uppercase tracking-widest fw-bold opacity-25" style={{ color: 'var(--text-main)' }}>
          © 2025 NUTRI-COACH PRO // BIO-OPTIMIZATION HUB
        </p>
      </footer>
    </div>
  );
};

export default App;