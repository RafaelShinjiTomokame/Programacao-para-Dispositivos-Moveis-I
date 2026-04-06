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
import { Aluno } from '../types';

const AlunoCadastroScreen = () => {
  const [aluno, setAluno] = useState<Partial<Aluno>>({
    nome: '',
    matricula: '',
    curso: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Aluno, value: string) => {
    setAluno({ ...aluno, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!aluno.nome?.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!aluno.matricula?.trim()) newErrors.matricula = 'Matrícula é obrigatória';
    if (!aluno.curso?.trim()) newErrors.curso = 'Curso é obrigatório';
    if (!aluno.email?.trim()) newErrors.email = 'Email é obrigatório';
    if (!aluno.telefone?.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!aluno.cep?.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!aluno.endereco?.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!aluno.cidade?.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!aluno.estado?.trim()) newErrors.estado = 'Estado é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Aluno cadastrado:', aluno);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setAluno({
              nome: '',
              matricula: '',
              curso: '',
              email: '',
              telefone: '',
              cep: '',
              endereco: '',
              cidade: '',
              estado: '',
            });
          },
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastro de Aluno</Text>
        <Text style={styles.subtitle}>Preencha os dados do aluno</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={[styles.input, errors.nome && styles.inputError]}
          placeholder="Nome completo"
          value={aluno.nome}
          onChangeText={(value) => handleChange('nome', value)}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        
        <Text style={styles.label}>Matrícula *</Text>
        <TextInput
          style={[styles.input, errors.matricula && styles.inputError]}
          placeholder="Número de matrícula"
          value={aluno.matricula}
          onChangeText={(value) => handleChange('matricula', value)}
        />
        {errors.matricula && <Text style={styles.errorText}>{errors.matricula}</Text>}
        
        <Text style={styles.label}>Curso *</Text>
        <TextInput
          style={[styles.input, errors.curso && styles.inputError]}
          placeholder="Curso"
          value={aluno.curso}
          onChangeText={(value) => handleChange('curso', value)}
        />
        {errors.curso && <Text style={styles.errorText}>{errors.curso}</Text>}
        
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="email@exemplo.com"
          value={aluno.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        
        <Text style={styles.label}>Telefone *</Text>
        <TextInput
          style={[styles.input, errors.telefone && styles.inputError]}
          placeholder="(00) 00000-0000"
          value={aluno.telefone}
          onChangeText={(value) => handleChange('telefone', value)}
          keyboardType="phone-pad"
        />
        {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}
        
        <Text style={styles.label}>CEP *</Text>
        <TextInput
          style={[styles.input, errors.cep && styles.inputError]}
          placeholder="00000-000"
          value={aluno.cep}
          onChangeText={(value) => handleChange('cep', value)}
          keyboardType="numeric"
        />
        {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
        
        <Text style={styles.label}>Endereço *</Text>
        <TextInput
          style={[styles.input, errors.endereco && styles.inputError]}
          placeholder="Rua, número, complemento"
          value={aluno.endereco}
          onChangeText={(value) => handleChange('endereco', value)}
        />
        {errors.endereco && <Text style={styles.errorText}>{errors.endereco}</Text>}
        
        <Text style={styles.label}>Cidade *</Text>
        <TextInput
          style={[styles.input, errors.cidade && styles.inputError]}
          placeholder="Cidade"
          value={aluno.cidade}
          onChangeText={(value) => handleChange('cidade', value)}
        />
        {errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}
        
        <Text style={styles.label}>Estado *</Text>
        <TextInput
          style={[styles.input, errors.estado && styles.inputError]}
          placeholder="UF"
          value={aluno.estado}
          onChangeText={(value) => handleChange('estado', value)}
          maxLength={2}
        />
        {errors.estado && <Text style={styles.errorText}>{errors.estado}</Text>}
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
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
    backgroundColor: '#2196F3',
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

export default AlunoCadastroScreen;