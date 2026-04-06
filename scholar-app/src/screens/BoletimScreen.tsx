import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BoletimItem } from '../types';

const BoletimScreen = () => {
  const [boletim, setBoletim] = useState<BoletimItem[]>([
    {
      id: '1',
      disciplina: 'Programação para Dispositivos Móveis I',
      nota1: 8.5,
      nota2: 7.5,
      media: 8.0,
      situacao: 'Aprovado',
    },
    {
      id: '2',
      disciplina: 'Banco de Dados',
      nota1: 5.0,
      nota2: 4.5,
      media: 4.75,
      situacao: 'Reprovado',
    },
    {
      id: '3',
      disciplina: 'Engenharia de Software',
      nota1: 6.0,
      nota2: 5.5,
      media: 5.75,
      situacao: 'Em Recuperação',
    },
    {
      id: '4',
      disciplina: 'Redes de Computadores',
      nota1: 7.0,
      nota2: 8.0,
      media: 7.5,
      situacao: 'Aprovado',
    },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BoletimItem | null>(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');

  const calcularMedia = (n1: number, n2: number): number => {
    return (n1 + n2) / 2;
  };

  const calcularSituacao = (media: number): 'Aprovado' | 'Reprovado' | 'Em Recuperação' => {
    if (media >= 7) return 'Aprovado';
    if (media >= 5) return 'Em Recuperação';
    return 'Reprovado';
  };

  const handleEdit = (item: BoletimItem) => {
    setSelectedItem(item);
    setNota1(item.nota1.toString());
    setNota2(item.nota2.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!selectedItem) return;
    
    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);
    
    if (isNaN(n1) || isNaN(n2)) {
      Alert.alert('Erro', 'Por favor, insira notas válidas');
      return;
    }
    
    if (n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      Alert.alert('Erro', 'As notas devem estar entre 0 e 10');
      return;
    }
    
    const media = calcularMedia(n1, n2);
    const situacao = calcularSituacao(media);
    
    setBoletim(boletim.map(item =>
      item.id === selectedItem.id
        ? { ...item, nota1: n1, nota2: n2, media, situacao }
        : item
    ));
    
    setModalVisible(false);
    setSelectedItem(null);
    setNota1('');
    setNota2('');
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Aprovado':
        return styles.aprovado;
      case 'Reprovado':
        return styles.reprovado;
      case 'Em Recuperação':
        return styles.recuperacao;
      default:
        return {};
    }
  };

  const renderItem = ({ item }: { item: BoletimItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.disciplina}>{item.disciplina}</Text>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.notasContainer}>
        <View style={styles.notaBox}>
          <Text style={styles.notaLabel}>Nota 1</Text>
          <Text style={styles.notaValue}>{item.nota1}</Text>
        </View>
        <View style={styles.notaBox}>
          <Text style={styles.notaLabel}>Nota 2</Text>
          <Text style={styles.notaValue}>{item.nota2}</Text>
        </View>
        <View style={styles.notaBox}>
          <Text style={styles.notaLabel}>Média</Text>
          <Text style={[styles.notaValue, styles.media]}>{item.media.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={[styles.situacaoBox, getSituacaoColor(item.situacao)]}>
        <Text style={styles.situacaoText}>{item.situacao}</Text>
      </View>
    </View>
  );

  const calcularMediaGeral = () => {
    if (boletim.length === 0) return 0;
    const soma = boletim.reduce((acc, item) => acc + item.media, 0);
    return (soma / boletim.length).toFixed(1);
  };

  const calcularTotalAprovacoes = () => {
    return boletim.filter(item => item.situacao === 'Aprovado').length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Boletim Acadêmico</Text>
        <Text style={styles.subtitle}>2024.1 - Tecnologia</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{calcularMediaGeral()}</Text>
          <Text style={styles.statLabel}>Média Geral</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{calcularTotalAprovacoes()}/{boletim.length}</Text>
          <Text style={styles.statLabel}>Aprovações</Text>
        </View>
      </View>
      
      <FlatList
        data={boletim}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Notas</Text>
            <Text style={styles.modalDisciplina}>{selectedItem?.disciplina}</Text>
            
            <Text style={styles.modalLabel}>Nota 1</Text>
            <TextInput
              style={styles.modalInput}
              value={nota1}
              onChangeText={setNota1}
              keyboardType="numeric"
              placeholder="0 a 10"
            />
            
            <Text style={styles.modalLabel}>Nota 2</Text>
            <TextInput
              style={styles.modalInput}
              value={nota2}
              onChangeText={setNota2}
              keyboardType="numeric"
              placeholder="0 a 10"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  disciplina: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  notasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  notaBox: {
    alignItems: 'center',
  },
  notaLabel: {
    fontSize: 12,
    color: '#666',
  },
  notaValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  media: {
    color: '#4CAF50',
  },
  situacaoBox: {
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  aprovado: {
    backgroundColor: '#E8F5E9',
  },
  reprovado: {
    backgroundColor: '#FFEBEE',
  },
  recuperacao: {
    backgroundColor: '#FFF3E0',
  },
  situacaoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDisciplina: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BoletimScreen;