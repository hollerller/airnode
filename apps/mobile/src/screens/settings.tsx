import { View, Text, Button } from "react-native";
import { authStore } from "../stores/authStore";

import * as SecureStore from "expo-secure-store";

export function SettingsScreen() {
  const onClick = async () => {
    authStore.getState().logout();
    SecureStore.deleteItemAsync("accessToken");
    SecureStore.deleteItemAsync("refreshToken");
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
      <Button onPress={onClick} title="Logout" color="#841584"></Button>
    </View>
  );
}
