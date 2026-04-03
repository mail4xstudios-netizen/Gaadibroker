"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DealerNumberGate({ carName }: { carName: string }) {
  const { user, loading, signInWithGoogle } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  if (loading) return null;

  if (user) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5">
        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
          Dealer Contact
        </h3>
        <a
          href="tel:+918108797000"
          className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 hover:bg-emerald-100 transition-colors"
        >
          <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
          </div>
          <div>
            <p className="font-bold text-emerald-800 text-sm">+91 8108797000</p>
            <p className="text-emerald-600 text-xs">Tap to call dealer</p>
          </div>
        </a>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      setShowModal(false);
    } catch { /* user cancelled */ }
    setSigningIn(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/80 p-5">
        <h3 className="font-bold text-slate-900 text-base mb-2">Get Dealer Number</h3>
        <p className="text-sm text-slate-500 mb-4">Sign in to view dealer contact details for this car</p>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full !py-3 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
          Sign in to Get Dealer Number
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <img src="/images/logo-v2.png" alt="GaadiBroker" className="h-12 w-auto mx-auto mb-4" />

            <h2 className="text-xl font-extrabold text-slate-900 text-center tracking-tight">
              Sign in to Get Dealer Number
            </h2>
            <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
              Sign in to view dealer contact details and get the best deals on <span className="font-medium text-slate-700">{carName}</span>
            </p>

            <div className="mt-5 space-y-2.5">
              {["View dealer contact number", "Get best price quotes", "Save cars to wishlist"].map((benefit) => (
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

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-slate-700 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {signingIn ? "Signing in..." : "Continue with Google"}
              </button>
            </div>

            <p className="text-[0.6875rem] text-slate-400 text-center mt-4">
              Free to join. No credit card required.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
