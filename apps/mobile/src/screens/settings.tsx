import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { authStore } from "../stores/authStore";
import { useState } from "react";
import { patchDeviceSettings } from "../api/deviceService";
import { manager } from "../ble/bleManager";
import { deviceStore } from "../stores/deviceStore";
import { Buffer } from "buffer";

import * as SecureStore from "expo-secure-store";

export function SettingsScreen() {
  const onClick = async () => {
    authStore.getState().logout();
    SecureStore.deleteItemAsync("accessToken");
    SecureStore.deleteItemAsync("refreshToken");
  };

  const onUpdateSamplingInterval = async () => {
    const intervalInMin = parseInt(samplingInterval, 10);

    const intervalInSec = intervalInMin * 60;

    const intervalInMs = intervalInSec * 1000;

    const deviceId = deviceStore.getState().deviceId;

    if (
      intervalInMin < 1 ||
      intervalInMin > 30 ||
      Number.isNaN(intervalInMin)
    ) {
      Alert.alert(
        "Out of range",
        "The number must be between 1 and 30 minutes",
      );
      return;
    }

    const buf = Buffer.alloc(4);

    buf.writeUint32LE(intervalInMs, 0);

    const base64Data = buf.toString("base64");

    patchDeviceSettings(deviceId, intervalInSec);

    try {
      const services = await manager.servicesForDevice(deviceId);
      const essService = services.find((s) => s.uuid.includes("181a"));
      if (!essService) return;

      const characteristics = await manager.characteristicsForDevice(
        deviceId,
        essService.uuid,
      );

      manager.writeCharacteristicWithResponseForDevice(
        deviceId,
        essService.uuid,
        characteristics[6].uuid,
        base64Data,
      );
    } catch (error) {
      Alert.alert(
        "Problem saving settings",
        "Retry connecting to your device and try again",
      );
    }
  };

  const [samplingInterval, setSamplingInterval] = useState<string>("");

  const handleChangeText = (inputText: string) => {
    const cleanNumber = inputText.replace(/[^0-9]/g, "");

    setSamplingInterval(cleanNumber);
  };
  console.log(samplingInterval);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Settings Screen</Text>

      <View>
        <Text style={{ fontSize: 20 }}>Set sampling interval</Text>

        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={samplingInterval}
          placeholder="From 1 to 30 min"
          placeholderTextColor="#100202"
          keyboardType="numeric"
        ></TextInput>

        <Button
          onPress={onUpdateSamplingInterval}
          title="Submit"
          color="#841584"
        ></Button>
      </View>

      <Button onPress={onClick} title="Logout" color="#841584"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
