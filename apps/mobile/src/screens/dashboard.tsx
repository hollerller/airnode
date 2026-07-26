import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { getReadings } from "../api/readingsService";
import { deviceStore } from "../stores/deviceStore";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";

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

type RangeProps = { name: string; onPress: () => void; isSelected: boolean };

const RangeItem = ({ name, onPress, isSelected }: RangeProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      {
        opacity: pressed ? 0.6 : 1,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
      },
    ]}
  >
    <View style={[styles.item, isSelected && styles.activeItem]}>
      <Text>{name}</Text>
    </View>
  </Pressable>
);

export function DashboardScreen() {
  const [connectedDevice, setConnectedDevice] = useState(
    () => deviceStore.getState().deviceId,
  );
  const [readings, setReadings] = useState<sensorReading[] | null>(null);
  const [range, setRange] = useState<number>(24);

  function rangeInMs(range: number) {
    return range * 60 * 60 * 1000;
  }

  const rangeList = [
    { label: "1h", hours: 1 },
    { label: "24h", hours: 24 },
    { label: "7d", hours: 168 },
    { label: "30d", hours: 720 },
  ];

  console.log(range);

  useEffect(() => {
    return deviceStore.subscribe((state) => {
      setConnectedDevice(state.deviceId);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const to = Date.now();

        const from = Date.now() - rangeInMs(range);

        const readings = await getReadings(
          connectedDevice,
          new Date(from).toISOString(),
          new Date(to).toISOString(),
        );

        setReadings(readings);
      })();
    }, [connectedDevice, range]),
  );

  const chartData = readings?.map((r, index) => ({
    value: r.temperature_c ?? 0,
    label:
      index % 4 == 0 && r.createdAt
        ? new Date(r.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
  }));
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
    >
      <Text style={{ fontSize: 32, marginTop: 100 }}>Dashboard Screen</Text>
      <View style={{ flexDirection: "row" }}>
        {rangeList.map((r) => (
          <RangeItem
            key={r.label}
            name={r.label}
            onPress={() => setRange(r.hours)}
            isSelected={r.hours === range}
          ></RangeItem>
        ))}
      </View>
      <View
        style={{
          marginTop: 100,
          paddingRight: 32,
        }}
      >
        <Text
          style={{
            marginBottom: 10,
          }}
          numberOfLines={1}
        >
          Temp (°C)
        </Text>
        <LineChart
          data={chartData}
          width={300}
          spacing={35}
          initialSpacing={30}
          endSpacing={30}
          yAxisLabelWidth={50}
          yAxisThickness={1}
          yAxisColor="black"
          xAxisColor="black"
          rotateLabel
          xAxisLabelsVerticalShift={8}
          labelsExtraHeight={20}
          xAxisLabelTextStyle={{
            color: "black",
            fontSize: 11,
            textAlign: "center",
            transform: [{ rotate: "300deg" }],
          }}
        />
        <Text style={{ textAlign: "center" }} numberOfLines={1}>
          Hour
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#00ffc8fd",
    padding: 12,
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  activeItem: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
});
