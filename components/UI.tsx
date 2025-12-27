
import React from 'react';

export const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'cyan' | 'indigo';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled }) => {
  const base = "px-6 py-3 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-[10px] cursor-pointer select-none";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95",
    cyan: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95",
    indigo: "bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95",
    outline: "border-2 border-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 backdrop-blur-sm active:scale-95",
    danger: "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.3)] active:scale-95"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={(e) => {
      if (onClick) {
        e.stopPropagation();
        onClick();
      }
    }}
    className={`bg-slate-950/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-6 relative overflow-hidden group transition-all duration-500 ${onClick ? 'cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/60' : ''} ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'blue' }) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-900/30 text-blue-400 border-blue-800/50",
    green: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
    orange: "bg-orange-900/30 text-orange-400 border-orange-800/50",
    red: "bg-rose-900/30 text-rose-400 border-rose-800/50",
    cyan: "bg-cyan-900/30 text-cyan-400 border-cyan-800/50",
    indigo: "bg-indigo-900/30 text-indigo-400 border-indigo-800/50"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-[0.2em] shadow-sm whitespace-nowrap ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<{
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-slate-100 placeholder:text-slate-700 transition-all text-sm font-medium"
    />
  </div>
);
