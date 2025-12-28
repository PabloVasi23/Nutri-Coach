import React, { useState, useEffect } from 'react';
import { Button, Input, Badge } from '../components/UI';
import { UserProfile, UserGoal, Language, DietStyle, ArgentineRegion } from '../types';
import { geminiService } from '../services/gemini';
import { 
  ChevronRight, ChevronLeft, 
  Trash2, Camera
} from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [randomName, setRandomName] = useState('Juan Pérez');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    weight: 70,
    goal: UserGoal.GENERAL_HEALTH,
    sport: '',
    restrictions: [],
    language: Language.ES,
    dietStyle: DietStyle.BALANCED,
    region: ArgentineRegion.PAMPA,
    avatarImages: []
  });

  useEffect(() => {
    const names = ['Juan Pérez', 'Carlos Gómez', 'Luis Rodríguez', 'Ana Martínez', 'Sofía López', 'Marcos Vera', 'Diego Sosa'];
    setRandomName(names[Math.floor(Math.random() * names.length)]);
  }, []);

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(0, s - 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const readers = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(images => {
        setProfile(p => ({
          ...p,
          avatarImages: [...p.avatarImages, ...images].slice(0, 3)
        }));
      });
    }
  };

  const finalize = async () => {
    if (!profile.name) {
      alert("Por favor, ingresa tu nombre.");
      setStep(1);
      return;
    }
    setLoading(true);
    let analysis = undefined;
    try {
      if (profile.avatarImages.length >= 1) {
        const bases64 = profile.avatarImages.map(img => img.split(',')[1]);
        analysis = await geminiService.analyzePhysique(
          bases64, 
          profile.goal, 
          profile.dietStyle, 
          profile.region, 
          profile.language
        );
      }
      onComplete({ ...profile, physiqueAnalysis: analysis });
    } catch (err) {
      console.error("Critical analysis failure:", err);
      onComplete({ ...profile });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-grow text-info mb-4" style={{width: '3.5rem', height: '3.5rem'}} role="status"></div>
              <h2 className="text-tactical text-white h3 mb-3 fw-black italic uppercase">Sincro Bio-Data...</h2>
              <p className="text-dim small text-uppercase tracking-widest opacity-60">IA analizando simetría muscular</p>
            </div>
          ) : (
            <div className="animate-in fade-in">
              {/* INDICADOR DE PROGRESO */}
              <div className="mb-4 d-flex align-items-center gap-2 mx-auto" style={{ maxWidth: '400px' }}>
                <button 
                  onClick={step === 0 ? onCancel : prev} 
                  className="p-2 bg-transparent border-0"
                  style={{color: 'var(--text-main)'}}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex-grow-1 d-flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <div 
                      key={i} 
                      className="rounded-pill" 
                      style={{
                        height: '6px', 
                        flexGrow: 1, 
                        backgroundColor: step >= i ? 'var(--cyan-primary)' : 'var(--border-glass)',
                        boxShadow: step >= i ? '0 0 10px var(--cyan-glow)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="onboarding-card shadow-lg">
                {/* STEP 0: IDIOMA */}
                {step === 0 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <Badge>Módulo Lenguaje</Badge>
                    </div>
                    <h2 className="h4 mb-4 fw-black text-white text-uppercase italic text-tactical">¿Cómo prefieres que te hable?</h2>
                    <div className="d-flex flex-column gap-2 text-start">
                      {Object.values(Language).map((lang) => (
                        <div 
                          key={lang} 
                          onClick={() => setProfile({...profile, language: lang})} 
                          className={`futuristic-option ${profile.language === lang ? 'active' : ''}`}
                        >
                          <span className="option-text">{lang}</span>
                          <div className="option-indicator"></div>
                        </div>
                      ))}
                    </div>
                    <Button variant="cyan" className="mt-5 w-100 py-3" onClick={next}>Continuar Enlace</Button>
                  </div>
                )}

                {/* STEP 1: NOMBRE */}
                {step === 1 && (
                  <div>
                    <div className="text-center mb-5">
                      <Badge className="mb-3">Identificación</Badge>
                      <h2 className="h4 fw-black text-white text-uppercase italic text-tactical">Tu Nombre Operativo</h2>
                    </div>
                    <Input 
                      label="NOMBRE COMPLETO" 
                      value={profile.name} 
                      onChange={v => setProfile({...profile, name: v})} 
                      placeholder={`Ej: ${randomName}`} 
                    />
                    <Button variant="cyan" className="w-100 mt-2 py-3" onClick={next} disabled={!profile.name.trim()}>Vincular Identidad</Button>
                  </div>
                )}

                {/* STEP 2: OBJETIVO */}
                {step === 2 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <Badge>Misión</Badge>
                    </div>
                    <h2 className="h4 mb-4 fw-black text-white text-uppercase italic text-tactical">¿Cuál es tu objetivo?</h2>
                    <div className="d-flex flex-column gap-2 text-start">
                      {Object.values(UserGoal).map(goal => (
                        <div 
                          key={goal} 
                          onClick={() => setProfile({...profile, goal})} 
                          className={`futuristic-option ${profile.goal === goal ? 'active' : ''}`}
                        >
                          <span className="option-text">{goal}</span>
                          <div className="option-indicator"></div>
                        </div>
                      ))}
                    </div>
                    <Button variant="cyan" className="mt-5 w-100 py-3" onClick={next}>Configurar Protocolo</Button>
                  </div>
                )}

                {/* STEP 3: DIETA */}
                {step === 3 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <Badge>Alimentación</Badge>
                    </div>
                    <h2 className="h4 mb-4 fw-black text-white text-uppercase italic text-tactical">Estilo Nutricional</h2>
                    <div className="d-flex flex-column gap-2 text-start">
                      {Object.values(DietStyle).map(s => (
                        <div 
                          key={s} 
                          onClick={() => setProfile({...profile, dietStyle: s})} 
                          className={`futuristic-option ${profile.dietStyle === s ? 'active' : ''}`}
                        >
                          <span className="option-text">{s}</span>
                          <div className="option-indicator"></div>
                        </div>
                      ))}
                    </div>
                    <Button variant="cyan" className="mt-5 w-100 py-3" onClick={next}>Siguiente Paso</Button>
                  </div>
                )}

                {/* STEP 4: REGIÓN */}
                {step === 4 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <Badge>Geolocalización</Badge>
                    </div>
                    <h2 className="h4 mb-4 fw-black text-white text-uppercase italic text-tactical">¿En qué región estás?</h2>
                    <div className="d-flex flex-column gap-2 text-start">
                      {Object.values(ArgentineRegion).map(r => (
                        <div 
                          key={r} 
                          onClick={() => setProfile({...profile, region: r})} 
                          className={`futuristic-option ${profile.region === r ? 'active' : ''}`}
                        >
                          <span className="option-text">{r}</span>
                          <div className="option-indicator"></div>
                        </div>
                      ))}
                    </div>
                    <Button variant="cyan" className="mt-5 w-100 py-3" onClick={next}>Continuar al Scan</Button>
                  </div>
                )}

                {/* STEP 5: FOTOS */}
                {step === 5 && (
                  <div>
                    <div className="text-center mb-5">
                      <Badge className="mb-2">Bio-Vision</Badge>
                      <h2 className="h4 fw-black text-white text-uppercase italic text-tactical">Scan Corporal</h2>
                      <p className="text-dim small text-uppercase fw-bold opacity-60">Sube fotos para análisis de simetría.</p>
                    </div>
                    
                    <div className="row g-3">
                      {profile.avatarImages.map((img, idx) => (
                        <div key={idx} className="col-4">
                          <div className="position-relative overflow-hidden rounded-4 border border-info border-opacity-30 shadow-sm" style={{aspectRatio: '1/1'}}>
                            <img src={img} className="w-100 h-100 object-fit-cover" alt="Scan" />
                            <button 
                              onClick={() => setProfile(p => ({...p, avatarImages: p.avatarImages.filter((_, i) => i !== idx)}))} 
                              className="btn btn-danger position-absolute top-0 end-0 m-1 p-0 rounded-circle border-0 d-flex align-items-center justify-content-center shadow"
                              style={{width: '26px', height: '26px', zIndex: 10}}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {profile.avatarImages.length < 3 && (
                        <div className="col-4">
                          <div className="d-flex flex-column align-items-center justify-content-center bg-black bg-opacity-30 border border-dashed border-info border-opacity-30 rounded-4 w-100" style={{ aspectRatio: '1/1', position: 'relative' }}>
                            <Camera size={30} className="text-info opacity-50 mb-2" />
                            <span className="small text-info fw-bold opacity-50">SUBIR</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              onChange={handleFileUpload} 
                              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button variant="cyan" className="mt-5 w-100 py-3" onClick={next} disabled={profile.avatarImages.length === 0}>
                      Analizar Composición <ChevronRight size={18} className="ms-2" />
                    </Button>
                  </div>
                )}

                {/* STEP 6: MÉTRICAS FINALES */}
                {step === 6 && (
                   <div className="animate-in fade-in">
                      <div className="text-center mb-5">
                        <Badge>Métricas Finales</Badge>
                        <h2 className="h4 fw-black text-white text-uppercase italic text-tactical">Parámetros de Usuario</h2>
                      </div>
                      <div className="row g-3">
                        <div className="col-6">
                          <Input label="EDAD" type="number" value={profile.age} onChange={v => setProfile({...profile, age: parseInt(v)||0})} />
                        </div>
                        <div className="col-6">
                          <Input label="PESO (KG)" type="number" value={profile.weight} onChange={v => setProfile({...profile, weight: parseInt(v)||0})} />
                        </div>
                      </div>
                      <Button variant="cyan" className="mt-5 w-100 py-3" onClick={finalize}>
                        Sincronizar Protocolo Alpha
                      </Button>
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;