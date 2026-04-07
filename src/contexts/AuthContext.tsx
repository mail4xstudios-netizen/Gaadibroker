"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser, ConfirmationResult } from "firebase/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  sendOTP: (phoneNumber: string, recaptchaContainerId: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  otpSent: boolean;
  otpError: string;
  setOtpError: (err: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  sendOTP: async () => {},
  verifyOTP: async () => {},
  signOut: async () => {},
  otpSent: false,
  otpError: "",
  setOtpError: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const { auth } = await import("@/lib/firebase");
        const { onAuthStateChanged } = await import("firebase/auth");

        if (auth && typeof auth.onAuthStateChanged === "function") {
          unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth init error:", e);
        setLoading(false);
      }
    }

    initAuth();
    return () => unsubscribe?.();
  }, []);

  const sendOTP = async (phoneNumber: string, recaptchaContainerId: string) => {
    setOtpError("");
    try {
      const { auth } = await import("@/lib/firebase");
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import("firebase/auth");

      // Clean up any existing reCAPTCHA
      const win = window as unknown as Record<string, unknown>;
      if (win.recaptchaVerifier) {
        try {
          (win.recaptchaVerifier as { clear: () => void }).clear();
        } catch { /* ignore */ }
      }

      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
      });
      win.recaptchaVerifier = recaptchaVerifier;

      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (e) {
      console.error("Send OTP error:", e);
      const msg = e instanceof Error ? e.message : "Failed to send OTP";
      if (msg.includes("too-many-requests")) {
        setOtpError("Too many attempts. Please try again later.");
      } else if (msg.includes("invalid-phone-number")) {
        setOtpError("Invalid phone number. Please check and try again.");
      } else {
        setOtpError(msg);
      }
      throw e;
    }
  };

  const verifyOTP = async (otp: string) => {
    setOtpError("");
    if (!confirmationResult) {
      setOtpError("Please request OTP first.");
      throw new Error("No confirmation result");
    }
    try {
      await confirmationResult.confirm(otp);
      setOtpSent(false);
      setConfirmationResult(null);
    } catch (e) {
      console.error("Verify OTP error:", e);
      const msg = e instanceof Error ? e.message : "Invalid OTP";
      if (msg.includes("invalid-verification-code")) {
        setOtpError("Invalid OTP. Please check and try again.");
      } else if (msg.includes("code-expired")) {
        setOtpError("OTP expired. Please request a new one.");
      } else {
        setOtpError(msg);
      }
      throw e;
    }
  };

  const signOut = async () => {
    try {
      const { auth } = await import("@/lib/firebase");
      const { signOut: firebaseSignOut } = await import("firebase/auth");
      await firebaseSignOut(auth);
      setOtpSent(false);
      setConfirmationResult(null);
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOTP, verifyOTP, signOut, otpSent, otpError, setOtpError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
