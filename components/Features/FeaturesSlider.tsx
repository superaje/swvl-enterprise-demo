'use client';

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
    description: 'Easily accommodate growing teams from 10 to 10 to 10,000+ employees with flexible fleet management',
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURES.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + FEATURES.length) % FEATURES.length);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits & Features</h3>

      <div className="relative h-48">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-3">{FEATURES[currentIndex].icon}</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {FEATURES[currentIndex].title}
          </h4>
          <p className="text-sm text-gray-600 max-w-md mb-4">
            {FEATURES[currentIndex].description}
          </p>
          <div className="text-swvl-primary font-semibold text-xl">
            {FEATURES[currentIndex].benefit} <span className="text-swvl-primary">{FEATURES[currentIndex].metric}</span>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center gap-2 mt-4">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-swvl-primary w-8' : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
