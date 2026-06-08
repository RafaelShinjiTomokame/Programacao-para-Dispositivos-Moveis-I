import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

export default function NotasScreen() {
  const [matriculaAluno, setMatriculaAluno] = useState('');
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');

  const handleLancarNota = async () => {
    // Validação
    if (!matriculaAluno.trim() || !nomeDisciplina.trim() || !nota1.trim() || !nota2.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Validar notas (0 a 10)
    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);
    
    if (isNaN(n1) || isNaN(n2) || n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      Alert.alert('Atenção', 'As notas devem ser valores entre 0 e 10.');
      return;
    }

    try {
      // Envia matrícula do aluno e nome da disciplina como string
      const response = await api.post('/notas', {
        matricula_aluno: matriculaAluno,
        nome_disciplina: nomeDisciplina,
        nota1: n1,
        nota2: n2,
      });

      Alert.alert('Sucesso', response.data.mensagem || 'Nota lançada com sucesso!');
      
      // Limpar campos
      setMatriculaAluno('');
      setNomeDisciplina('');
      setNota1('');
      setNota2('');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.erro || 'Falha ao lançar nota');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput
        label="Matrícula do aluno *"
        value={matriculaAluno}
        onChangeText={setMatriculaAluno}
        placeholder="Ex: 2024001"
      />
      
      <CustomInput
        label="Nome da disciplina *"
        value={nomeDisciplina}
        onChangeText={setNomeDisciplina}
        placeholder="Ex: Programação Mobile"
      />
      
      <CustomInput
        label="Nota 1 *"
        value={nota1}
        onChangeText={setNota1}
        keyboardType="numeric"
        placeholder="0.0 a 10.0"
      />
      
      <CustomInput
        label="Nota 2 *"
        value={nota2}
        onChangeText={setNota2}
        keyboardType="numeric"
        placeholder="0.0 a 10.0"
      />

      <CustomButton title="Lançar Nota" onPress={handleLancarNota} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
});