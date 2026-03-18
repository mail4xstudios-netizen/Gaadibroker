"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("user_token");
    const userData = sessionStorage.getItem("user_data");
    setIsLoggedIn(!!(token && userData));
  }, []);

  // Still checking auth state
  if (isLoggedIn === null) return <>{children}</>;

  // Logged in or user dismissed the prompt
  if (isLoggedIn || dismissed) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up relative">
          {/* Close / Skip */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <img src="/new/images/logo.png" alt="GaadiBroker" className="h-16 w-auto mx-auto mb-5" />

          {/* Content */}
          <h2 className="text-xl font-extrabold text-slate-900 text-center tracking-tight">
            Sign in to view details
          </h2>
          <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
            Create a free account or login to see full car details, contact sellers, and get the best deals.
          </p>

          {/* Benefits */}
          <div className="mt-6 space-y-2.5">
            {[
              "View complete car details & photos",
              "Contact sellers directly",
              "Get price alerts & recommendations",
              "Save cars to your wishlist",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5 text-sm text-slate-700">
                <span className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                </span>
                {benefit}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-7 space-y-3">
            <Link
              href="/auth"
              className="btn-primary w-full block text-center !py-3.5 text-base"
            >
              Login / Sign Up
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="w-full text-center py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[0.6875rem] text-slate-400 text-center mt-4">
            Free to join. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
