'use client';

import Button from './Button';

interface CTASectionProps {
  onBookCall: () => void;
  onCallNow: () => void;
  compact?: boolean;
}

export default function CTASection({ onBookCall, onCallNow, compact = false }: CTASectionProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={onBookCall}
          variant="outline"
          className="w-full border-2 border-swvl-primary text-swvl-primary hover:bg-swvl-primary hover:text-white py-3"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a Call
          </div>
        </Button>

        <Button
          onClick={onCallNow}
          className="w-full bg-swvl-primary hover:bg-swvl-primary/90 text-white py-3"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Me Now
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ready to Transform Your Transportation?
        </h3>
        <p className="text-sm text-gray-600">
          Let&apos;s discuss how SWVL can optimize your employee transportation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={onBookCall}
          variant="outline"
          className="w-full border-2 border-swvl-primary text-swvl-primary hover:bg-swvl-primary hover:text-white py-3"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a Call
          </div>
        </Button>

        <Button
          onClick={onCallNow}
          className="w-full bg-swvl-primary hover:bg-swvl-primary/90 text-white py-3"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Me Now
          </div>
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Our team will get back to you within 24 hours
      </p>
    </div>
  );
}
