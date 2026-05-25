import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

interface Aluno { id: number; nome: string; matricula: string; curso: string; email: string; }
interface Professor { id: number; nome: string; titulacao: string; area: string; email: string; }
interface Disciplina { id: number; nome: string; carga_horaria: number; professor: string; curso: string; semestre: string; }

type AbaAtiva = 'alunos' | 'professores' | 'disciplinas';

export default function ConsultasScreen() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('alunos');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      switch (abaAtiva) {
        case 'alunos': setAlunos((await api.get('/alunos')).data); break;
        case 'professores': setProfessores((await api.get('/professores')).data); break;
        case 'disciplinas': setDisciplinas((await api.get('/disciplinas')).data); break;
      }
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.erro || 'Falha ao carregar');
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, [abaAtiva]);

  useFocusEffect(useCallback(() => { carregarDados(); }, [carregarDados]));

  const getData = () => {
    switch (abaAtiva) {
      case 'alunos': return alunos;
      case 'professores': return professores;
      case 'disciplinas': return disciplinas;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (abaAtiva) {
      case 'alunos':
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{(item as Aluno).nome}</Text>
            <Text style={styles.cardDetail}>📋 {(item as Aluno).matricula} | 📚 {(item as Aluno).curso}</Text>
            <Text style={styles.cardDetail}>✉️ {(item as Aluno).email}</Text>
          </View>
        );
      case 'professores':
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{(item as Professor).nome}</Text>
            <Text style={styles.cardDetail}>🎓 {(item as Professor).titulacao} | 🔬 {(item as Professor).area}</Text>
            <Text style={styles.cardDetail}>✉️ {(item as Professor).email}</Text>
          </View>
        );
      case 'disciplinas':
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{(item as Disciplina).nome}</Text>
            <Text style={styles.cardDetail}>⏱️ {(item as Disciplina).carga_horaria}h | 👨‍🏫 {(item as Disciplina).professor}</Text>
            <Text style={styles.cardDetail}>📚 {(item as Disciplina).curso} | 📅 {(item as Disciplina).semestre}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['alunos', 'professores', 'disciplinas'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, abaAtiva === tab && styles.tabAtiva]}
            onPress={() => setAbaAtiva(tab as AbaAtiva)}
          >
            <Text style={[styles.tabText, abaAtiva === tab && styles.tabTextAtiva]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      ) : (
        <FlatList
          data={getData()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum registro encontrado</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => carregarDados(true)} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', padding: 8 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, marginHorizontal: 4 },
  tabAtiva: { backgroundColor: '#3498DB' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#7F8C8D' },
  tabTextAtiva: { color: '#FFF' },
  listContainer: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#7F8C8D', marginTop: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  cardDetail: { fontSize: 14, color: '#34495E', marginBottom: 4 },
});