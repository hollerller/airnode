import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./src/screens/login";
import { RegisterScreen } from "./src/screens/register";
import { DashboardScreen } from "./src/screens/dashboard";
import { DevicesScreen } from "./src/screens/devices";
import { SettingsScreen } from "./src/screens/settings";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { authStore } from "./src/stores/authStore";
import { StatusBar } from "react-native";

import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/MaterialIcons";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AuthStackNav = createNativeStackNavigator();

function RootStack() {
  const isLoggedIn = authStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <AuthStack />;
  }

  return <MainTabs />;
}

function AuthStack() {
  return (
    <AuthStackNav.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTitleStyle: { color: "#1F2937" },
        headerTintColor: "#1A9E6E",
      }}
    >
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#1A9E6E",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ssid-chart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="device-thermostat" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="app-settings-alt" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    const loadTokens = async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (accessToken && refreshToken) {
        authStore.getState().login(accessToken, refreshToken);
      }
    };
    loadTokens();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
