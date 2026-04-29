import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';
import axios from 'axios';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

export default function AlunoScreen() {
  // Campos do formulário
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  // Estados e cidades do IBGE
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [carregandoEstados, setCarregandoEstados] = useState(true);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  // Carregar lista de estados ao montar o componente
  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const sorted = response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setEstados(sorted.map((e: any) => ({ id: e.id, sigla: e.sigla, nome: e.nome })));
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar estados'))
      .finally(() => setCarregandoEstados(false));
  }, []);

  // Sempre que o estado selecionado mudar, buscar cidades correspondentes
  useEffect(() => {
    if (!estado) {
      setCidades([]);
      return;
    }
    const estadoSelecionado = estados.find(e => e.sigla === estado);
    if (!estadoSelecionado) return;

    setCarregandoCidades(true);
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.id}/municipios`)
      .then(response => {
        setCidades(response.data.map((c: any) => ({ id: c.id, nome: c.nome })));
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar cidades'))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  // Busca automática de endereço pelo CEP (ViaCEP)
  const buscarCEP = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!response.data.erro) {
        setEndereco(response.data.logradouro + (response.data.bairro ? ', ' + response.data.bairro : ''));
        setCidade(response.data.localidade);
        setEstado(response.data.uf);
      } else {
        Alert.alert('CEP não encontrado');
      }
    } catch (error) {
      Alert.alert('Erro ao buscar CEP');
    }
  };

  // Enviar para o backend
  const handleSalvar = async () => {
    if (!nome.trim() || !matricula.trim() || !curso.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Nome, matrícula, curso e email são obrigatórios.');
      return;
    }
    try {
      const response = await api.post('/alunos', {
        nome, matricula, curso, email, telefone, cep, endereco, cidade, estado
      });
      Alert.alert('Sucesso', response.data.mensagem);
      limparCampos();
    } catch (err: any) {
      if (err.response?.data?.erro) {
        Alert.alert('Erro', err.response.data.erro);
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar aluno');
      }
    }
  };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomInput label="Nome *" value={nome} onChangeText={setNome} />
      <CustomInput label="Matrícula *" value={matricula} onChangeText={setMatricula} />
      <CustomInput label="Curso *" value={curso} onChangeText={setCurso} />
      <CustomInput label="E‑mail *" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <CustomInput label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <CustomInput
        label="CEP"
        value={cep}
        onChangeText={(text) => {
          setCep(text);
          buscarCEP(text); // Dispara a busca automaticamente
        }}
        keyboardType="numeric"
      />
      <CustomInput label="Endereço" value={endereco} onChangeText={setEndereco} />

      <Text style={styles.label}>Estado</Text>
      {carregandoEstados ? (
        <ActivityIndicator />
      ) : (
        <Picker
          selectedValue={estado}
          onValueChange={(value) => setEstado(value)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um estado..." value="" />
          {estados.map(e => (
            <Picker.Item key={e.id} label={e.nome} value={e.sigla} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Cidade</Text>
      {carregandoCidades ? (
        <ActivityIndicator />
      ) : (
        <Picker
          selectedValue={cidade}
          onValueChange={(value) => setCidade(value)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione uma cidade..." value="" />
          {cidades.map(c => (
            <Picker.Item key={c.id} label={c.nome} value={c.nome} />
          ))}
        </Picker>
      )}

      <CustomButton title="Salvar Aluno" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F5F7FA' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 4, color: '#2C3E50', marginTop: 8 },
  picker: { backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 12 },
});