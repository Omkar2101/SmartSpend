/**
 * Reusable Button Component
 */

import React from 'react';
import './Button.css';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseClass = `btn btn-${variant} btn-${size}`;
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={finalClass}
    >
      {isLoading ? <span className="spinner-small"></span> : children}
      {isLoading && <span className="ml-2">Loading...</span>}
    </button>
  );
};

export default Button;
