import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function AlunoScreen() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const limparCampos = () => {
    setNome('');
    setMatricula('');
    setCurso('');
    setEmail('');
    setTelefone('');
    setCep('');
    setEndereco('');
    setCidade('');
    setEstado('');
  };

  const handleSalvar = () => {
    if (!nome.trim() || !matricula.trim() || !curso.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: Nome, Matrícula, Curso e Email.');
      return;
    }
    const aluno = { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado };
    console.log('Aluno cadastrado:', aluno);
    Alert.alert('Sucesso', 'Aluno cadastrado (dados salvos no console).');
    limparCampos();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput label="Nome *" value={nome} onChangeText={setNome} />
      <CustomInput label="Matrícula *" value={matricula} onChangeText={setMatricula} />
      <CustomInput label="Curso *" value={curso} onChangeText={setCurso} />
      <CustomInput label="E‑mail *" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <CustomInput label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <CustomInput label="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
      <CustomInput label="Endereço" value={endereco} onChangeText={setEndereco} />
      <CustomInput label="Cidade" value={cidade} onChangeText={setCidade} />
      <CustomInput label="Estado" value={estado} onChangeText={setEstado} />
      <CustomButton title="Salvar Aluno" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
});