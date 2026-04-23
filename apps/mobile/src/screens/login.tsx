import { View, Text, TextInput, StyleSheet, Button } from "react-native";
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
    const response = await login(email, password);

    if (response) {
      const { accessToken, refreshToken } = response;

      authStore.getState().login(accessToken, refreshToken);
      save("accessToken", accessToken);
      save("refreshToken", refreshToken);
    } else;
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Login Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
        placeholderTextColor="#100202"
      ></TextInput>

      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor="#100202"
      ></TextInput>

      <Button onPress={onClick} title="Login" color="#841584"></Button>

      <Button
        onPress={() => navigation.navigate("Register")}
        title="No tienes cuenta? registrate!"
        color="#841584"
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
