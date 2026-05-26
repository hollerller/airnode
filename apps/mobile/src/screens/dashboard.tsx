import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { getReadings } from "../api/readingsService";
import { deviceStore } from "../stores/deviceStore";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";

type sensorReading = {
  id: number | null;
  deviceId: string | null;
  createdAt: Date | null;
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  pm1_0_ugm3: number | null;
  pm2_5_ugm3: number | null;
  pm10_ugm3: number | null;
};

export function DashboardScreen() {
  const [connectedDevice, setConnectedDevice] = useState(
    () => deviceStore.getState().deviceId,
  );
  const [readings, setReadings] = useState<sensorReading[] | null>(null);

  useEffect(() => {
    return deviceStore.subscribe((state) => {
      setConnectedDevice(state.deviceId);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const to = Date.now();

      const from = Date.now() - 24 * 60 * 60 * 1000;

      const readings = await getReadings(
        connectedDevice,
        new Date(from).toISOString(),
        new Date(to).toISOString(),
      );

      setReadings(readings);
    })();
  }, [connectedDevice]);

  const chartData = readings?.map((r) => ({
    value: r.temperature_c ?? 0,
    label: r.createdAt
      ? new Date(r.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  }));
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

        <LineChart data={chartData} />

        <Ionicons name="construction" size={46} color="#3ED975" />
      </View>
    </View>
  );
}
