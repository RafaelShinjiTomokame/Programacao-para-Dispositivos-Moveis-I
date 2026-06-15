import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import api from '../services/api';

export default function CriarAvisoScreen() {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [dataExpiracao, setDataExpiracao] = useState('');
  const [prioridade, setPrioridade] = useState<'alta' | 'normal' | 'baixa'>('normal');

  const handlePublicar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'O título é obrigatório');
      return;
    }
    if (!mensagem.trim()) {
      Alert.alert('Atenção', 'A mensagem é obrigatória');
      return;
    }

    // Validar data se fornecida (formato YYYY-MM-DD)
    if (dataExpiracao.trim()) {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(dataExpiracao)) {
        Alert.alert('Atenção', 'Data de expiração deve estar no formato YYYY-MM-DD');
        return;
      }
    }

    try {
      const response = await api.post('/avisos', {
        titulo,
        mensagem,
        data_expiracao: dataExpiracao.trim() || null,
        prioridade,
      });

      Alert.alert('Sucesso', response.data.mensagem, [
        {
          text: 'OK',
          onPress: () => {
            setTitulo('');
            setMensagem('');
            setDataExpiracao('');
            setPrioridade('normal');
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.erro || 'Falha ao publicar aviso');
    }
  };

  const prioridades = [
    { label: '🔴 Alta', value: 'alta' as const, color: '#E74C3C' },
    { label: '🔵 Normal', value: 'normal' as const, color: '#3498DB' },
    { label: '🟢 Baixa', value: 'baixa' as const, color: '#27AE60' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Aviso Acadêmico</Text>

      <CustomInput
        label="Título *"
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex: Prova substitutiva - Matemática"
      />

      <Text style={styles.label}>Mensagem *</Text>
      <CustomInput
        label=""
        value={mensagem}
        onChangeText={setMensagem}
        placeholder="Digite a mensagem completa do aviso..."
        multiline
        numberOfLines={6}
        style={styles.textArea}
      />

      <Text style={styles.label}>Prioridade</Text>
      <View style={styles.prioridadeContainer}>
        {prioridades.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[
              styles.prioridadeButton,
              prioridade === p.value && { borderColor: p.color, backgroundColor: p.color + '15' },
            ]}
            onPress={() => setPrioridade(p.value)}
          >
            <Text style={[styles.prioridadeText, prioridade === p.value && { color: p.color }]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomInput
        label="Data de expiração (opcional)"
        value={dataExpiracao}
        onChangeText={setDataExpiracao}
        placeholder="YYYY-MM-DD"
        keyboardType="default"
      />

      <CustomButton title="📢 Publicar Aviso" onPress={handlePublicar} color="#E67E22" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
    marginTop: 8,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  prioridadeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  prioridadeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#BDC3C7',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  prioridadeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7F8C8D',
  },
});