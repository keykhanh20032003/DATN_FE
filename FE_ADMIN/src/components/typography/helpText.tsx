import React, { ReactNode } from 'react';

interface HelperTextProps {
  className?: string;
  children: ReactNode;
}

const HelperText = ({ className, children }: HelperTextProps) => (
  <div className={`text-slate-400 ${className}`}>{children}</div>
);

export default HelperText;
