"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define los roles
type Role = "admin" | "user" | "guest";

interface AuthContextType {
  user: string | null;
  role: Role;
  login: (username: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("guest");

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role") as Role | null;

    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  // Guardar sesión al loguear
  const login = (username: string, role: Role) => {
    setUser(username);
    setRole(role);
    localStorage.setItem("user", username);
    localStorage.setItem("role", role);
  };

  // Permite cerrar sesión
  const logout = () => {
    setUser(null);
    setRole("guest");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
