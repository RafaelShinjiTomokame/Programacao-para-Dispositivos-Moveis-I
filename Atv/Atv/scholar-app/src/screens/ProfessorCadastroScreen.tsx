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
import { Professor } from '../types';

const ProfessorCadastroScreen = () => {
  const [professor, setProfessor] = useState<Partial<Professor>>({
    nome: '',
    titulacao: '',
    areaAtuacao: '',
    tempoDocencia: '',
    email: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Professor, value: string) => {
    setProfessor({ ...professor, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!professor.nome?.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!professor.titulacao?.trim()) newErrors.titulacao = 'Titulação é obrigatória';
    if (!professor.areaAtuacao?.trim()) newErrors.areaAtuacao = 'Área de atuação é obrigatória';
    if (!professor.tempoDocencia?.trim()) newErrors.tempoDocencia = 'Tempo de docência é obrigatório';
    if (!professor.email?.trim()) newErrors.email = 'Email é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Professor cadastrado:', professor);
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setProfessor({
              nome: '',
              titulacao: '',
              areaAtuacao: '',
              tempoDocencia: '',
              email: '',
            });
          },
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastro de Professor</Text>
        <Text style={styles.subtitle}>Preencha os dados do professor</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={[styles.input, errors.nome && styles.inputError]}
          placeholder="Nome completo"
          value={professor.nome}
          onChangeText={(value) => handleChange('nome', value)}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        
        <Text style={styles.label}>Titulação *</Text>
        <TextInput
          style={[styles.input, errors.titulacao && styles.inputError]}
          placeholder="Ex: Doutor, Mestre, Especialista"
          value={professor.titulacao}
          onChangeText={(value) => handleChange('titulacao', value)}
        />
        {errors.titulacao && <Text style={styles.errorText}>{errors.titulacao}</Text>}
        
        <Text style={styles.label}>Área de Atuação *</Text>
        <TextInput
          style={[styles.input, errors.areaAtuacao && styles.inputError]}
          placeholder="Ex: Desenvolvimento Mobile, Banco de Dados"
          value={professor.areaAtuacao}
          onChangeText={(value) => handleChange('areaAtuacao', value)}
        />
        {errors.areaAtuacao && <Text style={styles.errorText}>{errors.areaAtuacao}</Text>}
        
        <Text style={styles.label}>Tempo de Docência *</Text>
        <TextInput
          style={[styles.input, errors.tempoDocencia && styles.inputError]}
          placeholder="Ex: 5 anos, 10 anos"
          value={professor.tempoDocencia}
          onChangeText={(value) => handleChange('tempoDocencia', value)}
        />
        {errors.tempoDocencia && <Text style={styles.errorText}>{errors.tempoDocencia}</Text>}
        
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="email@exemplo.com"
          value={professor.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar Professor</Text>
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
    backgroundColor: '#9C27B0',
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

export default ProfessorCadastroScreen;