import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface DisciplinaNota {
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: 'Aprovado' | 'Reprovado';
}

const dadosMockados: DisciplinaNota[] = [
  { disciplina: 'Programação Mobile', nota1: 8.5, nota2: 7.0, media: 7.75, situacao: 'Aprovado' },
  { disciplina: 'Banco de Dados', nota1: 5.0, nota2: 6.0, media: 5.5, situacao: 'Reprovado' },
  { disciplina: 'Engenharia de Software', nota1: 9.0, nota2: 8.5, media: 8.75, situacao: 'Aprovado' },
];

export default function BoletimScreen() {
  const [boletim, setBoletim] = useState<DisciplinaNota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula um carregamento assíncrono
    setTimeout(() => {
      setBoletim(dadosMockados);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Carregando boletim...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletim Acadêmico</Text>
      <FlatList
        data={boletim}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.disciplina}>{item.disciplina}</Text>
            <View style={styles.row}>
              <Text>Nota 1: {item.nota1.toFixed(1)}</Text>
              <Text>Nota 2: {item.nota2.toFixed(1)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Média: {item.media.toFixed(2)}</Text>
              <Text style={{ color: item.situacao === 'Aprovado' ? '#27AE60' : '#E74C3C', fontWeight: 'bold' }}>
                {item.situacao}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F7FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  disciplina: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
});