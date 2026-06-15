import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeModal from '../components/WelcomeModal';
import api from '../services/api';

interface CardItem {
  title: string;
  screen: string;
  icon: string;
  color: string;
  badge?: number;
}

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [showWelcome, setShowWelcome] = useState(false);
  const [avisosNaoLidos, setAvisosNaoLidos] = useState(0);

  // Mostrar modal de boas-vindas ao carregar
  useEffect(() => {
    if (user) {
      setShowWelcome(true);
    }
  }, []);

  // Carregar contagem de avisos não lidos
  useEffect(() => {
    const carregarNaoLidos = async () => {
      try {
        const response = await api.get('/avisos/nao-lidos');
        setAvisosNaoLidos(response.data.nao_lidos);
      } catch (err) {
        console.error('Erro ao carregar avisos não lidos:', err);
      }
    };

    carregarNaoLidos();

    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarNaoLidos, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cards diferentes por perfil de usuário
  const getCards = (): CardItem[] => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Alunos', screen: 'Alunos', icon: 'people', color: '#3498DB' },
          { title: 'Professores', screen: 'Professores', icon: 'person', color: '#2ECC71' },
          { title: 'Disciplinas', screen: 'Disciplinas', icon: 'book', color: '#9B59B6' },
          { title: 'Notas', screen: 'Notas', icon: 'create', color: '#E67E22' },
          { title: 'Boletim', screen: 'Boletim', icon: 'document-text', color: '#1ABC9C' },
          { title: 'Consultas', screen: 'Consultas', icon: 'search', color: '#34495E' },
          { 
            title: 'Avisos', 
            screen: 'Avisos', 
            icon: 'notifications', 
            color: '#E74C3C',
            badge: avisosNaoLidos 
          },
          { 
            title: 'Novo Aviso', 
            screen: 'CriarAviso', 
            icon: 'add-circle', 
            color: '#F39C12' 
          },
        ];
      case 'professor':
        return [
          { title: 'Lançar Notas', screen: 'Notas', icon: 'create', color: '#E67E22' },
          { title: 'Boletim', screen: 'Boletim', icon: 'document-text', color: '#1ABC9C' },
          { title: 'Consultas', screen: 'Consultas', icon: 'search', color: '#34495E' },
          { 
            title: 'Avisos', 
            screen: 'Avisos', 
            icon: 'notifications', 
            color: '#E74C3C',
            badge: avisosNaoLidos 
          },
          { 
            title: 'Novo Aviso', 
            screen: 'CriarAviso', 
            icon: 'add-circle', 
            color: '#F39C12' 
          },
        ];
      case 'aluno':
        return [
          { title: 'Meu Boletim', screen: 'Boletim', icon: 'document-text', color: '#1ABC9C' },
          { title: 'Disciplinas', screen: 'Consultas', icon: 'book', color: '#9B59B6' },
          { 
            title: 'Avisos', 
            screen: 'Avisos', 
            icon: 'notifications', 
            color: '#E74C3C',
            badge: avisosNaoLidos 
          },
        ];
      default:
        return [];
    }
  };

  // Função para obter o texto do perfil
  const getRoleText = () => {
    switch (user?.role) {
      case 'admin':
        return '🔑 Administrador';
      case 'professor':
        return '👨‍🏫 Professor(a)';
      case 'aluno':
        return '🎓 Aluno(a)';
      default:
        return '👤 Usuário';
    }
  };

  // Função para obter a cor do perfil
  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return '#E74C3C';
      case 'professor':
        return '#3498DB';
      case 'aluno':
        return '#27AE60';
      default:
        return '#95A5A6';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Modal de boas-vindas */}
      <WelcomeModal
        visible={showWelcome}
        nome={user?.nome || 'Usuário'}
        role={user?.role || 'aluno'}
        onClose={() => setShowWelcome(false)}
      />

      {/* Cabeçalho com informações do usuário */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: getRoleColor() }]}>
            <Text style={styles.avatarText}>
              {user?.nome?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userText}>
            <Text style={styles.greeting}>Bem‑vindo, {user?.nome ?? 'Usuário'}</Text>
            <Text style={styles.role}>{getRoleText()}</Text>
          </View>
        </View>
        
        {/* Botão de logout */}
        <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      {/* Resumo rápido */}
      {avisosNaoLidos > 0 && (
        <TouchableOpacity 
          style={styles.avisoAlert}
          onPress={() => navigation.navigate('Avisos')}
        >
          <Ionicons name="notifications" size={20} color="#E74C3C" />
          <Text style={styles.avisoAlertText}>
            Você tem {avisosNaoLidos} aviso(s) não lido(s)
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#E74C3C" />
        </TouchableOpacity>
      )}

      {/* Título da seção */}
      <Text style={styles.subtitle}>Acesso rápido</Text>

      {/* Grid de cards */}
      <View style={styles.cardContainer}>
        {getCards().map((card, index) => (
          <TouchableOpacity
            key={`${card.screen}-${index}`}
            style={styles.card}
            onPress={() => navigation.navigate(card.screen)}
            activeOpacity={0.7}
          >
            {/* Badge de notificação */}
            {card.badge !== undefined && card.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {card.badge > 99 ? '99+' : card.badge}
                </Text>
              </View>
            )}

            {/* Ícone */}
            <View style={[styles.iconContainer, { backgroundColor: card.color + '15' }]}>
              <Ionicons name={card.icon as any} size={28} color={card.color} />
            </View>

            {/* Título */}
            <Text style={styles.cardText} numberOfLines={2}>
              {card.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Espaço extra no final */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  
  // Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  role: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  logoutIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FADBD8',
  },

  // Alerta de avisos
  avisoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FADBD8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  avisoAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '500',
  },

  // Seção de cards
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },

  // Badge de notificação
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Ícone do card
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Texto do card
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
});