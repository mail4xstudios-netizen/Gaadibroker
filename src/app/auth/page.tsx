"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signup, login, authError, setAuthError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already signed in
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

  const switchMode = () => {
    setIsLogin(!isLogin);
    setAuthError("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setAuthError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(phone, password);
      } else {
        await signup(phone, password, name);
      }
      router.push("/");
    } catch { /* error handled in context */ }
    setSubmitting(false);
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
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => switchMode()}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                isLogin
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode()}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                !isLogin
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-extrabold text-slate-900 text-center tracking-tight mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-500 text-sm text-center mb-6">
              {isLogin
                ? "Login with your mobile number and password"
                : "Sign up with your mobile number"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (signup only) */}
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setAuthError(""); }}
                    className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl outline-none focus:border-orange-400 transition-colors text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Mobile Number</label>
                <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-orange-400 transition-colors">
                  <span className="px-3 py-3 bg-slate-50 text-slate-600 font-semibold text-sm border-r border-slate-200">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setAuthError("");
                    }}
                    className="flex-1 px-3 py-3 text-sm outline-none bg-white text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  {isLogin ? "Password" : "Set Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Min 6 characters"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
                    className="w-full px-4 py-3 pr-12 text-sm border-2 border-slate-200 rounded-xl outline-none focus:border-orange-400 transition-colors text-slate-900 placeholder:text-slate-400"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                    {authError}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || phone.length !== 10 || password.length < 6}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 shadow-md shadow-orange-200"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </span>
                ) : (
                  isLogin ? "Login" : "Create Account"
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-sm text-slate-500 text-center mt-5">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={switchMode} className="text-orange-600 font-semibold hover:text-orange-700">
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>

            <p className="text-[0.6875rem] text-slate-400 text-center mt-4">
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
