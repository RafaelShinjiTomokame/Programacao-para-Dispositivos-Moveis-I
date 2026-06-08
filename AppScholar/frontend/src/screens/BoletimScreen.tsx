import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

interface DisciplinaNota {
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
}

export default function BoletimScreen() {
  const [matriculaBusca, setMatriculaBusca] = useState('');
  const [boletim, setBoletim] = useState<{ aluno: string; matricula: string; disciplinas: DisciplinaNota[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const buscarBoletim = async () => {
    if (!matriculaBusca.trim()) {
      Alert.alert('Atenção', 'Digite uma matrícula');
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/boletim/${matriculaBusca}`);
      setBoletim(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        Alert.alert('Não encontrado', 'Aluno não encontrado ou sem notas.');
      } else {
        Alert.alert('Erro', 'Falha ao consultar boletim');
      }
      setBoletim(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de Boletim</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Matrícula do aluno"
          value={matriculaBusca}
          onChangeText={setMatriculaBusca}
        />
        <TouchableOpacity style={styles.searchButton} onPress={buscarBoletim}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {boletim && !loading && (
        <View style={styles.resultContainer}>
          <Text style={styles.alunoNome}>Aluno: {boletim.aluno}</Text>
          <Text style={styles.matricula}>Matrícula: {boletim.matricula}</Text>
          <FlatList
            data={boletim.disciplinas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.disciplina}>{item.disciplina}</Text>
                <Text>Nota 1: {item.nota1?.toFixed(1)}  |  Nota 2: {item.nota2?.toFixed(1)}</Text>
                <Text>Média: {item.media?.toFixed(2)}</Text>
                <Text style={{ color: item.situacao === 'Aprovado' ? '#27AE60' : '#E74C3C', fontWeight: 'bold' }}>
                  {item.situacao}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F7FA' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  searchRow: { flexDirection: 'row', marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: { color: '#FFF', fontWeight: '600' },
  resultContainer: { flex: 1 },
  alunoNome: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  matricula: { fontSize: 14, color: '#7F8C8D', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  disciplina: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
});