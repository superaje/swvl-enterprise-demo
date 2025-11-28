'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-swvl-primary to-swvl-accent text-white hover:from-swvl-accent hover:to-swvl-primary shadow-lg hover:shadow-xl',
    secondary: 'bg-swvl-secondary text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-swvl-primary text-swvl-primary hover:bg-gradient-to-r hover:from-swvl-primary hover:to-swvl-accent hover:text-white hover:border-transparent',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}

