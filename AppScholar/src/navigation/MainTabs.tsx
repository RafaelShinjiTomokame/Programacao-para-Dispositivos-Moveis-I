import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AlunoScreen from '../screens/AlunoScreen';
import ProfessorScreen from '../screens/ProfessorScreen';
import DisciplinaScreen from '../screens/DisciplinaScreen'; 
import BoletimScreen from '../screens/BoletimScreen';
import { Ionicons } from '@expo/vector-icons'; // exemplo de ícones

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alunos"
        component={AlunoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Professores"
        component={ProfessorScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Disciplinas"
        component={DisciplinaScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Boletim"
        component={BoletimScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}