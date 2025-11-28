'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function PassengerSlider() {
  const passengerCount = useAppStore((state) => state.passengerCount);
  const setPassengerCount = useAppStore((state) => state.setPassengerCount);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const min = 1;
  const max = 200;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newValue = Math.round(min + percentage * (max - min));
      setPassengerCount(newValue);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateValue(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    setPassengerCount(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    setPassengerCount(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const percentage = ((passengerCount - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <label className="text-xs sm:text-sm font-medium text-swvl-dark">Number of Employees</label>
        <motion.span
          key={passengerCount}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-swvl-primary to-swvl-accent bg-clip-text text-transparent"
        >
          {passengerCount}
        </motion.span>
      </div>

      <div
        ref={sliderRef}
        className="relative h-2 sm:h-3 bg-swvl-gray-200 rounded-full cursor-pointer touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <motion.div
          className="absolute h-full bg-gradient-to-r from-swvl-primary via-swvl-accent to-swvl-primary rounded-full shadow-sm"
          style={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 border-swvl-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${percentage}% - 10px)` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-swvl-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

