'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function ConstraintsInput() {
  const constraints = useAppStore((state) => state.constraints);
  const setConstraints = useAppStore((state) => state.setConstraints);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="block text-xs sm:text-sm font-medium text-swvl-dark mb-2">
          Max Travel Time
        </label>
        <div className="relative">
          <input
            type="number"
            min="5"
            max="120"
            value={constraints.maxTime}
            onChange={(e) =>
              setConstraints({
                ...constraints,
                maxTime: parseInt(e.target.value) || 30,
              })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-swvl-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-swvl-primary focus:border-transparent transition-all text-swvl-dark text-sm sm:text-base"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-swvl-gray-500 text-xs sm:text-sm">
            min
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="block text-xs sm:text-sm font-medium text-swvl-dark mb-2">
          Max Distance
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="100"
            value={constraints.maxDistance}
            onChange={(e) =>
              setConstraints({
                ...constraints,
                maxDistance: parseInt(e.target.value) || 20,
              })
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-swvl-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-swvl-primary focus:border-transparent transition-all text-swvl-dark text-sm sm:text-base"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-swvl-gray-500 text-xs sm:text-sm">
            km
          </span>
        </div>
      </motion.div>
    </div>
  );
}

