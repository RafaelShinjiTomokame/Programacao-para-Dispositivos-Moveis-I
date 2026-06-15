import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  nome: string;
  perfil: string;
  role: 'admin' | 'professor' | 'aluno';
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

  useEffect(() => {
    async function loadStorage() {
      try {
        const storedToken = await AsyncStorage.getItem('@token');
        const storedUser = await AsyncStorage.getItem('@user');
        
        if (storedToken && storedUser) {
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
          console.log('✅ Usuário carregado:', JSON.parse(storedUser).nome);
        } else {
          console.log('ℹ️ Nenhum usuário salvo');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        // Limpar dados corrompidos
        await AsyncStorage.removeItem('@token');
        await AsyncStorage.removeItem('@user');
      } finally {
        setLoading(false); // ⚠️ SEMPRE executado
      }
    }
    
    loadStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Tentando login:', email);
      const response = await api.post('/login', { login: email, senha: password });
      const { token, usuario } = response.data;
      
      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@user', JSON.stringify(usuario));
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(usuario);
      console.log('✅ Login bem-sucedido:', usuario.nome);
      return true;
    } catch (error: any) {
      console.error('❌ Erro no login:', error.message);
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data);
      } else if (error.request) {
        console.error('Sem resposta do servidor - verifique o backend');
      }
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@user');
    api.defaults.headers.Authorization = null;
    setUser(null);
    console.log('👋 Logout realizado');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);