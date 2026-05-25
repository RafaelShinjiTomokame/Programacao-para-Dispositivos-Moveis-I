import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import BoletimScreen from '../screens/BoletimScreen';
import ConsultasScreen from '../screens/ConsultasScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AlunoTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tab.Screen name="Boletim" component={BoletimScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} /> }} />
      <Tab.Screen name="Consultas" component={ConsultasScreen} options={{ tabBarLabel: 'Disciplinas', tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}