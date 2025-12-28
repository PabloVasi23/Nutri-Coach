
import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../components/UI.tsx';
import { UserProfile, Supplement } from '../types.ts';
import { geminiService } from '../services/gemini.ts';
import ChatWidget from '../components/ChatWidget.tsx';
import { 
  Activity, Zap, ShoppingCart, Utensils, 
  TrendingUp, FileText, Target, MapPin, Sparkles
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  setView: (v: any) => void;
  isDarkMode: boolean;
}

const UserDashboard: React.FC<Props> = ({ profile }) => {
  const [protocol, setProtocol] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const data = await geminiService.generateProtocol(profile);
        setProtocol(data || []);
      } catch (err) {
        console.error("Error fetching protocol:", err);
        setProtocol([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProtocol();
  }, [profile]);

  const handleDownloadReport = () => {
    const date = new Date().toLocaleDateString();
    const reportContent = `
=========================================
      NUTRI-COACH PRO BIO-REPORT
=========================================
FECHA: ${date}
OPERATIVO: ${profile.name}
OBJETIVO: ${profile.goal}
=========================================

1. STACK RECOMENDADO
${(protocol || []).map(s => `• ${s.name}: ${s.dose} (${s.timing})`).join('\n')}

2. ENTRENAMIENTO
${(profile.physiqueAnalysis?.aestheticExercises || []).map(ex => `• ${ex.name}: ${ex.sets} - Foco: ${ex.focus}`).join('\n')}

3. NUTRICIÓN
- Desayuno: ${profile.physiqueAnalysis?.suggestedDiet?.breakfast || 'N/A'}
- Almuerzo: ${profile.physiqueAnalysis?.suggestedDiet?.lunch || 'N/A'}
- Cena: ${profile.physiqueAnalysis?.suggestedDiet?.dinner || 'N/A'}

=========================================
    `;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_${profile.name.replace(/\s+/g, '_')}.txt`;
    link.click();
  };

  const handleWhatsAppKit = () => {
    const message = `Hola! Soy ${profile.name} y quiero mi kit personalizado: ${(protocol || []).map(s => s.name).join(', ')}.`;
    window.open(`https://wa.me/3816284867?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center min-vh-100">
        <div className="spinner-border text-info mb-3" style={{width: '3rem', height: '3rem'}} role="status"></div>
        <div className="text-tactical text-info h5 fw-black tracking-widest uppercase animate-pulse">Sincronizando Protocolo Alpha...</div>
        <p className="text-dim small mt-2 opacity-50 uppercase">Calculando biodisponibilidad de nutrientes</p>
      </div>
    );
  }

  return (
    <div className="container py-3 animate-in fade-in">
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-8">
           <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-info text-dark fw-black uppercase px-3 py-1" style={{fontSize: '0.6rem', borderRadius: '4px'}}>PERFIL: ACTIVO</span>
           </div>
           <h1 className="display-5 fw-black text-white text-uppercase italic text-tactical mb-2">
             CMD. <span style={{ color: 'var(--cyan-primary)' }}>{profile.name}</span>
           </h1>
           <div className="d-flex flex-wrap gap-2 mt-3">
              <div className="d-flex align-items-center gap-2 px-3 py-1 bg-white bg-opacity-05 border border-secondary border-opacity-20 rounded-pill">
                 <MapPin size={12} className="text-info" />
                 <span className="text-dim fw-bold small uppercase" style={{fontSize: '0.65rem'}}>{profile.region}</span>
              </div>
              <div className="d-flex align-items-center gap-2 px-3 py-1 bg-white bg-opacity-05 border border-info border-opacity-20 rounded-pill">
                 <Target size={12} className="text-info" />
                 <span className="text-info fw-bold small uppercase" style={{fontSize: '0.65rem'}}>{profile.goal}</span>
              </div>
           </div>
        </div>
        <div className="col-12 col-md-4 d-flex flex-column gap-3 justify-content-center">
           <Button variant="cyan" onClick={handleWhatsAppKit}>ADQUIRIR KIT COMPLETO</Button>
           <Button variant="outline" onClick={handleDownloadReport}>DESCARGAR REPORTE TXT</Button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="position-relative overflow-hidden rounded-5 shadow-lg mb-4" style={{ height: '450px', border: '1px solid var(--border-glass)', background: '#000' }}>
            {profile.avatarImages?.[0] ? (
              <img src={profile.avatarImages[0]} className="w-100 h-100 object-fit-cover" alt="Avatar" />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-dim">Sin Imagen</div>
            )}
            <div className="position-absolute top-0 start-0 p-4">
              <div className="bg-black bg-opacity-70 px-3 py-1 rounded-pill border border-info border-opacity-30 d-flex align-items-center gap-2">
                <Sparkles size={14} className="text-info" />
                <span className="text-white fw-black small uppercase tracking-tighter" style={{fontSize: '0.6rem'}}>Bio-Vision Engine v2</span>
              </div>
            </div>
            <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-black to-transparent">
              <h2 className="display-4 fw-black text-white text-tactical mb-0">{profile.physiqueAnalysis?.estimatedBodyFat || '--'}%</h2>
              <p className="text-info fw-black small uppercase mb-0">Estimación de Grasa Corporal</p>
            </div>
          </div>
          
          <div className="onboarding-card p-4">
             <div className="d-flex align-items-center gap-2 mb-3 text-info">
                <Activity size={20} />
                <h6 className="fw-black mb-0 uppercase tracking-widest small">VALORACIÓN DEL COACH</h6>
             </div>
             <p className="text-coach-assessment small italic lh-base mb-0 fw-medium">
               "{profile.physiqueAnalysis?.assessment || 'No se pudo generar valoración.'}"
             </p>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="onboarding-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <Zap className="text-info" size={24} />
                <h3 className="h6 text-white fw-black uppercase mb-0">STACK RECOMENDADO</h3>
              </div>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 px-2 py-1" style={{fontSize: '0.5rem'}}>VERIFICADO IA</span>
            </div>
            
            <div className="row g-2">
              {protocol.length > 0 ? protocol.map((supp, i) => (
                <div key={i} className="col-12 col-sm-6">
                  <div className="exercise-row h-100 m-0">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="text-white fw-black uppercase mb-0" style={{fontSize: '0.8rem'}}>{supp.name}</h4>
                      <span className="badge-tactical" style={{fontSize: '0.55rem', padding: '2px 8px'}}>L-{supp.evidenceLevel}</span>
                    </div>
                    <div className="text-white fw-bold mb-1" style={{fontSize: '0.65rem'}}>Dosis: {supp.dose}</div>
                    <div className="text-white small opacity-90" style={{fontSize: '0.6rem'}}>{supp.timing}</div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-4 opacity-50">Cargando protocolo inteligente...</div>
              )}
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
               <div className="onboarding-card p-4 h-100">
                  <div className="d-flex align-items-center gap-2 mb-4">
                     <Utensils size={18} className="text-info" />
                     <h4 className="small text-white fw-black uppercase mb-0">NUTRICIÓN DIARIA</h4>
                  </div>
                  {['Desayuno', 'Almuerzo', 'Cena'].map((m, idx) => {
                    const mealType = idx === 0 ? 'breakfast' : idx === 1 ? 'lunch' : 'dinner';
                    const mealContent = profile.physiqueAnalysis?.suggestedDiet?.[mealType as keyof typeof profile.physiqueAnalysis.suggestedDiet];
                    return (
                      <div key={m} className="exercise-row">
                         <div className="text-info fw-black uppercase mb-1" style={{fontSize: '0.6rem'}}>{m}</div>
                         <div className="text-white small fw-medium" style={{fontSize: '0.75rem'}}>
                            {mealContent || 'Planificando...'}
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="col-12 col-md-6">
               <div className="onboarding-card p-4 h-100">
                  <div className="d-flex align-items-center gap-2 mb-4">
                     <TrendingUp size={18} className="text-info" />
                     <h4 className="small text-white fw-black uppercase mb-0">RUTINA ESTÉTICA</h4>
                  </div>
                  {(profile.physiqueAnalysis?.aestheticExercises || []).length > 0 ? profile.physiqueAnalysis?.aestheticExercises.map((ex, i) => (
                    <div key={i} className="exercise-row">
                       <div className="d-flex justify-content-between align-items-center">
                          <div>
                             <div className="text-white fw-black uppercase mb-0" style={{fontSize: '0.8rem'}}>{ex.name}</div>
                             <div className="text-info fw-bold uppercase" style={{fontSize: '0.55rem'}}>{ex.focus}</div>
                          </div>
                          <div className="text-white fw-black h5 mb-0">{ex.sets}</div>
                       </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 opacity-50 small">Generando rutina personalizada...</div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget profile={profile} />
    </div>
  );
};

export default UserDashboard;
