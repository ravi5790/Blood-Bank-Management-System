import React, { createContext, useContext, useEffect, useState } from "react";
import { api, formatError } from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null=loading, false=anon, object=auth
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        setUser(false);
      }
    })();
  }, []);

  async function login(email, password) {
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data?.token) localStorage.setItem("bb_token", data.token);
      setUser(data.user);
      return data.user;
    } catch (e) {
      const msg = formatError(e.response?.data?.detail) || e.message;
      setError(msg);
      throw new Error(msg);
    }
  }

  async function register(payload) {
    setError("");
    try {
      const { data } = await api.post("/auth/register", payload);
      if (data?.token) localStorage.setItem("bb_token", data.token);
      setUser(data.user);
      return data.user;
    } catch (e) {
      const msg = formatError(e.response?.data?.detail) || e.message;
      setError(msg);
      throw new Error(msg);
    }
  }

  async function logout() {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("bb_token");
    setUser(false);
  }

  return (
    <AuthCtx.Provider value={{ user, setUser, login, register, logout, error }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
