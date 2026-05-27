import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

const TextLink: React.FC<LinkProps> = ({ className = '', children, ...props }) => {
  return (
    <Link 
      className={`text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default TextLink;
