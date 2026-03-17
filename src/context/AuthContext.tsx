import React, { createContext, useCallback, useContext, useState } from "react";

interface TAuthUser {
  username: string;
}

interface TAuthContextValue {
  user: TAuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const CREDENTIALS = {
  username: "admin",
  password: "password123",
};

const STORAGE_KEY = "auth_user";

function loadUserFromStorage(): TAuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TAuthUser;
  } catch {
    return null;
  }
}

const AuthContext = createContext<TAuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TAuthUser | null>(loadUserFromStorage);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const authUser: TAuthUser = { username };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: user !== null }}>{children}</AuthContext.Provider>;
}

export function useAuth(): TAuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
