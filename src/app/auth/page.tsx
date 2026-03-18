"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthTab = "login" | "signup";
type AuthMethod = "password" | "otp";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("login");
  const [method, setMethod] = useState<AuthMethod>("password");
  const [step, setStep] = useState<"form" | "otp">("form");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpTimer, setOtpTimer] = useState(0);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
    setStep("form");
    setMethod("password");
  };

  const handleTabChange = (newTab: AuthTab) => {
    setTab(newTab);
    resetForm();
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // Send OTP
  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          purpose: tab === "signup" ? "signup" : "login",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setOtpTimer(120);
        setSuccess(data.message);
        // In dev mode, auto-fill OTP
        if (data.otp) {
          const digits = data.otp.split("");
          setOtp(digits);
        }
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          otp: otpCode,
          name: name || undefined,
          purpose: tab,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("user_token", data.token);
        sessionStorage.setItem("user_refresh_token", data.refreshToken);
        sessionStorage.setItem("user_data", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password login/signup
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "signup" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (tab === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const endpoint = tab === "signup" ? "/api/user/signup" : "/api/user/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("user_token", data.token);
        sessionStorage.setItem("user_refresh_token", data.refreshToken);
        sessionStorage.setItem("user_data", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fadeSlide = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" as const },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <img src="/images/logo.png" alt="GaadiBroker" className="h-18 w-auto mx-auto" />
          </Link>
          <p className="text-gray-500 text-sm mt-3">India&apos;s trusted pre-owned car marketplace</p>
        </motion.div>

        {/* Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800/50">
            {(["login", "signup"] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-all relative ${
                  tab === t ? "text-orange-500" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div key="form" {...fadeSlide}>
                  {/* Auth Method Toggle */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setMethod("password")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                        method === "password"
                          ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                          : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-300"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                        Password
                      </span>
                    </button>
                    <button
                      onClick={() => setMethod("otp")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                        method === "otp"
                          ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                          : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-300"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
                        Email OTP
                      </span>
                    </button>
                  </div>

                  {method === "password" ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      {/* Name field - signup only */}
                      <AnimatePresence>
                        {tab === "signup" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FloatingInput
                              label="Full Name"
                              type="text"
                              value={name}
                              onChange={setName}
                              autoComplete="name"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <FloatingInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        autoComplete="email"
                      />

                      {/* Phone - signup only */}
                      <AnimatePresence>
                        {tab === "signup" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FloatingInput
                              label="Phone Number"
                              type="tel"
                              value={phone}
                              onChange={setPhone}
                              autoComplete="tel"
                              prefix="+91"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative">
                        <FloatingInput
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={setPassword}
                          autoComplete={tab === "signup" ? "new-password" : "current-password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                          )}
                        </button>
                      </div>

                      {tab === "signup" && (
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                          <svg className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
                          <span>Minimum 8 characters with a mix of letters and numbers for security</span>
                        </div>
                      )}

                      {error && <ErrorMessage message={error} />}

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Spinner /> {tab === "signup" ? "Creating Account..." : "Signing In..."}
                          </span>
                        ) : (
                          tab === "signup" ? "Create Account" : "Sign In"
                        )}
                      </motion.button>
                    </form>
                  ) : (
                    /* OTP Method */
                    <div className="space-y-4">
                      <FloatingInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        autoComplete="email"
                      />

                      {tab === "signup" && (
                        <FloatingInput
                          label="Full Name"
                          type="text"
                          value={name}
                          onChange={setName}
                          autoComplete="name"
                        />
                      )}

                      {error && <ErrorMessage message={error} />}
                      {success && <SuccessMessage message={success} />}

                      <motion.button
                        onClick={sendOtp}
                        disabled={loading || !email.trim()}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Spinner /> Sending OTP...
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-xs text-gray-600 uppercase tracking-wider">or continue with</span>
                    <div className="flex-1 h-px bg-gray-800" />
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:border-gray-600 transition-all">
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:border-gray-600 transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
                      GitHub
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* OTP Verification Step */
                <motion.div key="otp" {...fadeSlide}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Verify Your Email</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Enter the 6-digit code sent to <span className="text-gray-300">{email}</span>
                    </p>
                  </div>

                  {/* OTP Input Boxes */}
                  <div className="flex justify-center gap-3 mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <motion.input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-gray-800/50 text-white focus:outline-none transition-all ${
                          digit
                            ? "border-orange-500 shadow-lg shadow-orange-500/10"
                            : "border-gray-700 focus:border-orange-500"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Timer & Resend */}
                  <div className="text-center mb-6">
                    {otpTimer > 0 ? (
                      <p className="text-gray-500 text-sm">
                        Resend OTP in <span className="text-orange-500 font-semibold">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, "0")}</span>
                      </p>
                    ) : (
                      <button onClick={sendOtp} className="text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors">
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {error && <ErrorMessage message={error} />}

                  <motion.button
                    onClick={verifyOtp}
                    disabled={loading || otp.join("").length !== 6}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2"><Spinner /> Verifying...</span>
                    ) : (
                      "Verify & Continue"
                    )}
                  </motion.button>

                  <button
                    onClick={() => { setStep("form"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                    className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-300 transition-colors"
                  >
                    &larr; Back to {tab === "login" ? "Sign In" : "Sign Up"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 pb-6">
            <p className="text-center text-xs text-gray-600">
              By continuing, you agree to our{" "}
              <span className="text-gray-400 hover:text-orange-500 cursor-pointer transition-colors">Terms of Service</span>
              {" & "}
              <span className="text-gray-400 hover:text-orange-500 cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Bottom link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Back to GaadiBroker
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Reusable Components ───

function FloatingInput({
  label, type, value, onChange, autoComplete, prefix,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      {prefix && isActive && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        className={`w-full bg-gray-800/50 border rounded-xl text-white text-sm transition-all focus:outline-none
          ${isActive ? "pt-6 pb-2" : "py-4"}
          ${prefix && isActive ? "pl-12" : "px-4"}
          ${!prefix ? "px-4" : ""}
          ${focused ? "border-orange-500 ring-1 ring-orange-500/20" : "border-gray-700 hover:border-gray-600"}`}
      />
      <label
        className={`absolute left-4 transition-all pointer-events-none ${
          isActive
            ? "top-2 text-[10px] uppercase tracking-wider font-semibold text-orange-500"
            : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
    >
      <p className="text-red-400 text-sm flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
        {message}
      </p>
    </motion.div>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
    >
      <p className="text-green-400 text-sm flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        {message}
      </p>
    </motion.div>
  );
}
