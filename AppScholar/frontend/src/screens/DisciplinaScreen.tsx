import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

export default function DisciplinaScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [professorResponsavel, setProfessorResponsavel] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const handleSalvar = async () => {
    // Validação
    if (!nomeDisciplina.trim() || !cargaHoraria.trim() || !professorResponsavel.trim() || !curso.trim() || !semestre.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Envia o nome do professor como string
      const response = await api.post('/disciplinas', {
        nome: nomeDisciplina,
        carga_horaria: parseInt(cargaHoraria),
        professor_responsavel: professorResponsavel, // ← campo de texto livre
        curso,
        semestre,
      });

      Alert.alert('Sucesso', response.data.mensagem || 'Disciplina cadastrada com sucesso!');
      
      // Limpar campos
      setNomeDisciplina('');
      setCargaHoraria('');
      setProfessorResponsavel('');
      setCurso('');
      setSemestre('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.erro || 'Falha ao cadastrar disciplina');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput
        label="Nome da disciplina *"
        value={nomeDisciplina}
        onChangeText={setNomeDisciplina}
        placeholder="Ex: Programação Mobile"
      />
      
      <CustomInput
        label="Carga horária (horas) *"
        value={cargaHoraria}
        onChangeText={setCargaHoraria}
        keyboardType="numeric"
        placeholder="Ex: 80"
      />
      
      <CustomInput
        label="Professor responsável *"
        value={professorResponsavel}
        onChangeText={setProfessorResponsavel}
        placeholder="Nome completo do professor"
      />
      
      <CustomInput
        label="Curso *"
        value={curso}
        onChangeText={setCurso}
        placeholder="Ex: Análise e Desenvolvimento de Sistemas"
      />
      
      <CustomInput
        label="Semestre *"
        value={semestre}
        onChangeText={setSemestre}
        placeholder="Ex: 2024.1"
      />

      <CustomButton title="Salvar Disciplina" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
});