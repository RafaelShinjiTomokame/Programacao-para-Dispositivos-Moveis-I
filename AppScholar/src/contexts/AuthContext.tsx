import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextData {
  isLoggedIn: boolean;
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    // Simulação: qualquer email que contenha "@" e senha não vazia é válido
    if (email.trim() !== '' && password.trim() !== '' && email.includes('@')) {
      setUser(email);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);