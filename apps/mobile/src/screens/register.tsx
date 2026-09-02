import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
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
      navigation.navigate("Login");
    } else;
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
        gap: 20,
      }}
    >
      <Text style={styles.title}>Register Screen</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Name"
        placeholderTextColor={NEUTRAL_GRAY}
      ></TextInput>

      <TextInput
        style={styles.input}
        onChangeText={onChangeLastName}
        value={lastName}
        placeholder="Last Name"
        placeholderTextColor={NEUTRAL_GRAY}
      ></TextInput>

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
        placeholderTextColor={NEUTRAL_GRAY}
      ></TextInput>

      <Pressable onPress={onClick} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Register</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Login")}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>
          Ya tienes cuenta? Haz login!
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
