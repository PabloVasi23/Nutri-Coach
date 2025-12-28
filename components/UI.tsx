import React from 'react';

export const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'cyan' | 'pill';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled }) => {
  const isOutline = variant === 'outline';
  const btnClass = isOutline ? 'btn-tactical-outline' : 'btn-initialize';

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`${btnClass} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ children, className = '', onClick, style }) => (
  <div 
    onClick={onClick}
    className={`onboarding-card ${className}`}
    style={{ ...style, maxWidth: 'none' }}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`badge-tactical ${className}`}>
    {children}
  </span>
);

export const Input: React.FC<{
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="mb-4 text-start">
    <label className="fw-bold d-block mb-2 text-uppercase" style={{ fontSize: '0.7rem', color: 'var(--cyan-primary)', letterSpacing: '0.15em' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-control tactical-input"
    />
  </div>
);
