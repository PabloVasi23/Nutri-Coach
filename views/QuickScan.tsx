
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { geminiService } from '../services/gemini';
import { SupplementScanResult } from '../types';
import { Camera, ChevronLeft, Loader2, Sparkles, AlertCircle, ShoppingCart, Zap } from 'lucide-react';

interface Props {
  onBack: () => void;
  onUpgrade: () => void;
}

const QuickScan: React.FC<Props> = ({ onBack, onUpgrade }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SupplementScanResult | null>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const res = await geminiService.analyzeSupplementKit(base64, null);
          setResult(res);
        } catch (err) {
          console.error(err);
          alert("Error al analizar la imagen. Asegúrate de que sea nítida.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderWhatsApp = () => {
    if (!result) return;
    const now = new Date();
    const supplementList = result.supplements.map(s => `• ${s.name}`).join('%0A');
    const message = `*ORDEN RÁPIDA DE SUPLEMENTOS*%0A%0A*Items:*%0A${supplementList}%0A%0A_Enviado desde el sistema Nutri-Coach Pro._`;
    window.open(`https://wa.me/3816284867?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors mb-10 text-[10px] font-black uppercase tracking-[0.3em]"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      {!result ? (
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-8">
            Fast <span className="text-indigo-500">Scan</span>
          </h1>
          <Card className="p-16 border-dashed border-2 border-slate-800 bg-slate-950/20">
            <div className="flex flex-col items-center">
               <div className="w-28 h-28 bg-indigo-500 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl mb-8 relative group cursor-pointer overflow-hidden transition-all hover:scale-105 active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={48} /> : <Camera size={48} />}
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleScan}
                    disabled={loading}
                  />
               </div>
               <p className="text-slate-500 text-sm font-medium">Pulsa para capturar suplementos</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in">
          <header className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Resultado</h2>
            <Badge color="indigo">Identificado</Badge>
          </header>

          <div className="space-y-4">
            {result.supplements.map((s, i) => (
              <Card key={i} className="bg-slate-900/60 border-indigo-500/20">
                <h3 className="text-xl font-black text-white uppercase italic mb-4">{s.name}</h3>
                <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 mb-4">
                   <p className="text-slate-200 text-sm font-semibold">{s.howToTake}</p>
                </div>
                <p className="text-xs text-slate-500 italic">"{s.logic}"</p>
              </Card>
            ))}
          </div>

          <Card className="bg-rose-500/5 border-rose-500/20 p-5 flex gap-4">
             <AlertCircle className="text-rose-500 shrink-0" size={20} />
             <p className="text-[11px] text-rose-300/80 leading-relaxed font-bold uppercase">{result.overallWarning}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Button variant="cyan" onClick={handleOrderWhatsApp} className="py-5">
                <ShoppingCart size={18} /> Re-abastecer
             </Button>
             <Button variant="outline" onClick={onUpgrade} className="py-5">
                Crear Perfil Completo
             </Button>
          </div>

          <button onClick={() => setResult(null)} className="w-full text-center text-[10px] font-black uppercase text-slate-700 tracking-[0.4em] py-4">
            Nuevo Escaneo
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickScan;
