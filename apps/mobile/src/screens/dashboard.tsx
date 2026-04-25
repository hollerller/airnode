import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/MaterialIcons";

export function DashboardScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 32 }}>Dashboard Screen</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Text style={{ fontSize: 32 }}>Under construction</Text>
        <Ionicons name="construction" size={46} color="#3ED975" />
      </View>
    </View>
  );
}
