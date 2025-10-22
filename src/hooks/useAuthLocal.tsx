
import React, { createContext, useContext, useState, useEffect } from "react";

// Each user: {email, profileName}
export interface LocalUser {
  email: string;
  profileName: string;
}

const USERS_KEY = "invoicecraft-local-users";
const AUTH_USER_KEY = "invoicecraft-auth-user";

function getUsers(): LocalUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

interface AuthContextType {
  user: LocalUser | null;
  signUp: (email: string, profileName: string) => { success: boolean; error?: string };
  signIn: (email: string) => { success: boolean; error?: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const signUp = (email: string, profileName: string) => {
    const users = getUsers();
    if (users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, error: "Email already registered. Please sign in." };
    }
    const newUser = { email: email.trim(), profileName: profileName.trim() };
    const updated = [...users, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const signIn = (email: string) => {
    const users = getUsers();
    const found = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, error: "No account found for that email. Please sign up." };
    }
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(found));
    setUser(found);
    return { success: true };
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthLocal() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthLocal must be used within AuthProvider");
  return ctx;
}
