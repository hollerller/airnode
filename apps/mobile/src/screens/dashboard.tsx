import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { getReadings } from "../api/readingsService";
import { deviceStore } from "../stores/deviceStore";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { sensorReading } from "../utils/sensorReading";
import { readingsToCSV } from "../utils/csvExport";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

type RangeProps = { name: string; onPress: () => void; isSelected: boolean };

type SensorChartProps = {
  readings: sensorReading[] | null;
  range: number;
  getValue: (r: sensorReading) => number;
  title: string;
};

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

const SensorChart = ({
  readings,
  range,
  getValue,
  title,
}: SensorChartProps) => {
  function formatLabel(createdAt: Date, range: number): string {
    let formattedLabel = "";

    if (range > 24) {
      formattedLabel = createdAt.toLocaleString([], {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      formattedLabel = createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return formattedLabel;
  }

  const chartData = readings?.map((r, index) => ({
    value: getValue(r),
    label:
      index % 4 == 0 && r.createdAt
        ? formatLabel(new Date(r.createdAt), range)
        : "",
  }));

  const label = range > 24 ? "Date" : "Hour";

  return (
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
        {title}
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
        xAxisLabelsVerticalShift={10}
        labelsExtraHeight={60}
        xAxisLabelTextStyle={{
          color: "black",
          fontSize: 11,
          textAlign: "center",
          transform: [{ rotate: "300deg" }],
        }}
      />
      <Text style={{ textAlign: "center" }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

export function DashboardScreen() {
  const [connectedDevice, setConnectedDevice] = useState(
    () => deviceStore.getState().deviceId,
  );
  const [readings, setReadings] = useState<sensorReading[] | null>(null);
  const [range, setRange] = useState<number>(24);

  function rangeInMs(range: number) {
    return range * 60 * 60 * 1000;
  }

  const handleCSVExport = async () => {
    if (!readings) return;

    const csv = readingsToCSV(readings);

    try {
      const file = new File(Paths.cache, `airnode_${Date.now()}.csv`);
      file.create();
      file.write(csv, { encoding: "utf8" });

      await Sharing.shareAsync(file.uri);
    } catch (error) {
      console.log(error);
    }
  };

  const rangeList = [
    { label: "1h", hours: 1 },
    { label: "24h", hours: 24 },
    { label: "7d", hours: 168 },
    { label: "30d", hours: 720 },
  ];

  type SensorListProps = {
    title: string;
    getValue: (r: sensorReading) => number;
  };

  const sensorList: SensorListProps[] = [
    {
      title: "Temperature (°C)",
      getValue: (r) => r.temperature_c ?? 0,
    },
    {
      title: "Humidity (%)",
      getValue: (r) => r.humidity_pct ?? 0,
    },
    {
      title: "Pressure (hPa)",
      getValue: (r) => r.pressure_hpa ?? 0,
    },
    {
      title: "PM1.0 (µg/m³)",
      getValue: (r) => r.pm1_0_ugm3 ?? 0,
    },
    {
      title: "PM2.5 (µg/m³)",
      getValue: (r) => r.pm2_5_ugm3 ?? 0,
    },
    {
      title: "PM10 (µg/m³)",
      getValue: (r) => r.pm10_ugm3 ?? 0,
    },
  ];

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
      <Pressable
        onPress={handleCSVExport}
        style={{ backgroundColor: "#80aee1", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Download CSV</Text>
      </Pressable>
      <ScrollView>
        {sensorList.map((s) => (
          <SensorChart
            key={s.title}
            readings={readings}
            range={range}
            getValue={s.getValue}
            title={s.title}
          />
        ))}
      </ScrollView>
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
