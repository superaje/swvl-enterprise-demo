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
}

interface GoogleSheetViewProps {
  onOptimize: () => void;
}

export default function GoogleSheetView({ onOptimize }: GoogleSheetViewProps) {
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const generateData = () => {
      const data: PassengerData[] = [];
      const baseLat = 24.36524921;
      const baseLng = 54.56290389;
      
      for (let i = 0; i < 65; i++) {
        const latOffset = (Math.random() - 0.5) * 0.2;
        const lngOffset = (Math.random() - 0.5) * 0.3;
        
        const shiftVariations = [
          { start: '9:00', end: '14:00' },
          { start: '8:30', end: '17:00' },
          { start: '9:00', end: '14:00' },
          { start: '9:15', end: '14:30' },
          { start: '9:00', end: '14:00' },
        ];
        const shift = shiftVariations[Math.floor(Math.random() * shiftVariations.length)];
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
      
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }
      
      setPassengerData(data);
      
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
      return 'bg-yellow-50';
    }
    if (row.empCount !== 12) {
      return 'bg-red-50';
    }
    if (row.shiftStart !== '9:00' || row.shiftEnd !== '14:00') {
      return 'bg-orange-50';
    }
    return 'bg-white';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-swvl-primary border-t-transparent"></div>
      </div>
    );
  }

  const inconsistentCount = passengerData.filter(r => r.empCount !== 12).length;
  const inconsistentShifts = passengerData.filter(r => r.shiftStart !== '9:00' || r.shiftEnd !== '14:00').length;

  return (
    <div>
      {/* Header with Title, Subtitle, and CTA Above Fold */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Looks familiar?
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Stop handling your transportation like it&apos;s 1999
        </p>
        
        {/* CTA Above Fold */}
        <div className="mb-8">
          <Button
            onClick={onOptimize}
            className="bg-swvl-primary hover:bg-swvl-primary/90 text-white px-8 py-3 text-base font-semibold rounded-md transition-colors"
          >
            Optimize My Routes
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900">
                Current Employee Data Management
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {passengerData.length} employees • Multiple spreadsheets • Inconsistent data
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Company Latitude
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Company Longitude
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Employee Latitude
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Employee Longitude
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shift Start
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Shift End
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Emp Count
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {passengerData.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${getRowColor(index, row)} hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                    {row.companyLat.toFixed(8)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                    {row.companyLng.toFixed(8)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                    {row.employeeLat.toFixed(8)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                    {row.employeeLng.toFixed(8)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    row.shiftStart !== '9:00' ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {row.shiftStart}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    row.shiftEnd !== '14:00' ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {row.shiftEnd}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    row.empCount !== 12 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {row.empCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-600">Total Rows: </span>
              <span className="font-semibold text-gray-900">{passengerData.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Inconsistent Shifts: </span>
              <span className="font-semibold text-orange-600">{inconsistentShifts}</span>
            </div>
            <div>
              <span className="text-gray-600">Varying Counts: </span>
              <span className="font-semibold text-red-600">{inconsistentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
