'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'staggerContainer' | 'scaleIn';
  delay?: number;
}

export const AnimatedSection = ({ 
  children, 
  className = "", 
  variant = 'fadeInUp',
  delay = 0 
}: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const variants = {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer,
    scaleIn
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Text Component
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const AnimatedText = ({ text, className = "", delay = 0 }: AnimatedTextProps) => {
  const words = text.split(" ");
  
  return (
    <motion.h1 
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      transition={{ delay }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: index * 0.1 }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// Animated Feature Card Component
interface AnimatedFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export const AnimatedFeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0,
  className = ""
}: AnimatedFeatureCardProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ duration: 0.6, delay }}
      className={`text-center group ${className}`}
    >
      <motion.div 
        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-8 w-8 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// Animated Button Component
interface AnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  delay?: number;
  disabled?: boolean;
}

export const AnimatedButton = ({ 
  children, 
  href, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = "",
  delay = 0,
  disabled = false
}: AnimatedButtonProps) => {
  const buttonClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-emerald-600 hover:bg-gray-50 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const baseClasses = `inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ${buttonClasses[variant]} ${sizeClasses[size]} ${className}`;

  const ButtonComponent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {href ? (
        <a href={href} className={baseClasses}>
          {children}
        </a>
      ) : (
        <button 
          type={type}
          onClick={onClick} 
          disabled={disabled}
          className={`${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {children}
        </button>
      )}
    </motion.div>
  );

  return ButtonComponent;
};

// Animated Background Elements
export const AnimatedBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Floating elements */}
      {typeof window !== 'undefined' && [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * (window.innerWidth || 1200),
            y: Math.random() * (window.innerHeight || 800),
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      {children}
    </div>
  );
};
