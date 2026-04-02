"use client";

export default function MobileBottomBar({ carName }: { carName?: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 px-4 py-3 z-40 flex gap-3">
      <a
        href="tel:+918108797000"
        className="flex-1 bg-gray-900 text-white text-center py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call Now
      </a>
      <a
        href={`https://wa.me/918108797000?text=${encodeURIComponent(`Hi! I'm interested in ${carName || "a car"} on GaadiBroker.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-orange-500 text-white text-center py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
      >
        Get Best Deal
      </a>
    </div>
  );
}
