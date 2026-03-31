import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./src/screens/login";
import { RegisterScreen } from "./src/screens/register";
import { DashboardScreen } from "./src/screens/dashboard";
import { DevicesScreen } from "./src/screens/devices";
import { SettingsScren } from "./src/screens/settings";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { authStore } from "./src/stores/authStore";

const Stack = createNativeStackNavigator();

function RootStack() {
  //const isLoggedIn = false;

  const isLoggedIn = authStore((state) => state.isLoggedIn);

  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <Stack.Screen name="Home" component={AuthStack} />
      ) : (
        <Stack.Screen name="Tabs" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="Settings" component={SettingsScren} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
