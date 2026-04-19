import { View, Text, Button } from "react-native";
import { authStore } from "../stores/authStore";

export function SettingsScreen() {
  const onClick = async () => {
    authStore.getState().logout();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
      <Button onPress={onClick} title="Logout" color="#841584"></Button>
    </View>
  );
}
