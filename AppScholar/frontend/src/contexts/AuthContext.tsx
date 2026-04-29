import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  nome: string;
  perfil: string;
}

interface AuthContextData {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, verifica se já existe um token salvo
  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@AppScholar:token');
      const storedUser = await AsyncStorage.getItem('@AppScholar:user');
      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { login: email, senha: password });
      const { token, usuario } = response.data;

      // Salva token e dados do usuário
      await AsyncStorage.setItem('@AppScholar:token', token);
      await AsyncStorage.setItem('@AppScholar:user', JSON.stringify(usuario));

      // Define o token padrão para todas as próximas requisições
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setUser(usuario);
      return true;
    } catch (error) {
      console.log('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@AppScholar:token');
    await AsyncStorage.removeItem('@AppScholar:user');
    api.defaults.headers.Authorization = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);