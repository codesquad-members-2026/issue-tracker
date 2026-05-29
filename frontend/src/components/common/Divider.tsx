import React from 'react';

interface DividerProps {
  text?: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <div className="relative flex items-center w-full py-2">
      <div className="flex-grow border-t border-slate-200"></div>
      {text && (
        <span className="flex-shrink mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider">
          {text}
        </span>
      )}
      <div className="flex-grow border-t border-slate-200"></div>
    </div>
  );
};

export default Divider;
