import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React from "react";
import { login } from "../api/authService";
import { authStore } from "../stores/authStore";
import { useNavigation } from "@react-navigation/native";

export function LoginScreen() {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const navigation = useNavigation();

  const onClick = async () => {
    const response = await login(email, password);

    if (response) {
      const { accessToken, refreshToken } = response;

      authStore.getState().login(accessToken, refreshToken);
    } else;
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Login Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Email"
      ></TextInput>

      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        value={password}
        placeholder="Password"
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
