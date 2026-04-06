import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Importar as telas (serão criadas depois)
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AlunoCadastroScreen from '../screens/AlunoCadastroScreen';
import ProfessorCadastroScreen from '../screens/ProfessorCadastroScreen';
import DisciplinaCadastroScreen from '../screens/DisciplinaCadastroScreen';
import BoletimScreen from '../screens/BoletimScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Alunos') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Professores') iconName = focused ? 'school' : 'school-outline';
          else if (route.name === 'Disciplinas') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'Boletim') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Alunos" component={AlunoCadastroScreen} />
      <Tab.Screen name="Professores" component={ProfessorCadastroScreen} />
      <Tab.Screen name="Disciplinas" component={DisciplinaCadastroScreen} />
      <Tab.Screen name="Boletim" component={BoletimScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;