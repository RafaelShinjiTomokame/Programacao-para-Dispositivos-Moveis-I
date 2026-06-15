import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import AlunoScreen from "../screens/AlunoScreen";
import ProfessorScreen from "../screens/ProfessorScreen";
import DisciplinaScreen from "../screens/DisciplinaScreen";
import NotasScreen from "../screens/NotasScreen";
import BoletimScreen from "../screens/BoletimScreen";
import ConsultasScreen from "../screens/ConsultasScreen";
import { Ionicons } from "@expo/vector-icons";
import AvisosScreen from "../screens/AvisosScreen";
import CriarAvisoScreen from "../screens/CriarAvisoScreen";

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alunos"
        component={AlunoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Professores"
        component={ProfessorScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Disciplinas"
        component={DisciplinaScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notas"
        component={NotasScreen}
        options={{
          tabBarLabel: "Notas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Boletim"
        component={BoletimScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Consultas"
        component={ConsultasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Avisos"
        component={AvisosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarBadge: undefined,
        }}
      />
      <Tab.Screen
        name="CriarAviso"
        component={CriarAvisoScreen}
        options={{
          tabBarLabel: "Novo Aviso",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
