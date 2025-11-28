'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface BookCallCTAProps {
  variant?: 'inline' | 'floating';
}

export default function BookCallCTA({ variant = 'inline' }: BookCallCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`${
        variant === 'floating'
          ? 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[320px] sm:max-w-sm'
          : 'w-full'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-gradient-to-br from-swvl-primary via-swvl-accent to-swvl-primary rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Agent Photo */}
            <motion.div
              className="relative flex-shrink-0"
              animate={{ rotate: isHovered ? [0, -5, 5, -5, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                {/* TODO: Replace with actual Jennifer Lawrence photo - add to /public/jennifer-lawrence.jpg */}
                <Image
                  src="/jennifer-lawrence.jpg"
                  alt="Jennifer Lawrence - SWVL Transport Advisor"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face&auto=format';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-swvl-primary/20 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <motion.h3
                className="text-base sm:text-lg font-bold text-white mb-1.5 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Get Your Free Customized Quote
              </motion.h3>
              <p className="text-white/95 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                Book a call with <span className="font-semibold text-white">Jennifer</span>, our transport advisor, for a personalized solution tailored to your needs.
              </p>
              
              <motion.button
                className="w-full bg-white text-swvl-primary font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // In a real app, this would open a booking modal or redirect
                  window.open('https://calendly.com/swvl-advisor', '_blank');
                }}
              >
                <span className="relative z-10 text-sm sm:text-base">Book a Free Call</span>
                <motion.svg
                  className="w-4 h-4 sm:w-5 sm:h-5 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-swvl-primary/10 to-swvl-accent/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 flex items-center justify-center gap-4 text-white/80 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-1.4.463-2.4 1.74-2.4 3.25 0 1.806 1.465 3.25 3.25 3.25s3.25-1.444 3.25-3.25c0-1.51-1-2.787-2.4-3.25-.783-.26-.38-1.5.589-1.5h3.461a1 1 0 00.951-.69l1.07-3.292c.3-.921-1.603-.921-1.902 0l-1.07 3.292a1 1 0 01-.951.69H13.41c-.969 0-1.371 1.24-.588 1.5 1.4.463 2.4 1.74 2.4 3.25 0 1.806-1.465 3.25-3.25 3.25S7.75 13.056 7.75 11.25c0-1.51 1-2.787 2.4-3.25.783-.26.38-1.5-.589-1.5H6.139a1 1 0 01-.951-.69L4.118 5.927c-.3-.921-1.603-.921-1.902 0z" />
              </svg>
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Commitment</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

