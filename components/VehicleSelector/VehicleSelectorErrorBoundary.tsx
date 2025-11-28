'use client';

import { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class VehicleSelectorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('VehicleSelector error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full flex flex-col items-center justify-center p-8 bg-swvl-light rounded-xl"
        >
          <div className="text-4xl mb-4">🚗</div>
          <h3 className="text-lg font-semibold text-swvl-dark mb-2">
            Unable to load 3D vehicle selector
          </h3>
          <p className="text-sm text-swvl-gray-500 mb-4 text-center">
            Please use the vehicle cards below to select your fleet.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-swvl-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

