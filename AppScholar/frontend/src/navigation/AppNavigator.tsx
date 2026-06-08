import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import AdminTabs from './AdminTabs';
import ProfessorTabs from './ProfessorTabs';
import AlunoTabs from './AlunoTabs';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isLoggedIn, user, loading } = useAuth();

  // ⚠️ Tela de carregamento com timeout
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' }}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={{ marginTop: 16, color: '#7F8C8D', fontSize: 16 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  const getMainComponent = () => {
    if (!user) return AlunoTabs;
    switch (user.role) {
      case 'admin': return AdminTabs;
      case 'professor': return ProfessorTabs;
      case 'aluno': return AlunoTabs;
      default: return AlunoTabs;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={getMainComponent()} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}