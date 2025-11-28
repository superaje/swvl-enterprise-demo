'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function MonitoringDashboard() {
  const routes = useAppStore((state) => state.routes);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || routes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, routes.length]);

  const totalEmployees = routes.reduce(
    (sum, route) => sum + route.pickupPoints.reduce((s, p) => s + p.passengers, 0),
    0
  );
  const totalVehicles = routes.length;
  const completedPickups = Math.floor((currentTime / 100) * totalEmployees);
  const onTimeRate = 95 + Math.floor(Math.random() * 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Live Monitoring Dashboard</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalEmployees}</p>
          <p className="text-xs text-gray-600">Employees</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalVehicles}</p>
          <p className="text-xs text-gray-600">Active Vehicles</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">{completedPickups}</p>
          <p className="text-xs text-gray-600">Pickups Done</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-1">{onTimeRate}%</p>
          <p className="text-xs text-gray-600">On-Time Rate</p>
        </div>
      </div>

      <div className="space-y-3">
        {routes.map((route) => (
          <div key={route.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">
                {route.vehicle.icon} {route.vehicle.name}
              </h4>
              <span className={`text-xs font-medium ${currentTime > 90 ? 'text-green-600' : 'text-swvl-primary'}`}>
                {currentTime > 90 ? 'Completed' : 'In Transit'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-swvl-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${currentTime}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Stops: {route.pickupPoints.length}</span>
              <span>{currentTime}% Complete</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
