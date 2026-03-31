import { View, Text } from "react-native";
import { authStore } from "../stores/authStore";
import { useStore } from "zustand";

export function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Login Screen</Text>
    </View>
  );
}
