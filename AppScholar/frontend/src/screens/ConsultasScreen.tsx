import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

// Tipos
interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
  email: string;
}

interface Professor {
  id: number;
  nome: string;
  titulacao: string;
  area: string;
  email: string;
}

interface Disciplina {
  id: number;
  nome: string;
  carga_horaria: number;
  professor: string;
  curso: string;
  semestre: string;
}

type AbaAtiva = 'alunos' | 'professores' | 'disciplinas';

export default function ConsultasScreen() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('alunos');

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      switch (abaAtiva) {
        case 'alunos': {
          const response = await api.get('/alunos');
          setAlunos(response.data);
          break;
        }
        case 'professores': {
          const response = await api.get('/professores');
          setProfessores(response.data);
          break;
        }
        case 'disciplinas': {
          const response = await api.get('/disciplinas');
          setDisciplinas(response.data);
          break;
        }
      }
    } catch (err: any) {
      Alert.alert(
        'Erro',
        err.response?.data?.erro || `Falha ao carregar ${abaAtiva}`
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [abaAtiva]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const onRefresh = () => {
    carregarDados(true);
  };

  // Função de renderização unificada
  const renderItem = ({ item }: { item: any }) => {
    switch (abaAtiva) {
      case 'alunos':
        const aluno = item as Aluno;
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{aluno.nome}</Text>
            <Text style={styles.cardDetail}>📋 Matrícula: {aluno.matricula}</Text>
            <Text style={styles.cardDetail}>📚 Curso: {aluno.curso}</Text>
            <Text style={styles.cardDetail}>✉️ Email: {aluno.email}</Text>
          </View>
        );
      case 'professores':
        const professor = item as Professor;
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{professor.nome}</Text>
            <Text style={styles.cardDetail}>🎓 Titulação: {professor.titulacao}</Text>
            <Text style={styles.cardDetail}>🔬 Área: {professor.area}</Text>
            <Text style={styles.cardDetail}>✉️ Email: {professor.email}</Text>
          </View>
        );
      case 'disciplinas':
        const disciplina = item as Disciplina;
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{disciplina.nome}</Text>
            <Text style={styles.cardDetail}>⏱️ Carga horária: {disciplina.carga_horaria}h</Text>
            <Text style={styles.cardDetail}>👨‍🏫 Professor: {disciplina.professor}</Text>
            <Text style={styles.cardDetail}>📚 Curso: {disciplina.curso}</Text>
            <Text style={styles.cardDetail}>📅 Semestre: {disciplina.semestre}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Dados atuais baseado na aba
  const getData = (): any[] => {
    switch (abaAtiva) {
      case 'alunos':
        return alunos;
      case 'professores':
        return professores;
      case 'disciplinas':
        return disciplinas;
      default:
        return [];
    }
  };

  const getEmptyMessage = (): string => {
    switch (abaAtiva) {
      case 'alunos':
        return 'Nenhum aluno cadastrado';
      case 'professores':
        return 'Nenhum professor cadastrado';
      case 'disciplinas':
        return 'Nenhuma disciplina cadastrada';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'alunos' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('alunos')}
        >
          <Text style={[styles.tabText, abaAtiva === 'alunos' && styles.tabTextAtiva]}>
            Alunos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'professores' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('professores')}
        >
          <Text style={[styles.tabText, abaAtiva === 'professores' && styles.tabTextAtiva]}>
            Professores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'disciplinas' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('disciplinas')}
        >
          <Text style={[styles.tabText, abaAtiva === 'disciplinas' && styles.tabTextAtiva]}>
            Disciplinas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={getData()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Rodapé com contador */}
      {!loading && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total: {getData().length} {abaAtiva}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabAtiva: {
    backgroundColor: '#3498DB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  tabTextAtiva: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#7F8C8D',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 4,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#7F8C8D',
  },
});