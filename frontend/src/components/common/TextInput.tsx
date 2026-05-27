import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="text-sm font-bold text-slate-600 ml-1">{label}</label>}
      <input
        className={`w-full h-14 px-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextInput;
