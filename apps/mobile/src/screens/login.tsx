import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { login } from "../api/authService";
import { authStore } from "../stores/authStore";
import { useNavigation } from "@react-navigation/native";

import * as SecureStore from "expo-secure-store";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export function LoginScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const navigation = useNavigation();

  const onClick = async () => {
    try {
      const response = await login(email, password);

      if (response) {
        const { accessToken, refreshToken } = response;

        authStore.getState().login(accessToken, refreshToken);
        save("accessToken", accessToken);
        save("refreshToken", refreshToken);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == 401) {
          Alert.alert("Error", "Authentication error");
        } else {
          Alert.alert("Error", "Something went wrong");
        }
      } else {
        Alert.alert("Error", "Network error");
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 80,
        gap: 20,
      }}
    >
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
        placeholderTextColor={NEUTRAL_GRAY}
      ></TextInput>

      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor={NEUTRAL_GRAY}
      ></TextInput>

      <Pressable onPress={onClick} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Login</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Register")}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>
          Don't have an account? Register!
        </Text>
      </Pressable>
    </View>
  );
}

const ACCENT_COLOR = "#1A9E6E";
const PRIMARY_TEXT = "#1F2937";
const NEUTRAL_GRAY = "#6B7280";

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: PRIMARY_TEXT,
  },
  input: {
    height: 44,
    width: 250,
    margin: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: PRIMARY_TEXT,
  },
  primaryButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: NEUTRAL_GRAY,
    fontWeight: "600",
    fontSize: 14,
  },
});
