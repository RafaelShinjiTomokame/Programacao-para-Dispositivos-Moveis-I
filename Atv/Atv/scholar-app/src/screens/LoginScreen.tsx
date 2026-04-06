import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!senha.trim()) {
      setSenhaError('Senha é obrigatória');
      isValid = false;
    } else {
      setSenhaError('');
    }
    
    if (isValid) {
      setLoading(true);
      setTimeout(() => {
        const success = login(email, senha);
        if (!success) {
          Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
        }
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Scholar App</Text>
          <Text style={styles.subtitle}>Boletim Acadêmico</Text>
        </View>
        
        <View style={styles.form}>
          <Text style={styles.label}>Email ou Login</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[styles.input, senhaError ? styles.inputError : null]}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          {senhaError ? <Text style={styles.errorText}>{senhaError}</Text> : null}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#fafafa',
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
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;