"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  const signInWithGoogle = async () => {
    try {
      const { auth } = await import("@/lib/firebase");
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Create/update user profile in Firestore via API
      const token = await result.user.getIdToken();
      await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: result.user.displayName || "",
          avatar: result.user.photoURL || "",
        }),
      });
    } catch (e) {
      console.error("Google sign-in error:", e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      const { auth } = await import("@/lib/firebase");
      const { signOut: firebaseSignOut } = await import("firebase/auth");
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
