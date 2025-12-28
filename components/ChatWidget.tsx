import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { UserProfile } from '../types';
import { MessageCircle, Minimize2, Download, Send, Loader2, FileDown } from 'lucide-react';
import { Badge } from './UI';

interface Message {
  role: 'user' | 'coach';
  text: string;
  timestamp: string;
}

interface Props {
  profile: UserProfile;
}

const ChatWidget: React.FC<Props> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'coach', 
      text: `Hola ${profile.name}, conexión táctica establecida. ¿Qué dudas tienes sobre tu protocolo?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: time }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        parts: [{ text: m.text }] 
      }));
      
      const response = await geminiService.chatWithCoach(userMsg, history, profile);
      setMessages(prev => [...prev, { 
        role: 'coach', 
        text: response, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'coach', 
        text: "Error de conexión. Reintentando enlace...", 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const chatLog = `
=========================================
      NUTRI-COACH PRO | REPORTE DE CHAT
=========================================
OPERATIVO: ${profile.name.toUpperCase()}
FECHA: ${new Date().toLocaleDateString()}
-----------------------------------------

${messages.map(m => `[${m.timestamp}] ${m.role === 'coach' ? 'COACH IA' : 'USUARIO'}:\n${m.text}`).join('\n\n')}

=========================================
      FIN DEL DOCUMENTO TÁCTICO
=========================================
    `;
    const blob = new Blob([chatLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chat_Hablado_${profile.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <div className="chat-widget minimized d-flex" onClick={() => setIsOpen(true)}>
        <MessageCircle size={28} color="#000" strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div className="chat-widget animate-in slide-in-from-bottom-2">
      {/* HUD HEADER */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary border-opacity-10 bg-black bg-opacity-40">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success rounded-circle animate-pulse" style={{width: '8px', height: '8px'}}></span>
          <span className="text-white fw-bold small uppercase tracking-tighter" style={{fontSize: '0.7rem'}}>Coach Direct v4.2</span>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm text-dim p-1 hover-white transition-all d-flex align-items-center gap-1" 
            onClick={handleDownload} 
            title="Descargar chat hablado"
          >
            <FileDown size={18} />
          </button>
          <button className="btn btn-sm text-dim p-1 hover-white transition-all" onClick={() => setIsOpen(false)} title="Minimizar">
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* CHAT AREA WITH SCROLLBAR */}
      <div className="chat-history" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-coach'}`}>
            <div className="text-break">{m.text}</div>
            <div className={`text-end opacity-40 mt-1 ${m.role === 'user' ? 'text-dark' : 'text-info'}`} style={{ fontSize: '0.55rem', fontWeight: 800 }}>
              {m.timestamp}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bubble-coach opacity-70 d-flex align-items-center gap-2">
            <Loader2 size={14} className="animate-spin text-info" />
            <span style={{fontSize: '0.6rem'}} className="text-tactical uppercase tracking-widest">IA Pensando...</span>
          </div>
        )}
      </div>

      {/* INPUT AREA REFORZADA */}
      <div className="p-3 bg-black bg-opacity-50">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control tactical-input" 
            placeholder="Consulta tu protocolo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ fontSize: '0.9rem', color: '#fff' }}
          />
          <button 
            className="btn btn-initialize ms-2 p-0 d-flex align-items-center justify-content-center shadow-lg" 
            style={{ width: '45px', height: '45px', flexShrink: 0 }}
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send size={18} color="black" />
          </button>
        </div>
        <div className="mt-2 text-center">
           <button 
            onClick={handleDownload}
            className="btn btn-link text-dim text-decoration-none p-0 fw-bold uppercase tracking-widest"
            style={{ fontSize: '0.55rem', opacity: 0.6 }}
           >
             <Download size={10} className="me-1" /> descargar chat hablado .txt
           </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;