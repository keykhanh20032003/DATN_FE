import React, { ReactNode } from 'react';

interface TitleProps {
  className?: string;
  children: ReactNode;
}

const Title = ({ className, children }: TitleProps) => <p className={`text-2xl font-bold ${className}`}>{children}</p>;

export default Title;
