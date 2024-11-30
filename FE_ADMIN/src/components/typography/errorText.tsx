import React, { ReactNode } from 'react';

interface ErrorTextProps {
  styleClass?: string;
  children: ReactNode;
}

const ErrorText = ({ styleClass, children }: ErrorTextProps) => (
  <p className={`text-center text-red-500 ${styleClass}`}>{children}</p>
);

export default ErrorText;
