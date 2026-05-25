import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import WelcomeModal from '../components/WelcomeModal';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user) setShowWelcome(true);
  }, []);

  const getCards = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Alunos', screen: 'Alunos' },
          { title: 'Professores', screen: 'Professores' },
          { title: 'Disciplinas', screen: 'Disciplinas' },
          { title: 'Notas', screen: 'Notas' },
          { title: 'Boletim', screen: 'Boletim' },
          { title: 'Consultas', screen: 'Consultas' },
        ];
      case 'professor':
        return [
          { title: 'Lançar Notas', screen: 'Notas' },
          { title: 'Boletim', screen: 'Boletim' },
          { title: 'Consultas', screen: 'Consultas' },
        ];
      case 'aluno':
        return [
          { title: 'Meu Boletim', screen: 'Boletim' },
          { title: 'Disciplinas', screen: 'Consultas' },
        ];
      default:
        return [];
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WelcomeModal
        visible={showWelcome}
        nome={user?.nome || 'Usuário'}
        role={user?.role || 'aluno'}
        onClose={() => setShowWelcome(false)}
      />

      <Text style={styles.greeting}>Bem‑vindo, {user?.nome ?? 'Usuário'}</Text>
      <Text style={styles.role}>
        {user?.role === 'admin' ? '🔑 Administrador' : 
         user?.role === 'professor' ? '👨‍🏫 Professor(a)' : '🎓 Aluno(a)'}
      </Text>
      <Text style={styles.subtitle}>Selecione uma opção:</Text>

      <View style={styles.cardContainer}>
        {getCards().map((card) => (
          <TouchableOpacity
            key={card.screen}
            style={styles.card}
            onPress={() => navigation.navigate(card.screen)}
          >
            <Text style={styles.cardText}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2C3E50',
  },
  role: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 16,
    fontWeight: '500',
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
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});