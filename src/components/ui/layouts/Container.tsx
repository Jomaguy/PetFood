import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  padding?: boolean;
  center?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  padding = true,
  center = true,
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
    none: '',
  };

  const paddingClass = padding ? 'px-4 sm:px-6 md:px-8' : '';
  const centerClass = center ? 'mx-auto' : '';

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} ${paddingClass} ${centerClass} ${className}`}>
      {children}
    </div>
  );
};

export default Container; 