'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefit: string;
  metric: string;
}

const FEATURES: Feature[] = [
  {
    id: 'cost-reduction',
    title: 'Reduce Transportation Costs',
    description: 'Optimize routes and vehicle utilization to cut transportation expenses by up to 40%',
    icon: '💰',
    benefit: 'Save up to',
    metric: '40%',
  },
  {
    id: 'time-savings',
    title: 'Save Employee Time',
    description: 'Efficient routing reduces commute time, improving work-life balance and productivity',
    icon: '⏱️',
    benefit: 'Save up to',
    metric: '2 hours/week',
  },
  {
    id: 'sustainability',
    title: 'Reduce Carbon Footprint',
    description: 'Optimized routes and shared transportation significantly reduce CO2 emissions',
    icon: '🌱',
    benefit: 'Reduce emissions by',
    metric: '35%',
  },
  {
    id: 'reliability',
    title: '99.5% On-Time Performance',
    description: 'Real-time tracking and route optimization ensure employees arrive on time, every time',
    icon: '✅',
    benefit: 'On-time rate',
    metric: '99.5%',
  },
  {
    id: 'scalability',
    title: 'Scale Seamlessly',
    description: 'Easily accommodate growing teams from 10 to 10,000+ employees with flexible fleet management',
    icon: '📈',
    benefit: 'Scale from',
    metric: '10 to 10K+',
  },
  {
    id: 'analytics',
    title: 'Data-Driven Insights',
    description: 'Comprehensive analytics dashboard helps you make informed decisions about your transportation needs',
    icon: '📊',
    benefit: 'Real-time',
    metric: 'Analytics',
  },
];

export default function FeaturesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
  };

  const currentFeature = FEATURES[currentIndex];

  return (
    <div className="w-full bg-gradient-to-br from-swvl-primary/5 via-swvl-accent/5 to-swvl-secondary/5 rounded-xl p-4 sm:p-6 border border-white/50">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-swvl-dark">Why Choose SWVL?</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-lg bg-white hover:bg-swvl-light transition-colors shadow-sm"
            aria-label="Previous feature"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-lg bg-white hover:bg-swvl-light transition-colors shadow-sm"
            aria-label="Next feature"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative h-[200px] sm:h-[240px] overflow-hidden rounded-lg">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6"
          >
            <motion.div
              className="text-5xl sm:text-6xl mb-4 sm:mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {currentFeature.icon}
            </motion.div>
            <h4 className="text-lg sm:text-xl font-bold text-swvl-dark mb-2 sm:mb-3">
              {currentFeature.title}
            </h4>
            <p className="text-sm sm:text-base text-swvl-gray-600 mb-4 sm:mb-6 max-w-md">
              {currentFeature.description}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xs sm:text-sm text-swvl-gray-500">{currentFeature.benefit}</span>
              <motion.span
                key={currentFeature.metric}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-swvl-primary to-swvl-accent bg-clip-text text-transparent"
              >
                {currentFeature.metric}
              </motion.span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-gradient-to-r from-swvl-primary to-swvl-accent'
                : 'w-2 h-2 bg-swvl-gray-300 hover:bg-swvl-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

