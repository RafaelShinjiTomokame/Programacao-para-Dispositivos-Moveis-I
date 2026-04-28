import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  // useEffect para simular carregamento inicial (hook obrigatório)
  useEffect(() => {
    console.log('Dashboard carregado - usuário:', user?.nome);
  }, []);

  const cards = [
    { title: 'Alunos', screen: 'Alunos' },
    { title: 'Professores', screen: 'Professores' },
    { title: 'Disciplinas', screen: 'Disciplinas' },
    { title: 'Boletim', screen: 'Boletim' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Correção principal: usar user.nome (ou fallback 'Usuário') */}
      <Text style={styles.greeting}>
        Bem‑vindo, {user?.nome ?? 'Usuário'}
      </Text>
      <Text style={styles.subtitle}>Selecione uma opção:</Text>

      <View style={styles.cardContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.screen}
            style={styles.card}
            onPress={() => navigation.navigate(card.screen)}
          >
            <Text style={styles.cardText}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
});