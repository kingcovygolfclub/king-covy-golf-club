'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  href = '/',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const LogoContent = (
    <div className={`flex items-center ${className}`}>
      {/* Futuristic Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Hexagonal Background with Neon Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg transform rotate-45 opacity-20 blur-sm"></div>
        
        {/* Main Hexagon */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center border border-cyan-400/30 shadow-lg">
          {/* Crown Icon */}
          <div className="relative">
            <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-cyan-300 rounded-sm transform rotate-45"></div>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-gradient-to-br from-magenta-400 to-magenta-300 rounded-sm transform rotate-45"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-magenta-400 to-magenta-300 rounded-sm transform rotate-45"></div>
          </div>
          
          {/* Golf Club Line */}
          <div className="absolute w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-magenta-400 transform rotate-12"></div>
          
          {/* Neon Ring Effects */}
          <div className="absolute inset-0 border border-cyan-400/20 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Outer Glow Ring */}
        <div className="absolute -inset-1 border border-cyan-400/30 rounded-xl animate-spin-slow"></div>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="ml-3">
          <div className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent`}>
            KING COVY
          </div>
          <div className={`${size === 'sm' ? 'text-xs' : 'text-xs'} font-semibold bg-gradient-to-r from-magenta-400 to-magenta-300 bg-clip-text text-transparent`}>
            GOLF CLUB
          </div>
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="hover:opacity-80 transition-opacity">
      {LogoContent}
    </Link>
  ) : LogoContent;
};

export default Logo;
