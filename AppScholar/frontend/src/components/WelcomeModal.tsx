import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeModalProps {
  visible: boolean;
  nome: string;
  role: 'admin' | 'professor' | 'aluno';
  onClose: () => void;
}

const roleIcons: Record<string, any> = {
  admin: 'shield-checkmark',
  professor: 'school',
  aluno: 'happy',
};

const roleColors: Record<string, string> = {
  admin: '#E74C3C',
  professor: '#3498DB',
  aluno: '#27AE60',
};

export default function WelcomeModal({ visible, nome, role, onClose }: WelcomeModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true })
          .start(() => onClose());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { opacity, transform: [{ scale }] }]}>
          <View style={[styles.iconCircle, { backgroundColor: roleColors[role] }]}>
            <Ionicons name={roleIcons[role]} size={50} color="#FFF" />
          </View>
          <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>
          <Text style={styles.nameText}>{nome}</Text>
          <Text style={styles.roleText}>
            {role === 'admin' ? 'Administrador' : role === 'professor' ? 'Professor(a)' : 'Aluno(a)'}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    color: '#7F8C8D',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});