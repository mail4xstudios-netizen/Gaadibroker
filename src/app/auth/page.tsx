"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, sendOTP, verifyOTP, otpSent, otpError, setOtpError } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  if (!loading && user) {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setOtpError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSending(true);
    try {
      await sendOTP(phone, "recaptcha-container");
    } catch { /* error handled in context */ }
    setSending(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    setVerifying(true);
    try {
      await verifyOTP(otp);
      router.push("/");
    } catch { /* error handled in context */ }
    setVerifying(false);
  };

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
              {otpSent ? "Verify OTP" : "Login"}
            </h1>
            <p className="text-slate-500 text-sm text-center mb-8">
              {otpSent
                ? `We've sent a 6-digit OTP to +91 ${phone}`
                : "Enter your mobile number to continue"}
            </p>

            {!otpSent ? (
              <>
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

                {/* Phone Input */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Mobile Number</label>
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-orange-400 transition-colors">
                    <span className="px-3 py-3.5 bg-slate-50 text-slate-600 font-semibold text-sm border-r border-slate-200">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setOtpError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                      className="flex-1 px-3 py-3.5 text-sm outline-none bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={sending || phone.length !== 10}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 shadow-md shadow-orange-200"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Enter OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setOtpError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                    className="w-full px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] border-2 border-slate-200 rounded-xl outline-none focus:border-orange-400 transition-colors text-slate-900"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={verifying || otp.length !== 6}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 shadow-md shadow-orange-200 mb-3"
                >
                  {verifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <button
                  onClick={() => { setOtp(""); setOtpError(""); window.location.reload(); }}
                  className="w-full text-center text-sm text-slate-500 hover:text-orange-600 transition-colors"
                >
                  Change number / Resend OTP
                </button>
              </>
            )}

            {otpError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                  {otpError}
                </p>
              </div>
            )}

            <p className="text-[0.6875rem] text-slate-400 text-center mt-6">
              By continuing, you agree to our Terms of Service & Privacy Policy
            </p>
          </div>
        </div>

        {/* reCAPTCHA container (invisible) */}
        <div id="recaptcha-container" />

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
