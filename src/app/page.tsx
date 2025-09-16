'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Shield, Truck, Trophy, Target, Zap, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FeaturedProducts from '@/components/products/FeaturedProducts';

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

// Animated Text Component
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(" ");
  
  return (
    <motion.h1 
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
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
const AnimatedFeatureCard = ({ icon: Icon, title, description, delay = 0 }: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) => {
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
      className="text-center group"
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

export default function HomePage() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [ctaRef, ctaInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800">
          <motion.div
            className="absolute inset-0 bg-black opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          />
          
          {/* Floating Golf Balls */}
          {typeof window !== 'undefined' && [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white rounded-full opacity-20"
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
        </div>

        <div ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInLeft}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6"
              >
                <CircleDot className="h-4 w-4 mr-2" />
                Premium Golf Equipment
              </motion.div>
              
              <AnimatedText 
                text="Premium Golf Equipment & Limited Release"
                className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white"
              />
              
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Discover boutique and collector's golf clubs, putters, and accessories. 
                Each piece is carefully selected for quality and authenticity, with custom 
                engravings and personalization options available.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center bg-white text-emerald-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 backdrop-blur-sm">
                    Learn More
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={fadeInRight}
            >
              <motion.div 
                className="bg-white rounded-3xl p-8 shadow-2xl"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Hero Image */}
                  <motion.div
                    className="relative w-full h-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    <Image
                      src="https://king-covy-assets.s3.amazonaws.com/homepage/hero/hero.png"
                      alt="King Covy Featured Product"
                      fill
                      className="object-cover rounded-2xl"
                      priority
                    />
                  </motion.div>
                  
                  {/* Animated background elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-20"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-6 h-6 bg-teal-400 rounded-full opacity-20"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </motion.div>
              
              {/* Floating badges */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.1 }}
              >
                New Arrivals
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                whileHover={{ scale: 1.1 }}
              >
                Free Shipping
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Why Choose King Covy?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Experience the difference with our premium golf equipment and exceptional service
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <AnimatedFeatureCard
              icon={Trophy}
              title="Premium Quality"
              description="Hand-picked boutique and collector's golf equipment from trusted brands and verified sources"
              delay={0}
            />
            <AnimatedFeatureCard
              icon={Shield}
              title="Authenticity Guaranteed"
              description="Every item is verified for authenticity with detailed condition reports and certificates"
              delay={0.2}
            />
            <AnimatedFeatureCard
              icon={Truck}
              title="Fast & Secure Shipping"
              description="Secure packaging and fast delivery to protect your investment with full insurance coverage"
              delay={0.4}
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Featured Products
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hand-picked premium golf equipment
            </motion.p>
          </div>
          <FeaturedProducts />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Shop by Category
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find exactly what you're looking for
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {[
              { name: 'Drivers', href: '/shop?category=drivers', image: 'https://king-covy-assets.s3.amazonaws.com/categories/drivers.png' },
              { name: 'Irons', href: '/shop?category=irons', image: 'https://king-covy-assets.s3.amazonaws.com/categories/irons.png' },
              { name: 'Putters', href: '/shop?category=putters', image: 'https://king-covy-assets.s3.amazonaws.com/categories/putters.png' },
              { name: 'Wedges', href: '/shop?category=wedges', image: 'https://king-covy-assets.s3.amazonaws.com/categories/wedges.png' },
              { name: 'Fairway Woods', href: '/shop?category=fairway-woods', image: 'https://king-covy-assets.s3.amazonaws.com/categories/fairway%20woods.png' },
              { name: 'Hybrids', href: '/shop?category=hybrids', image: 'https://king-covy-assets.s3.amazonaws.com/categories/hybrids.png' },
              { name: 'Accessories', href: '/shop?category=accessories', image: 'https://king-covy-assets.s3.amazonaws.com/categories/accessories.png' },
              { name: 'Limited Release', href: '/shop?category=collectibles', image: 'https://king-covy-assets.s3.amazonaws.com/categories/collectibles.png' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={category.href}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/30 transition-all duration-300" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                    <motion.div 
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-xl font-bold text-white drop-shadow-lg group-hover:text-cyan-300 transition-colors duration-300">
                        {category.name}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Neon Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-300" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-magenta-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-magenta-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-800 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {typeof window !== 'undefined' && [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * (window.innerWidth || 1200),
                y: Math.random() * (window.innerHeight || 800),
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <motion.div 
          ref={ctaRef}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            variants={fadeInUp}
          >
            Ready to Elevate Your Game?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Browse our collection of premium golf equipment and find your next favorite club
          </motion.p>
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/shop"
              className="inline-flex items-center bg-white text-emerald-600 font-semibold px-10 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl text-lg"
            >
              Shop Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}