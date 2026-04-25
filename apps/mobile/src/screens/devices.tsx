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
import { useState } from "react";
import { Device } from "react-native-ble-plx";
import { Buffer } from "buffer";

export function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensorData, setSensorData] = useState({
    temperature_c: 0,
    humidity_pct: 0,
    pressure_hpa: 0,
    pm1_0_ugm3: 0,
    pm2_5_ugm3: 0,
    pm10_ugm3: 0,
  });

  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(
    null,
  );

  type DeviceProps = { name: string; onPress: () => void };

  const DeviceItem = ({ name, onPress }: DeviceProps) => (
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
      <View style={styles.item}>
        <Text style={styles.title}>{name}</Text>
      </View>
    </Pressable>
  );

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
          pressure_hpa: pressValue / 100,
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
      <Text style={{ fontSize: 30, marginTop: 20, fontWeight: "bold" }}>
        Available devices
      </Text>

      <FlatList
        data={devices}
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

      {connectedDeviceId && (
        <Text style={styles.titleConnected}>Connected to AirNode</Text>
      )}

      <View style={styles.sensorContainer}>
        <Text style={styles.value}>
          Temperature: {sensorData.temperature_c} °C
        </Text>

        <Text style={styles.value}>Humidity: {sensorData.humidity_pct} % </Text>

        <Text style={styles.value}>
          Pressure: {sensorData.pressure_hpa} hPa
        </Text>

        <Text style={styles.value}>PM 1.0: {sensorData.pm1_0_ugm3} µg/m³ </Text>

        <Text style={styles.value}>PM 2.5: {sensorData.pm2_5_ugm3} µg/m³ </Text>

        <Text style={styles.value}>PM 10: {sensorData.pm10_ugm3} µg/m³ </Text>
      </View>
      <View style={styles.buttons}>
        <Button onPress={onClick} title="Scan" color="#841584"></Button>
        <Button
          onPress={() => onClickDisconnectBle(connectedDeviceId)}
          title="Disconnect"
          color="#841584"
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#00ffc8fd",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },

  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
  },
  sensorContainer: {
    marginVertical: 50,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
    borderRadius: 10,
  },
  titleConnected: {
    fontSize: 26,
    backgroundColor: "#51e26e",
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    fontWeight: "bold",
  },
});
