import React, { useState } from 'react';
import { Badge, Button } from '../components/UI';
import { geminiService } from '../services/gemini';
import { SupplementScanResult } from '../types';
import { Camera, ChevronLeft, Loader2, ShoppingCart, Search, ShieldCheck } from 'lucide-react';

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
          alert("Error de enlace neural. Verifica la nitidez de la captura.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderWhatsApp = () => {
    if (!result) return;
    const supplementList = result.supplements.map(s => `• ${s.name}`).join('%0A');
    const message = `*ORDEN TÁCTICA DE SUPLEMENTOS*%0A%0A*Misión:* Abastecimiento%0A*Items:*%0A${supplementList}%0A%0A_Enviado desde Nutri-Coach Pro_`;
    window.open(`https://wa.me/3816284867?text=${message}`, '_blank');
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <button 
        onClick={onBack}
        className="btn bg-transparent border-0 p-0 mb-4 d-flex align-items-center gap-2 opacity-75"
        style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}
      >
        <ChevronLeft size={18} /> REGRESAR
      </button>

      {!result ? (
        <div className="text-center">
          <Badge className="mb-3">LABORATORIO DE VISIÓN IA</Badge>
          <h1 className="fw-black text-uppercase italic mb-2 display-5 text-white">
            QUICK <span style={{ color: 'var(--cyan-primary)' }}>SCAN</span>
          </h1>
          <p className="small fw-bold text-uppercase tracking-widest mb-5 opacity-50" style={{ color: 'var(--text-dim)' }}>Identificación de Fórmulas</p>
          
          <div className="onboarding-card text-center">
             <div className="py-4">
                <div className={`scan-dropzone ${loading ? 'animate-flicker' : ''}`}>
                  {loading ? (
                    <Loader2 className="animate-spin" size={60} color="black" />
                  ) : (
                    <Camera size={60} color="black" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handleScan}
                    disabled={loading}
                  />
                </div>
                
                <div className="mt-5">
                   <h4 className="fw-bold text-uppercase mb-2 text-white">CAPTURAR ETIQUETA</h4>
                   <p className="small fw-bold text-uppercase opacity-60 mb-0" style={{ color: 'var(--text-dim)' }}>Análisis instantáneo de componentes</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-black text-uppercase italic mb-0 text-white">REPORTE IA</h2>
            <Badge>OPERATIVO</Badge>
          </div>

          <div className="d-flex flex-column gap-3">
            {result.supplements.map((s, i) => (
              <div key={i} className="inner-card-alt p-4 rounded-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                   <h3 className="h6 fw-bold text-uppercase mb-0 text-white tracking-tight">{s.name}</h3>
                   {s.isSmartForYou && <Badge>TOP RECOMENDADO</Badge>}
                </div>
                <div className="p-3 bg-black bg-opacity-30 rounded-4 mb-3" style={{ border: '1px solid var(--cyan-soft)' }}>
                   <div className="text-info fw-bold small text-uppercase mb-1" style={{ fontSize: '0.6rem' }}>DOSIS</div>
                   <p className="text-white small mb-0 fw-bold">{s.howToTake}</p>
                </div>
                <p className="small opacity-75 mb-0" style={{ color: 'var(--text-dim)' }}>{s.logic}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 d-flex flex-column gap-3">
             <Button variant="cyan" onClick={handleOrderWhatsApp} className="w-100 py-4">
                <ShoppingCart size={20} className="me-2" /> RE-ABASTECER KIT
             </Button>
             <Button variant="outline" onClick={onUpgrade} className="w-100">
                ESCANEO CORPORAL COMPLETO
             </Button>
          </div>

          <button 
            onClick={() => setResult(null)} 
            className="btn btn-link w-100 text-center py-4 text-decoration-none border-0 fw-bold text-uppercase small opacity-50"
            style={{ color: 'var(--text-dim)' }}
          >
            VOLVER A ESCANEAR
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickScan;