'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '../UI/Button';

interface PassengerData {
  id: number;
  companyLat: number;
  companyLng: number;
  employeeLat: number;
  employeeLng: number;
  shiftStart: string;
  shiftEnd: string;
  empCount: number;
  name?: string;
  address?: string;
}

interface GoogleSheetViewProps {
  onOptimize: () => void;
}

export default function GoogleSheetView({ onOptimize }: GoogleSheetViewProps) {
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Generate 60+ passengers with messy, unorganized data
  useEffect(() => {
    setIsLoading(true);
    const generateData = () => {
      const data: PassengerData[] = [];
      const baseLat = 24.36524921;
      const baseLng = 54.56290389;
      
      // Generate at least 60 passengers
      for (let i = 0; i < 65; i++) {
        // Add randomness and inconsistencies
        const latOffset = (Math.random() - 0.5) * 0.2;
        const lngOffset = (Math.random() - 0.5) * 0.3;
        
        // Some rows have inconsistent shift times
        const shiftVariations = [
          { start: '9:00', end: '14:00' },
          { start: '8:30', end: '17:00' },
          { start: '9:00', end: '14:00' },
          { start: '9:15', end: '14:30' },
          { start: '9:00', end: '14:00' },
        ];
        const shift = shiftVariations[Math.floor(Math.random() * shiftVariations.length)];
        
        // Varying employee counts (some inconsistent)
        const empCount = i % 3 === 0 ? Math.floor(Math.random() * 3) + 1 : 12;
        
        data.push({
          id: i + 1,
          companyLat: baseLat + (Math.random() - 0.5) * 0.001,
          companyLng: baseLng + (Math.random() - 0.5) * 0.001,
          employeeLat: baseLat + latOffset + (Math.random() - 0.5) * 0.05,
          employeeLng: baseLng + lngOffset + (Math.random() - 0.5) * 0.05,
          shiftStart: shift.start,
          shiftEnd: shift.end,
          empCount: empCount,
        });
      }
      
      // Shuffle some rows to make it messy
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }
      
      setPassengerData(data);
      
      // Randomly highlight some problematic rows
      const problematicRows = new Set<number>();
      for (let i = 0; i < 15; i++) {
        problematicRows.add(Math.floor(Math.random() * data.length));
      }
      setHighlightedRows(problematicRows);
      setIsLoading(false);
    };

    generateData();
  }, []);

  const getRowColor = (index: number, row: PassengerData) => {
    if (highlightedRows.has(index)) {
      return 'bg-yellow-100 border-yellow-300';
    }
    if (row.empCount !== 12) {
      return 'bg-red-50 border-red-200';
    }
    if (row.shiftStart !== '9:00' || row.shiftEnd !== '14:00') {
      return 'bg-orange-50 border-orange-200';
    }
    return 'bg-white border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-swvl-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sm:p-6"
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-swvl-dark mb-2">
          Your Current Employee Data Management
        </h2>
        <p className="text-xs sm:text-sm text-swvl-gray-500">
          Managing {passengerData.length} employees across multiple spreadsheets with inconsistent data
        </p>
      </div>

      {/* Google Sheets-like interface */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-inner">
        {/* Sheet header */}
        <div className="bg-gray-50 border-b border-gray-300 px-2 sm:px-4 py-2 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 text-xs sm:text-sm text-gray-600 font-medium ml-4">
            Employee_Transport_Data_2025.xlsx
          </div>
        </div>

        {/* Column headers */}
        <div className="bg-gray-100 border-b-2 border-gray-400 grid grid-cols-7 gap-1 px-1 sm:px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 sticky top-0 z-10">
          <div className="px-2">ID</div>
          <div className="px-2">Company Lat</div>
          <div className="px-2">Company Lng</div>
          <div className="px-2">Employee Lat</div>
          <div className="px-2">Employee Lng</div>
          <div className="px-2">Shift Start</div>
          <div className="px-2">Shift End</div>
        </div>

        {/* Scrollable data rows */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {passengerData.map((row, index) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.01 }}
              className={`grid grid-cols-7 gap-1 px-1 sm:px-2 py-2 text-xs sm:text-sm border-b border-gray-200 ${getRowColor(index, row)} hover:bg-gray-50 transition-colors`}
            >
              <div className="px-2 font-mono text-gray-600">{row.id}</div>
              <div className="px-2 font-mono text-gray-700">{row.companyLat.toFixed(8)}</div>
              <div className="px-2 font-mono text-gray-700">{row.companyLng.toFixed(8)}</div>
              <div className="px-2 font-mono text-gray-700">{row.employeeLat.toFixed(8)}</div>
              <div className="px-2 font-mono text-gray-700">{row.employeeLng.toFixed(8)}</div>
              <div className={`px-2 ${row.shiftStart !== '9:00' ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}>
                {row.shiftStart}
              </div>
              <div className={`px-2 ${row.shiftEnd !== '14:00' ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}>
                {row.shiftEnd}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Issues summary */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2 mb-2">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-yellow-800 mb-1">Data Quality Issues Detected</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• {highlightedRows.size} rows with inconsistent coordinates</li>
              <li>• {passengerData.filter(r => r.empCount !== 12).length} rows with varying employee counts</li>
              <li>• {passengerData.filter(r => r.shiftStart !== '9:00' || r.shiftEnd !== '14:00').length} rows with different shift times</li>
              <li>• No route optimization or grouping</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-4 sm:mt-6">
        <Button
          onClick={onOptimize}
          className="w-full bg-gradient-to-r from-swvl-primary to-swvl-accent hover:from-swvl-accent hover:to-swvl-primary transition-all duration-300 text-base sm:text-lg py-3 sm:py-4"
        >
          Optimize My Routes
        </Button>
      </div>
    </motion.div>
  );
}

