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
import { View, StatusBar, Text } from "react-native";

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
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          headerTitle: () => {
            return (
              <View
                style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
              >
                <Text
                  style={{ fontSize: 36, fontWeight: "bold", color: "#171823" }}
                >
                  Devices
                </Text>
                <Ionicons
                  name="bluetooth-connected"
                  size={46}
                  color="#3ED975"
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    const loadTokens = async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (accessToken && refreshToken !== null) {
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
