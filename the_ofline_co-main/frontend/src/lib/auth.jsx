import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, formatApiError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("ofline_token");
    if (!token) {
      setAdmin(null);
      setChecking(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setAdmin(data);
    } catch {
      localStorage.removeItem("ofline_token");
      setAdmin(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("ofline_token", data.access_token);
      setAdmin(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: formatApiError(err) };
    }
  };

  const logout = () => {
    localStorage.removeItem("ofline_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, checking, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
