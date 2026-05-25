import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

interface Professor {
  id: number;
  nome: string;
}

export default function DisciplinaScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loadingProf, setLoadingProf] = useState(true);

  useEffect(() => {
    api.get('/professores')
      .then(response => setProfessores(response.data))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar professores'))
      .finally(() => setLoadingProf(false));
  }, []);

  const handleSalvar = async () => {
    if (!nomeDisciplina.trim() || !cargaHoraria.trim() || !professorId || !curso.trim() || !semestre.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    try {
      const response = await api.post('/disciplinas', {
        nome: nomeDisciplina,
        carga_horaria: parseInt(cargaHoraria),
        professor_id: parseInt(professorId),
        curso,
        semestre
      });
      Alert.alert('Sucesso', response.data.mensagem);
      setNomeDisciplina(''); setCargaHoraria(''); setProfessorId(''); setCurso(''); setSemestre('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.erro || 'Falha ao cadastrar');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput label="Nome da disciplina *" value={nomeDisciplina} onChangeText={setNomeDisciplina} />
      <CustomInput label="Carga horária (horas) *" value={cargaHoraria} onChangeText={setCargaHoraria} keyboardType="numeric" />
      
      <Text style={styles.label}>Professor responsável *</Text>
      {loadingProf ? <ActivityIndicator /> : (
        <Picker selectedValue={professorId} onValueChange={(value) => setProfessorId(value)} style={styles.picker}>
          <Picker.Item label="Selecione um professor..." value="" />
          {professores.map(prof => (
            <Picker.Item key={prof.id} label={prof.nome} value={prof.id.toString()} />
          ))}
        </Picker>
      )}

      <CustomInput label="Curso *" value={curso} onChangeText={setCurso} />
      <CustomInput label="Semestre *" value={semestre} onChangeText={setSemestre} placeholder="Ex: 2024.1" />
      <CustomButton title="Salvar Disciplina" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 4, color: '#2C3E50', marginTop: 8 },
  picker: { backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 12 },
});