
import React, { useEffect, useState, useRef } from 'react';
import { Card, Badge, Button, Input } from '../components/UI';
import { UserProfile, Supplement, SupplementScanResult } from '../types';
import { geminiService } from '../services/gemini';
import { Clock, ShoppingCart, Info, Activity, User, Target, Zap, Dumbbell, Sparkles, BookOpen, Heart, Camera, MessageSquare, Send, Loader2, ChevronRight, X, Utensils, ShieldCheck, Download, Minus, Maximize2 } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setView: (v: any) => void;
  isDarkMode: boolean;
}

const UserDashboard: React.FC<Props> = ({ profile, setView, isDarkMode }) => {
  const [protocol, setProtocol] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [suppScannerOpen, setSuppScannerOpen] = useState(false);
  const [suppScanResult, setSuppScanResult] = useState<SupplementScanResult | null>(null);
  const [suppLoading, setSuppLoading] = useState(false);

  // Chat States
  const [chatOpen, setChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'coach', text: string}[]>([]);
  const [chatFontSize, setChatFontSize] = useState(13);
  const [showCoachAlert, setShowCoachAlert] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const data = await geminiService.generateProtocol(profile);
        setProtocol(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProtocol();
  }, [profile]);

  // Asegura el scroll automático al recibir o enviar mensajes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading, chatOpen, isMinimized]);

  // Alerta de conexión con el asesor
  useEffect(() => {
    if (chatOpen && !isMinimized) {
      setShowCoachAlert(true);
      const timer = setTimeout(() => setShowCoachAlert(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [chatOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!chatMsg.trim()) return;
    const userMsg = chatMsg;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMsg('');
    setChatLoading(true);
    try {
      const coachRes = await geminiService.chatWithCoach(userMsg, messages, profile);
      setMessages(prev => [...prev, { role: 'coach', text: coachRes }]);
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const p = profile.physiqueAnalysis;
    const report = `
=========================================
      REPORTE TÁCTICO: NUTRI-COACH PRO
=========================================
USUARIO: ${profile.name.toUpperCase()}
OBJETIVO: ${profile.goal}
REGIÓN: ${profile.region}
ESTILO DIETA: ${profile.dietStyle}
GRASA ESTIMADA: ${p?.estimatedBodyFat || 'N/A'}

--- ANÁLISIS BIO-ESTRUCTURAL ---
${p?.assessment || 'Análisis no disponible'}

--- PLAN NUTRICIONAL REGIONAL ---
Desayuno: ${p?.suggestedDiet.breakfast}
Almuerzo: ${p?.suggestedDiet.lunch}
Merienda: ${p?.suggestedDiet.snack}
Cena: ${p?.suggestedDiet.dinner}
Nota Regional: ${p?.suggestedDiet.regionalNotes}

--- MATRIZ DE ENTRENAMIENTO RECOMENDADA ---
${p?.aestheticExercises.map(ex => `• ${ex.name.toUpperCase()}
  Razón: ${ex.reason}
  Series/Reps: ${ex.sets}
  Enfoque: ${ex.focus}`).join('\n\n')}

--- PROTOCOLO DE SUPLEMENTACIÓN ---
${protocol.map(s => `• ${s.name} | Dosis: ${s.dose} | Momento: ${s.timing}`).join('\n')}

Generado por Nutri-Coach Pro System v2.5
Fecha: ${new Date().toLocaleString()}
=========================================`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Tactico_${profile.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSuppScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSuppLoading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await geminiService.analyzeSupplementKit(base64, profile);
        setSuppScanResult(res);
        setSuppLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderWhatsApp = () => {
    const supplementList = protocol.map(s => `• ${s.name} (${s.dose})`).join('%0A');
    const message = `*ORDEN DE SUPLEMENTACIÓN*%0A%0A*Cliente:* ${profile.name}%0A*Kit:*%0A${supplementList}`;
    window.open(`https://wa.me/3816284867?text=${message}`, '_blank');
  };

  const labels = {
    welcome: { English: 'Bio-Status: Active', Español: 'Estado: Activo', Português: 'Status: Ativo' },
    order: { English: 'Deploy Nutrition Stack', Español: 'Encargar kit de suplementación nutricional', Português: 'Enviar Stack de Nutrição' }
  };

  const currentLang = profile.language as keyof typeof labels.welcome;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]"></div>
        <p className="text-cyan-400 font-black uppercase tracking-[0.5em] text-[10px]">Neural Processing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative animate-in fade-in duration-1000">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
            <Sparkles size={16} /> {labels.welcome[currentLang]}
          </div>
          <h1 className={`text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {profile.name.split(' ')[0]} <span className={`${isDarkMode ? 'text-slate-800' : 'text-slate-200'} italic`}>PRO_v1</span>
          </h1>
          <p className={`mt-6 max-w-2xl text-lg font-medium leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
            Bio-mapeo completado. Sistemas de nutrición regionalizados.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            onClick={handleDownloadReport}
            className={`px-8 py-5 border-2 shadow-xl hover:scale-105 active:scale-95 transition-all ${isDarkMode ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50'}`}
          >
            <Download size={18} /> Descargar Reporte (.txt)
          </Button>
          <Button 
            variant="cyan" 
            onClick={() => { setChatOpen(true); setIsMinimized(false); }}
            className="px-8 py-5 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <MessageSquare size={18} /> Chat de Asesoría
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Columna Izquierda */}
        <div className="lg:col-span-5 space-y-10">
          <Card className={`!p-0 overflow-hidden relative shadow-2xl transition-all duration-500 ${isDarkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-white'}`}>
            <div className="aspect-[4/5] relative">
              {profile.avatarImages.length > 0 ? (
                <img src={profile.avatarImages[activeImg]} className={`w-full h-full object-cover grayscale transition-opacity contrast-125 ${isDarkMode ? 'opacity-70' : 'opacity-100'}`} />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-slate-800' : 'bg-slate-100 text-slate-400'}`}><User size={80} /></div>
              )}
              <div className={`absolute inset-0 bg-gradient-to-t via-transparent ${isDarkMode ? 'from-slate-950' : 'from-white/40'}`} />
              <div className={`absolute top-8 left-8 backdrop-blur-xl px-4 py-2 rounded-xl border shadow-2xl transition-colors ${isDarkMode ? 'bg-slate-950/90 border-cyan-500/30' : 'bg-white border-cyan-500'}`}>
                <span className="text-cyan-500 font-black text-2xl italic tracking-tighter flex items-center gap-2">
                   {profile.physiqueAnalysis?.estimatedBodyFat || "??%"} <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">BF%</span>
                </span>
              </div>
            </div>
            <div className="p-10">
              <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <BookOpen size={14} /> Análisis de Estructura
              </h4>
              <p className={`text-sm leading-relaxed font-medium italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                "{profile.physiqueAnalysis?.assessment}"
              </p>
            </div>
          </Card>

          <Card className={`group p-8 transition-all cursor-pointer ${isDarkMode ? 'border-cyan-500/20 bg-cyan-500/[0.02] hover:bg-cyan-500/[0.05]' : 'border-cyan-200 bg-white hover:border-cyan-500 shadow-lg'}`} onClick={() => setSuppScannerOpen(true)}>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-cyan-500 rounded-2xl text-slate-950 group-hover:scale-110 transition-transform shadow-xl"><Camera size={28} /></div>
                  <h3 className={`text-xl font-black uppercase tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Analizar mis Suples</h3>
                </div>
                <ChevronRight className="text-cyan-500 group-hover:translate-x-2 transition-transform" />
             </div>
          </Card>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-7 space-y-12">
          <Button variant="cyan" className="w-full py-7 text-[11px] shadow-[0_0_40px_rgba(34,211,238,0.2)]" onClick={handleOrderWhatsApp}>
            <ShoppingCart size={22} strokeWidth={2.5} /> {labels.order[currentLang]}
          </Button>

          <section>
            <h2 className={`text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Utensils className="text-cyan-500" size={32} /> Dieta {profile.region}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profile.physiqueAnalysis?.suggestedDiet && ['breakfast', 'lunch', 'snack', 'dinner'].map((key, i) => (
                <Card key={i} className={`transition-all ${isDarkMode ? 'bg-slate-950/20 border-slate-800/40' : 'bg-white border-slate-200 shadow-sm'}`}>
                   <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{key.toUpperCase()}</h5>
                   <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{profile.physiqueAnalysis?.suggestedDiet[key as keyof typeof profile.physiqueAnalysis.suggestedDiet]}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className={`text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Dumbbell className="text-indigo-500" size={32} /> Matriz de Simetría
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.physiqueAnalysis?.aestheticExercises.map((ex, i) => (
                <Card key={i} className={`p-7 transition-all ${isDarkMode ? 'bg-slate-950/30 border-slate-800/50' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-500'}`}>
                  <h4 className={`font-black text-xl tracking-tighter uppercase italic mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{ex.name}</h4>
                  <Badge color="indigo">{ex.sets}</Badge>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* CHAT FLOTANTE CON SISTEMA DE MINIMIZACIÓN Y SCROLL REFORZADO */}
      <div className="fixed bottom-10 right-10 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        
        {/* Ventana de Chat Expandida */}
        {chatOpen && !isMinimized && (
          <Card className={`w-[95vw] md:w-[460px] h-[680px] flex flex-col !p-0 shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-10 duration-500 backdrop-blur-3xl border pointer-events-auto transition-all ${isDarkMode ? 'border-cyan-500/30 bg-[#020408]/95' : 'border-slate-300 bg-white'}`}>
            
            {/* Cabecera del Chat */}
            <div className={`p-6 border-b flex justify-between items-center transition-colors ${isDarkMode ? 'border-cyan-500/10 bg-slate-950/50' : 'bg-slate-50 border-slate-200'}`}>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${isDarkMode ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-cyan-500 text-white'}`}>
                        <ShieldCheck size={20} />
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[10px] text-cyan-500 uppercase tracking-[0.4em] leading-none mb-1">Neural Core v3</span>
                    <span className={`font-black text-sm uppercase tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Elite Coach AI</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 p-1 rounded-lg mr-2 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
                    {[11, 13, 16].map(sz => (
                      <button 
                        key={sz} 
                        onClick={() => setChatFontSize(sz)} 
                        className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all ${chatFontSize === sz ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {sz === 11 ? 'S' : sz === 13 ? 'M' : 'L'}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setIsMinimized(true)} title="Minimizar Chat" className="p-2 text-slate-500 hover:text-cyan-500 bg-slate-100 dark:bg-slate-900 rounded-lg transition-colors"><Minus size={20} /></button>
                  <button onClick={() => { setChatOpen(false); setMessages([]); }} title="Cerrar" className="p-2 text-slate-500 hover:text-rose-500 rounded-lg transition-colors"><X size={20} /></button>
               </div>
            </div>

            {/* HUD de Alerta del Asesor */}
            {showCoachAlert && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[70] w-max animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-cyan-500 text-slate-950 px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center gap-3 italic">
                  <Zap size={14} className="animate-pulse" /> ¡Aquí tu asesor nutricional!
                </div>
              </div>
            )}
            
            {/* Contenedor de Mensajes con Scroll Forzado */}
            <div 
              ref={scrollContainerRef} 
              className="flex-grow overflow-y-auto p-8 space-y-8 cyber-scroll scroll-smooth"
              style={{ maxHeight: 'calc(680px - 140px)', overflowY: 'auto' }}
            >
              <div className="flex justify-start">
                <div className={`relative p-5 rounded-2xl border transition-all max-w-[92%] ${isDarkMode ? 'bg-slate-950/80 text-slate-300 border-slate-800/80 shadow-2xl' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                   <div className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-2 border-b border-cyan-500/10 pb-2">Sistema Iniciado</div>
                   <div style={{ fontSize: `${chatFontSize}px` }}>
                     ¡Hola <span className="text-cyan-500 font-black">{profile.name.split(' ')[0]}</span>! Analizando tus datos de <span className="italic uppercase">{profile.region}</span>. ¿Qué consulta táctica tienes hoy?
                   </div>
                </div>
              </div>
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  {m.role === 'user' ? (
                    <div className="p-4 bg-indigo-600 rounded-2xl rounded-tr-none text-white font-bold shadow-xl max-w-[85%] border border-indigo-500/30" style={{ fontSize: `${chatFontSize}px` }}>
                       {m.text}
                    </div>
                  ) : (
                    <div className={`relative p-5 rounded-2xl border shadow-2xl backdrop-blur-md max-w-[92%] ${isDarkMode ? 'bg-slate-900/40 text-cyan-50 border-cyan-500/10' : 'bg-white border-slate-200 text-slate-800'}`}>
                        <div className="flex items-center gap-2 mb-3">
                           <Zap size={10} className="text-cyan-500" />
                           <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.5em]">Respuesta del Coach</span>
                        </div>
                        <div className="font-mono tracking-wide leading-relaxed" style={{ fontSize: `${chatFontSize}px` }}>{m.text}</div>
                    </div>
                  )}
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                   <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-slate-100'}`}>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-[9px] font-black uppercase text-cyan-600 tracking-[0.3em] italic">Calculando Estrategia...</span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Área de Entrada del Chat */}
            <div className={`p-6 border-t backdrop-blur-xl flex gap-4 ${isDarkMode ? 'border-cyan-500/10 bg-slate-950/80' : 'bg-slate-50 border-slate-200'}`}>
              <div className="relative flex-grow">
                 <input 
                    value={chatMsg} 
                    onChange={e => setChatMsg(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                    placeholder="Escribe tu consulta táctica..." 
                    className={`w-full border rounded-2xl px-6 py-4 text-xs outline-none focus:ring-4 transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:border-cyan-500/50' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500'}`} 
                 />
              </div>
              <button 
                onClick={handleSendMessage} 
                disabled={chatLoading}
                className="p-4 bg-cyan-500 text-slate-950 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
              >
                <Send size={22} strokeWidth={3} />
              </button>
            </div>
          </Card>
        )}

        {/* Barra HUD Minimizada */}
        {chatOpen && isMinimized && (
          <div 
            onClick={() => setIsMinimized(false)}
            className={`w-[280px] h-14 rounded-xl border-2 flex items-center justify-between px-4 cursor-pointer hover:scale-105 active:scale-95 transition-all animate-in slide-in-from-right-10 shadow-2xl pointer-events-auto ${isDarkMode ? 'bg-slate-950/90 border-cyan-500/30 text-cyan-400' : 'bg-white border-cyan-500 text-cyan-600'}`}
          >
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
               <span className="text-[10px] font-black uppercase tracking-widest italic">Asesor Conectado</span>
             </div>
             <Maximize2 size={16} className="opacity-50" />
          </div>
        )}

        {/* Botón Flotante Principal (Solo si está cerrado totalmente) */}
        {!chatOpen && (
          <button 
            onClick={() => { setChatOpen(true); setIsMinimized(false); }} 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 group shadow-2xl pointer-events-auto ${isDarkMode ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/40' : 'bg-white text-cyan-600 border border-slate-200'}`}
          >
            <MessageSquare size={30} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Modal del Escáner de Suplementos */}
      {suppScannerOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300 ${isDarkMode ? 'bg-slate-950/95' : 'bg-slate-900/40'}`}>
          <Card className={`max-w-2xl w-full border ${isDarkMode ? 'border-cyan-500/20 bg-slate-900 shadow-2xl' : 'bg-white shadow-2xl border-slate-200'}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-3xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bio-Análisis de Kit</h2>
              <button onClick={() => { setSuppScannerOpen(false); setSuppScanResult(null); }} className="text-slate-500 hover:text-rose-500 p-2 transition-colors"><X size={24} /></button>
            </div>
            
            {!suppScanResult ? (
              <div className="text-center py-16">
                <div className={`w-32 h-32 border-2 border-dashed rounded-3xl mx-auto flex items-center justify-center mb-8 relative group cursor-pointer hover:border-cyan-500 transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-700' : 'bg-slate-50 border-slate-300 text-slate-400'}`}>
                   {suppLoading ? <Loader2 className="animate-spin text-cyan-500" size={48} /> : <Camera size={48} className="group-hover:text-cyan-500 transition-colors" />}
                   <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleSuppScan} disabled={suppLoading} />
                </div>
                <h3 className={`font-black uppercase tracking-tighter text-2xl italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Captura tu Kit</h3>
              </div>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 cyber-scroll">
                {suppScanResult.supplements.map((s, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800 hover:border-cyan-500/20' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`font-black uppercase tracking-tight text-lg italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.name}</h4>
                      <Badge color={s.isSmartForYou ? 'cyan' : 'orange'}>{s.isSmartForYou ? 'VERIFICADO' : 'OBSERVACIÓN'}</Badge>
                    </div>
                    <p className={`text-sm mt-3 font-medium ${isDarkMode ? 'text-cyan-100/90' : 'text-slate-700'}`}>{s.howToTake}</p>
                    <p className="text-xs italic text-slate-500 mt-4 border-t border-slate-800/50 pt-4">"{s.logic}"</p>
                  </div>
                ))}
                <div className={`p-5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                  Alerta Global: {suppScanResult.overallWarning}
                </div>
                <Button variant="cyan" className="w-full py-5" onClick={() => setSuppScannerOpen(false)}>Confirmar Protocolo</Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
