
import React, { useState } from 'react';
import { Button, Card, Input } from '../components/UI';
import { UserProfile, UserGoal, Language, DietStyle, ArgentineRegion } from '../types';
import { geminiService } from '../services/gemini';
import { Target, Activity, ChevronRight, ChevronLeft, Languages, Scan, User, Plus, Trash2, MapPin, Utensils, Loader2 } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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
          avatarImages: [...p.avatarImages, ...images].slice(0, 4)
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

  const languageOptions = Object.values(Language);

  return (
    <div className="max-w-xl mx-auto py-16 px-4 animate-in fade-in duration-700">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(34,211,238,0.2)]"></div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Bio-Análisis en Curso</h2>
          <p className="text-slate-500 text-sm mt-4 font-medium max-w-xs mx-auto">
            Procesando métricas corporales y optimizando tu nutrición regional...
          </p>
        </div>
      ) : (
        <>
          <div className="mb-12 flex items-center justify-between gap-4">
             <button onClick={step === 0 ? onCancel : prev} className="p-3 bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all border border-slate-800">
                <ChevronLeft size={20} />
             </button>
             <div className="flex-grow flex gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-800'}`} />
                ))}
             </div>
          </div>

          {step === 0 && (
            <Card className="animate-in slide-in-from-bottom-8">
               <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <Languages size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Selection</span>
              </div>
              <h2 className="text-4xl font-black mb-10 text-white tracking-tighter uppercase italic">Idioma del Coach</h2>
              <div className="grid gap-4">
                {languageOptions.map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => setProfile({...profile, language: lang})} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all font-black uppercase tracking-widest text-[11px] ${profile.language === lang ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <Button variant="cyan" className="w-full mt-10 py-5" onClick={next}>Continuar <ChevronRight size={18} /></Button>
            </Card>
          )}

          {step === 1 && (
            <Card className="animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <User size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Identity</span>
              </div>
              <h2 className="text-4xl font-black mb-10 text-white tracking-tighter uppercase italic">Identidad</h2>
              <Input 
                label="Nombre y Apellido" 
                value={profile.name} 
                onChange={v => setProfile({...profile, name: v})} 
                placeholder="Marco Aurelio" 
              />
              <Button 
                variant="cyan" 
                className="w-full mt-10 py-5" 
                onClick={next}
                disabled={!profile.name.trim()}
              >
                Siguiente Paso <ChevronRight size={18} />
              </Button>
            </Card>
          )}

          {step === 2 && (
            <Card className="animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-2 mb-4 text-indigo-400">
                <Target size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Objective</span>
              </div>
              <h2 className="text-4xl font-black mb-8 text-white tracking-tighter uppercase italic">Tu Meta</h2>
              <div className="grid gap-4">
                {Object.values(UserGoal).map(goal => (
                  <button 
                    key={goal} 
                    onClick={() => setProfile({...profile, goal})} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all font-black uppercase tracking-widest text-[11px] ${profile.goal === goal ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <Button variant="indigo" className="w-full mt-10 py-5" onClick={next}>Confirmar Meta</Button>
            </Card>
          )}

          {step === 3 && (
            <Card className="animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <Utensils size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Nutrition Style</span>
              </div>
              <h2 className="text-4xl font-black mb-8 text-white tracking-tighter uppercase italic">Preferencia</h2>
              <div className="grid gap-4">
                {Object.values(DietStyle).map(style => (
                  <button 
                    key={style} 
                    onClick={() => setProfile({...profile, dietStyle: style})} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all font-black uppercase tracking-widest text-[11px] ${profile.dietStyle === style ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <Button variant="secondary" className="w-full mt-10 py-5" onClick={next}>Aceptar Estilo</Button>
            </Card>
          )}

          {step === 4 && (
            <Card className="animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-2 mb-4 text-amber-500">
                <MapPin size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Region</span>
              </div>
              <h2 className="text-4xl font-black mb-6 text-white tracking-tighter uppercase italic">Zona Regional</h2>
              <div className="grid gap-4">
                {Object.values(ArgentineRegion).map(region => (
                  <button 
                    key={region} 
                    onClick={() => setProfile({...profile, region})} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all font-black uppercase tracking-widest text-[11px] ${profile.region === region ? 'border-amber-500 bg-amber-500/10 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              <Button variant="cyan" className="w-full mt-10 py-5" onClick={next}>Establecer Zona</Button>
            </Card>
          )}

          {step === 5 && (
            <Card className="animate-in slide-in-from-bottom-8">
              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <Scan size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Bio-Scan</span>
              </div>
              <h2 className="text-4xl font-black mb-4 text-white tracking-tighter uppercase italic">Carga Visual</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase mb-8 tracking-widest">Sube al menos 1 foto para análisis de % grasa.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {profile.avatarImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                    <img src={img} className="w-full h-full object-cover grayscale contrast-125" />
                    <button 
                      onClick={() => setProfile(p => ({...p, avatarImages: p.avatarImages.filter((_, i) => i !== idx)}))} 
                      className="absolute top-2 right-2 p-2 bg-slate-950/80 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {profile.avatarImages.length < 4 && (
                  <label className="aspect-[3/4] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/40 hover:bg-cyan-500/[0.02] transition-all group">
                    <Plus className="text-slate-700 group-hover:text-cyan-500 group-hover:scale-110 transition-all" size={32} />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2">Añadir</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                  </label>
                )}
              </div>
              <Button variant="cyan" className="w-full py-5" onClick={next}>Continuar con Fotos</Button>
            </Card>
          )}

          {step === 6 && (
            <Card className="animate-in slide-in-from-bottom-8">
              <h2 className="text-4xl font-black mb-10 text-white tracking-tighter uppercase italic">Biometría</h2>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Edad Cronológica" type="number" value={profile.age} onChange={v => setProfile({...profile, age: parseInt(v) || 0})} />
                <Input label="Peso Actual (KG)" type="number" value={profile.weight} onChange={v => setProfile({...profile, weight: parseInt(v) || 0})} />
              </div>
              <Button variant="cyan" className="w-full mt-12 py-6 shadow-[0_0_40px_rgba(34,211,238,0.3)]" onClick={finalize}>
                 Sincronizar Bio-Identidad
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Onboarding;
