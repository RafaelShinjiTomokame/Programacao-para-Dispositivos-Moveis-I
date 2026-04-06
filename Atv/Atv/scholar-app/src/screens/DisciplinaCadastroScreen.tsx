import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Disciplina } from '../types';

const DisciplinaCadastroScreen = () => {
  const [disciplina, setDisciplina] = useState<Partial<Disciplina>>({
    nome: '',
    cargaHoraria: '',
    professorResponsavel: '',
    curso: '',
    semestre: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Disciplina, value: string) => {
    setDisciplina({ ...disciplina, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!disciplina.nome?.trim()) newErrors.nome = 'Nome da disciplina é obrigatório';
    if (!disciplina.cargaHoraria?.trim()) newErrors.cargaHoraria = 'Carga horária é obrigatória';
    if (!disciplina.professorResponsavel?.trim()) newErrors.professorResponsavel = 'Professor responsável é obrigatório';
    if (!disciplina.curso?.trim()) newErrors.curso = 'Curso é obrigatório';
    if (!disciplina.semestre?.trim()) newErrors.semestre = 'Semestre é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Disciplina cadastrada:', disciplina);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setDisciplina({
              nome: '',
              cargaHoraria: '',
              professorResponsavel: '',
              curso: '',
              semestre: '',
            });
          },
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastro de Disciplina</Text>
        <Text style={styles.subtitle}>Preencha os dados da disciplina</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Disciplina *</Text>
        <TextInput
          style={[styles.input, errors.nome && styles.inputError]}
          placeholder="Ex: Programação para Dispositivos Móveis"
          value={disciplina.nome}
          onChangeText={(value) => handleChange('nome', value)}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        
        <Text style={styles.label}>Carga Horária *</Text>
        <TextInput
          style={[styles.input, errors.cargaHoraria && styles.inputError]}
          placeholder="Ex: 80h, 60h"
          value={disciplina.cargaHoraria}
          onChangeText={(value) => handleChange('cargaHoraria', value)}
        />
        {errors.cargaHoraria && <Text style={styles.errorText}>{errors.cargaHoraria}</Text>}
        
        <Text style={styles.label}>Professor Responsável *</Text>
        <TextInput
          style={[styles.input, errors.professorResponsavel && styles.inputError]}
          placeholder="Nome do professor"
          value={disciplina.professorResponsavel}
          onChangeText={(value) => handleChange('professorResponsavel', value)}
        />
        {errors.professorResponsavel && <Text style={styles.errorText}>{errors.professorResponsavel}</Text>}
        
        <Text style={styles.label}>Curso *</Text>
        <TextInput
          style={[styles.input, errors.curso && styles.inputError]}
          placeholder="Curso"
          value={disciplina.curso}
          onChangeText={(value) => handleChange('curso', value)}
        />
        {errors.curso && <Text style={styles.errorText}>{errors.curso}</Text>}
        
        <Text style={styles.label}>Semestre *</Text>
        <TextInput
          style={[styles.input, errors.semestre && styles.inputError]}
          placeholder="Ex: 1º Semestre, 2º Semestre"
          value={disciplina.semestre}
          onChangeText={(value) => handleChange('semestre', value)}
        />
        {errors.semestre && <Text style={styles.errorText}>{errors.semestre}</Text>}
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar Disciplina</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DisciplinaCadastroScreen;