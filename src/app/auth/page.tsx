"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Sign in was cancelled or failed. Please try again.");
    }
    setSigningIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/images/logo-v2.png" alt="GaadiBroker" className="h-[5rem] w-auto mx-auto" />
          </Link>
          <p className="text-slate-500 text-sm mt-3">India&apos;s trusted pre-owned car marketplace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-extrabold text-slate-900 text-center tracking-tight mb-2">
              Welcome to GaadiBroker
            </h1>
            <p className="text-slate-500 text-sm text-center mb-8">
              Sign in to access dealer contacts, save cars, and sell your car
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-8">
              {[
                "View dealer contact numbers",
                "Get best price quotes",
                "Sell your car easily",
                "Save cars to wishlist",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {benefit}
                </div>
              ))}
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-slate-700 disabled:opacity-50 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {signingIn ? "Signing in..." : "Continue with Google"}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  {error}
                </p>
              </div>
            )}

            <p className="text-[0.6875rem] text-slate-400 text-center mt-6">
              Free to join. No credit card required.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 pb-6">
            <p className="text-center text-xs text-slate-400">
              By continuing, you agree to our{" "}
              <span className="text-slate-500 hover:text-orange-500 cursor-pointer transition-colors">Terms of Service</span>
              {" & "}
              <span className="text-slate-500 hover:text-orange-500 cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Bottom link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 text-sm hover:text-slate-700 transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Back to GaadiBroker
          </Link>
        </div>
      </div>
    </div>
  );
}
