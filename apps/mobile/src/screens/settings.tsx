import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
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
        justifyContent: "flex-start",
        paddingTop: 72,
        gap: 40,
      }}
    >
      <View>
        <Text style={styles.label}>Set sampling interval</Text>

        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={samplingInterval}
          placeholder="From 1 to 30 min"
          placeholderTextColor={NEUTRAL_GRAY}
          keyboardType="numeric"
        ></TextInput>

        <Pressable
          onPress={onUpdateSamplingInterval}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>

      <Pressable onPress={onClick} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
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
  label: {
    fontSize: 20,
    color: PRIMARY_TEXT,
  },
  input: {
    height: 44,
    margin: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: PRIMARY_TEXT,
  },
  button: {
    alignSelf: "center",
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
