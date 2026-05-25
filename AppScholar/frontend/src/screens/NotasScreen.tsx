import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

export default function NotasScreen() {
  const [alunoId, setAlunoId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');

  const [alunos, setAlunos] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [alunosRes, disciplinasRes] = await Promise.all([
          api.get('/alunos'),
          api.get('/disciplinas'),
        ]);
        setAlunos(alunosRes.data);
        setDisciplinas(disciplinasRes.data);
      } catch (err) {
        Alert.alert('Erro', 'Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleLancarNota = async () => {
    if (!alunoId || !disciplinaId || !nota1.trim() || !nota2.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    try {
      const response = await api.post('/notas', {
        aluno_id: parseInt(alunoId),
        disciplina_id: parseInt(disciplinaId),
        nota1: parseFloat(nota1),
        nota2: parseFloat(nota2),
      });
      Alert.alert('Sucesso', 'Nota lançada com sucesso!');
      setNota1(''); setNota2('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.erro || 'Falha ao lançar nota');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lançamento de Notas</Text>

      <Text style={styles.label}>Aluno *</Text>
      <Picker selectedValue={alunoId} onValueChange={(value) => setAlunoId(value)} style={styles.picker}>
        <Picker.Item label="Selecione um aluno..." value="" />
        {alunos.map((aluno) => (
          <Picker.Item key={aluno.id} label={`${aluno.nome} (${aluno.matricula})`} value={aluno.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Disciplina *</Text>
      <Picker selectedValue={disciplinaId} onValueChange={(value) => setDisciplinaId(value)} style={styles.picker}>
        <Picker.Item label="Selecione uma disciplina..." value="" />
        {disciplinas.map((disciplina) => (
          <Picker.Item key={disciplina.id} label={`${disciplina.nome} - ${disciplina.curso}`} value={disciplina.id.toString()} />
        ))}
      </Picker>

      <CustomInput label="Nota 1 *" value={nota1} onChangeText={setNota1} keyboardType="numeric" placeholder="0.0" />
      <CustomInput label="Nota 2 *" value={nota2} onChangeText={setNota2} keyboardType="numeric" placeholder="0.0" />

      <CustomButton title="Lançar Nota" onPress={handleLancarNota} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2C3E50' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 4, color: '#2C3E50', marginTop: 8 },
  picker: { backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 12 },
});