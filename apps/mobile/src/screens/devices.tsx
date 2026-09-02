import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
} from "react-native";
import { requestBluetoothPermission } from "../ble/bleManager";
import { manager } from "../ble/bleManager";
import { useState, useRef, useEffect } from "react";
import { Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { postReading } from "../api/readingsService";
import { deviceStore } from "../stores/deviceStore";

type senseorReading = {
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  pm1_0_ugm3: number | null;
  pm2_5_ugm3: number | null;
  pm10_ugm3: number | null;
};

type DeviceProps = { name: string; onPress: () => void };

const DeviceItem = ({ name, onPress }: DeviceProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      {
        opacity: pressed ? 0.6 : 1,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 8,
      },
    ]}
  >
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
    </View>
  </Pressable>
);

export function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensorData, setSensorData] = useState<senseorReading>({
    temperature_c: null,
    humidity_pct: null,
    pressure_hpa: null,
    pm1_0_ugm3: null,
    pm2_5_ugm3: null,
    pm10_ugm3: null,
  });

  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(
    null,
  );
  const hasSentReading = useRef<boolean>(false);

  useEffect(() => {
    if (!sensorData) return;

    const dataReady = Object.values(sensorData).every((v) => v !== null);

    if (dataReady && !hasSentReading.current) {
      hasSentReading.current = true;

      postReading(
        connectedDeviceId!,
        sensorData.temperature_c!,
        sensorData.humidity_pct!,
        sensorData.pressure_hpa!,
        sensorData.pm1_0_ugm3!,
        sensorData.pm2_5_ugm3!,
        sensorData.pm10_ugm3!,
      );
      setTimeout(() => {
        hasSentReading.current = false;
      }, 9000);
    }
  }, [sensorData]);

  const onClick = async () => {
    const bluetoothPermission = await requestBluetoothPermission();

    if (!bluetoothPermission) return;

    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        manager.stopDeviceScan();
        return;
      }

      if (device?.name) {
        setDevices((prev) => {
          const exists = prev.some((d) => d.id === device.id);
          return exists ? prev : [...prev, device];
        });
      }
    });

    setTimeout(() => manager.stopDeviceScan(), 10000);
  };

  const onClickDisconnectBle = async (deviceId: string) => {
    await manager.cancelDeviceConnection(deviceId);

    setConnectedDeviceId(null);

    setSensorData({
      temperature_c: null,
      humidity_pct: null,
      pressure_hpa: null,
      pm1_0_ugm3: null,
      pm2_5_ugm3: null,
      pm10_ugm3: null,
    });

    console.log("Device disconnected");
  };

  const onPress = async (itemId: string) => {
    await manager.connectToDevice(itemId);

    const deviceData =
      await manager.discoverAllServicesAndCharacteristicsForDevice(
        itemId,
        "connect",
      );
    const services = await manager.servicesForDevice(itemId);

    const essService = services.find((s) => s.uuid.includes("181a"));
    if (!essService) return;

    deviceStore.getState().setConnectedDevice(itemId);

    const characteristics = await manager.characteristicsForDevice(
      itemId,
      essService.uuid,
    );

    manager.monitorCharacteristicForDevice(
      itemId,
      essService.uuid,
      characteristics[0].uuid,
      (error, characteristic) => {
        const temp = characteristic?.value;
        const raw = Buffer.from(temp, "base64");
        const tempValue = raw.readInt32LE(0);

        setSensorData((prev) => ({
          ...prev,
          temperature_c: tempValue / 100,
        }));
      },
    );

    manager.monitorCharacteristicForDevice(
      itemId,
      essService.uuid,
      characteristics[1].uuid,
      (error, characteristic) => {
        const hum = characteristic?.value;
        const raw = Buffer.from(hum, "base64");
        const humValue = raw.readInt32LE(0);

        setSensorData((prev) => ({
          ...prev,
          humidity_pct: humValue / 100,
        }));
      },
    );

    manager.monitorCharacteristicForDevice(
      itemId,
      essService.uuid,
      characteristics[2].uuid,
      (error, characteristic) => {
        const press = characteristic?.value;
        const raw = Buffer.from(press, "base64");
        const pressValue = raw.readInt32LE(0);

        setSensorData((prev) => ({
          ...prev,
          pressure_hpa: pressValue,
        }));
      },
    );

    manager.monitorCharacteristicForDevice(
      itemId,
      essService.uuid,
      characteristics[3].uuid,
      (error, characteristic) => {
        const pm1 = characteristic?.value;
        const raw = Buffer.from(pm1, "base64");
        const pm1Value = raw.readInt16LE(0);

        setSensorData((prev) => ({
          ...prev,
          pm1_0_ugm3: pm1Value,
        }));
      },
    );

    const pm25Value = await manager.monitorCharacteristicForDevice(
      itemId,
      essService.uuid,
      characteristics[4].uuid,
      (error, characteristic) => {
        const pm25 = characteristic?.value;
        const raw = Buffer.from(pm25, "base64");
        const pm25Value = raw.readInt16LE(0);

        setSensorData((prev) => ({
          ...prev,
          pm2_5_ugm3: pm25Value,
        }));
      },
    );

    manager.monitorCharacteristicForDevice(
      itemId,
      essService.uuid,
      characteristics[5].uuid,
      (error, characteristic) => {
        const pm10 = characteristic?.value;
        const raw = Buffer.from(pm10, "base64");
        const pm10Value = raw.readInt16LE(0);

        setSensorData((prev) => ({
          ...prev,
          pm10_ugm3: pm10Value,
        }));
      },
    );

    setConnectedDeviceId(itemId);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {!connectedDeviceId && (
        <>
          <Text style={{ fontSize: 30, marginTop: 20, fontWeight: "bold" }}>
            Available devices
          </Text>

          <FlatList
            data={devices}
            style={styles.deviceList}
            contentContainerStyle={styles.deviceListContent}
            renderItem={({ item }) => (
              <DeviceItem
                name={item.name}
                onPress={() => {
                  onPress(item.id);
                }}
              />
            )}
            keyExtractor={(device) => device.id}
          />
        </>
      )}

      {connectedDeviceId && (
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Connected to AirNode</Text>
        </View>
      )}

      {connectedDeviceId && (
        <View style={styles.sensorContainer}>
          <Text style={styles.value}>
            Temperature: {sensorData.temperature_c ?? "—"} °C
          </Text>

          <Text style={styles.value}>
            Humidity: {sensorData.humidity_pct ?? "—"} %{" "}
          </Text>

          <Text style={styles.value}>
            Pressure: {sensorData.pressure_hpa ?? "—"} hPa
          </Text>

          <Text style={styles.value}>
            PM 1.0: {sensorData.pm1_0_ugm3 ?? "—"} µg/m³{" "}
          </Text>

          <Text style={styles.value}>
            PM 2.5: {sensorData.pm2_5_ugm3 ?? "—"} µg/m³{" "}
          </Text>

          <Text style={styles.value}>
            PM 10: {sensorData.pm10_ugm3 ?? "—"} µg/m³{" "}
          </Text>
        </View>
      )}
      <View style={styles.buttons}>
        <Button onPress={onClick} title="Scan" color={ACCENT_COLOR}></Button>
        <Button
          onPress={() => onClickDisconnectBle(connectedDeviceId)}
          title="Disconnect"
          color={ACCENT_COLOR}
        ></Button>
      </View>
    </View>
  );
}

const ACCENT_COLOR = "#1A9E6E";
const MINT_COLOR = "#38E8A0";
const NEUTRAL_GRAY = "#6B7280";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: "#1f2937",
  },

  value: {
    fontSize: 16,
    color: "#1F2937",
    paddingVertical: 4,
  },
  sensorContainer: {
    marginVertical: 50,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
  },
  deviceList: {
    flexGrow: 0,
    maxHeight: 280,
    marginBottom: 24,
  },
  deviceListContent: {
    paddingBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
    borderRadius: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: MINT_COLOR,
  },
  statusText: {
    fontSize: 15,
    color: NEUTRAL_GRAY,
  },
});
