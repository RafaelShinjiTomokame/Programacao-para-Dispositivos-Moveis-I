import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  autor_nome: string;
  data_publicacao: string;
  data_expiracao: string | null;
  prioridade: 'alta' | 'normal' | 'baixa';
  lido: boolean;
}

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [avisoExpandido, setAvisoExpandido] = useState<number | null>(null);
  const { user } = useAuth();

  const carregarAvisos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await api.get('/avisos');
      setAvisos(response.data);
    } catch (err) {
      console.error('Erro ao carregar avisos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAvisos();
    }, [carregarAvisos])
  );

  const marcarComoLido = async (avisoId: number) => {
    try {
      await api.post(`/avisos/${avisoId}/ler`);
      setAvisos(prev =>
        prev.map(a => (a.id === avisoId ? { ...a, lido: true } : a))
      );
    } catch (err) {
      console.error('Erro ao marcar como lido:', err);
    }
  };

  const toggleExpandir = (avisoId: number) => {
    setAvisoExpandido(avisoExpandido === avisoId ? null : avisoId);
    
    // Marcar como lido ao expandir
    const aviso = avisos.find(a => a.id === avisoId);
    if (aviso && !aviso.lido) {
      marcarComoLido(avisoId);
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return '#E74C3C';
      case 'normal': return '#3498DB';
      case 'baixa': return '#27AE60';
      default: return '#95A5A6';
    }
  };

  const formatarData = (data: string) => {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderAviso = ({ item }: { item: Aviso }) => {
    const expandido = avisoExpandido === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, !item.lido && styles.cardNaoLido]}
        onPress={() => toggleExpandir(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.tituloContainer}>
            <View style={styles.prioridadeContainer}>
              <View style={[styles.prioridadeDot, { backgroundColor: getPrioridadeColor(item.prioridade) }]} />
              {!item.lido && <View style={styles.naoLidoDot} />}
            </View>
            <Text style={styles.cardTitle} numberOfLines={expandido ? undefined : 2}>
              {item.titulo}
            </Text>
          </View>
          <Ionicons
            name={expandido ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#7F8C8D"
          />
        </View>

        <Text style={styles.cardMeta}>
          {item.autor_nome} • {formatarData(item.data_publicacao)}
        </Text>

        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: getPrioridadeColor(item.prioridade) + '20' }]}>
            <Text style={[styles.tagText, { color: getPrioridadeColor(item.prioridade) }]}>
              {item.prioridade.toUpperCase()}
            </Text>
          </View>
          {item.data_expiracao && (
            <View style={styles.tag}>
              <Ionicons name="time-outline" size={12} color="#7F8C8D" />
              <Text style={styles.tagTextSecondary}>
                Expira: {formatarData(item.data_expiracao)}
              </Text>
            </View>
          )}
        </View>

        {expandido && (
          <View style={styles.mensagemContainer}>
            <Text style={styles.mensagem}>{item.mensagem}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498DB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAviso}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="notifications-off" size={48} color="#BDC3C7" />
            <Text style={styles.emptyText}>Nenhum aviso publicado</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => carregarAvisos(true)} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardNaoLido: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
    backgroundColor: '#F0F8FF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tituloContainer: {
    flex: 1,
    marginRight: 12,
  },
  prioridadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  prioridadeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  naoLidoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498DB',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  cardMeta: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagTextSecondary: {
    fontSize: 11,
    color: '#7F8C8D',
  },
  mensagemContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  mensagem: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
  },
});