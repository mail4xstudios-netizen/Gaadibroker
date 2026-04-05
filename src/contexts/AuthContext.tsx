"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AppUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (phone: string, password: string, name: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  signOut: () => void;
  authError: string;
  setAuthError: (err: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  signOut: () => {},
  authError: "",
  setAuthError: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gb_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          setUser(parsed);
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const saveUser = (userData: AppUser) => {
    setUser(userData);
    localStorage.setItem("gb_user", JSON.stringify(userData));
  };

  const signup = async (phone: string, password: string, name: string) => {
    setAuthError("");
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Signup failed");
        throw new Error(data.error);
      }
      saveUser({
        id: data.user.id,
        name: data.user.name,
        phone: data.user.phone,
        role: data.user.role,
        token: data.token,
      });
    } catch (e) {
      if (e instanceof Error && !authError) {
        setAuthError(e.message);
      }
      throw e;
    }
  };

  const login = async (phone: string, password: string) => {
    setAuthError("");
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Login failed");
        throw new Error(data.error);
      }
      saveUser({
        id: data.user.id,
        name: data.user.name,
        phone: data.user.phone,
        role: data.user.role,
        token: data.token,
      });
    } catch (e) {
      if (e instanceof Error && !authError) {
        setAuthError(e.message);
      }
      throw e;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("gb_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, signOut, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
