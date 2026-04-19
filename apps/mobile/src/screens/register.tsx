import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React from "react";
import { register } from "../api/authService";
import { useNavigation } from "@react-navigation/native";

export function RegisterScreen() {
  const [name, onChangeName] = React.useState("");
  const [lastName, onChangeLastName] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const navigation = useNavigation();

  const onClick = async () => {
    const response = await register(name, lastName, email, password);

    if (response) {
      const { name, lastName, email, password } = response;
    } else;
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Register Screen</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Name"
      ></TextInput>

      <TextInput
        style={styles.input}
        onChangeText={onChangeLastName}
        value={lastName}
        placeholder="Last Name"
      ></TextInput>

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

      <Button onPress={onClick} title="Register" color="#841584"></Button>

      <Button
        onPress={() => navigation.navigate("Login")}
        title="Ya tienes cuenta? Haz login!"
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
