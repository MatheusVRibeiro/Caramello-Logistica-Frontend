import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as authService from "@/services/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operador" | "motorista";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated users for demo
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@gmail.com": {
    password: "senha123",
    user: {
      id: "USR-177084976159115431",
      name: "Matheusss",
      email: "admin@gmail.com",
      role: "admin",
    },
  },
  "admin@rnlogistica.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "Administrador",
      email: "admin@rnlogistica.com",
      role: "admin",
    },
  },
  "operador@rnlogistica.com": {
    password: "operador123",
    user: {
      id: "2",
      name: "Operador",
      email: "operador@rnlogistica.com",
      role: "operador",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem("rn_logistica_user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("rn_logistica_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Try backend authentication first
    try {
      const res = await authService.login(email, password);
      
      if (res.success && res.data) {
        const { user, token } = res.data;
        
        setUser(user);
        localStorage.setItem("rn_logistica_user", JSON.stringify(user));
        if (token) localStorage.setItem("@RNLogistica:token", token);
        
        setIsLoading(false);
        return true;
      }
    } catch (e) {
      // ignore and fallback to demo users
    }

    // Fallback to demo users (local development)
    const normalizedEmail = email.toLowerCase().trim();
    const demoUser = DEMO_USERS[normalizedEmail];

    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      localStorage.setItem("rn_logistica_user", JSON.stringify(demoUser.user));
      // Clear any stored token when using demo
      localStorage.removeItem("@RNLogistica:token");
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rn_logistica_user");
    localStorage.removeItem("@RNLogistica:token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
