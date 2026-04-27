import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function DisciplinaScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [profResponsavel, setProfResponsavel] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const limparCampos = () => {
    setNomeDisciplina('');
    setCargaHoraria('');
    setProfResponsavel('');
    setCurso('');
    setSemestre('');
  };

  const handleSalvar = () => {
    if (!nomeDisciplina.trim() || !cargaHoraria.trim() || !profResponsavel.trim() || !curso.trim() || !semestre.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    const disciplina = { nomeDisciplina, cargaHoraria, profResponsavel, curso, semestre };
    console.log('Disciplina cadastrada:', disciplina);
    Alert.alert('Sucesso', 'Disciplina cadastrada (dados salvos no console).');
    limparCampos();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput label="Nome da disciplina *" value={nomeDisciplina} onChangeText={setNomeDisciplina} />
      <CustomInput label="Carga horária (horas) *" value={cargaHoraria} onChangeText={setCargaHoraria} keyboardType="numeric" />
      <CustomInput label="Professor responsável *" value={profResponsavel} onChangeText={setProfResponsavel} />
      <CustomInput label="Curso *" value={curso} onChangeText={setCurso} />
      <CustomInput label="Semestre *" value={semestre} onChangeText={setSemestre} placeholder="Ex: 2024.1" />
      <CustomButton title="Salvar Disciplina" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
});