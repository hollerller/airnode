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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootStackNav = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();

function RootStack() {
  const isLoggedIn = authStore((state) => state.isLoggedIn);

  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <AuthStack />;
  }

  return <MainTabs />;
}

function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
