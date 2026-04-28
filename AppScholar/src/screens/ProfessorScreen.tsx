import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

export default function ProfessorScreen() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [tempoDocencia, setTempoDocencia] = useState('');
  const [email, setEmail] = useState('');

  const limparCampos = () => {
    setNome('');
    setTitulacao('');
    setAreaAtuacao('');
    setTempoDocencia('');
    setEmail('');
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !titulacao.trim() || !areaAtuacao.trim() || !tempoDocencia.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    try {
      const response = await api.post('/professores', {
        nome,
        titulacao,
        area: areaAtuacao,
        tempo_docencia: parseInt(tempoDocencia),
        email
      });
      Alert.alert('Sucesso', response.data.mensagem);
      limparCampos();
    } catch (err: any) {
      if (err.response?.data?.erro) {
        Alert.alert('Erro', err.response.data.erro);
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar professor');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput label="Nome *" value={nome} onChangeText={setNome} />
      <CustomInput label="Titulação *" value={titulacao} onChangeText={setTitulacao} placeholder="Ex: Mestre, Doutor" />
      <CustomInput label="Área de atuação *" value={areaAtuacao} onChangeText={setAreaAtuacao} />
      <CustomInput label="Tempo de docência (anos) *" value={tempoDocencia} onChangeText={setTempoDocencia} keyboardType="numeric" />
      <CustomInput label="E‑mail *" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <CustomButton title="Salvar Professor" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
});