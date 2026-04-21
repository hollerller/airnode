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

  const onPress = async (itemId: string) => {
    await manager.connectToDevice(itemId);

    const deviceData =
      await manager.discoverAllServicesAndCharacteristicsForDevice(
        itemId,
        "connect",
      );
    console.log("Device Data", JSON.stringify(deviceData));

    const services = await manager.servicesForDevice(itemId);

    console.log("Services", JSON.stringify(services));

    const characteristics = await manager.characteristicsForDevice(
      itemId,
      services[2].uuid,
    );

    console.log("characteristics", JSON.stringify(characteristics));

    const tempValue = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[0].uuid,
      (error, characteristic) => {
        const temp = characteristic?.value;
        const raw = Buffer.from(temp, "base64");
        const tempValue = raw.readInt32LE(0);
        console.log("Temp value", tempValue);

        setSensorData((prev) => ({
          ...prev,
          temperature_c: tempValue / 100,
        }));
      },
    );

    const humValue = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[1].uuid,
      (error, characteristic) => {
        const hum = characteristic?.value;
        const raw = Buffer.from(hum, "base64");
        const humValue = raw.readInt32LE(0);
        console.log("Hum value", humValue);

        setSensorData((prev) => ({
          ...prev,
          humidity_pct: humValue / 100,
        }));
      },
    );

    const pressValue = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[2].uuid,
      (error, characteristic) => {
        const press = characteristic?.value;
        const raw = Buffer.from(press, "base64");
        const pressValue = raw.readInt32LE(0);
        console.log("Press value", pressValue);

        setSensorData((prev) => ({
          ...prev,
          pressure_hpa: pressValue / 100,
        }));
      },
    );

    const pm1Value = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[3].uuid,
      (error, characteristic) => {
        const pm1 = characteristic?.value;
        const raw = Buffer.from(pm1, "base64");
        const pm1Value = raw.readInt16LE(0);
        console.log("PM 1 value", pm1Value);

        setSensorData((prev) => ({
          ...prev,
          pm1_0_ugm3: pm1Value,
        }));
      },
    );

    const pm25Value = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[4].uuid,
      (error, characteristic) => {
        const pm25 = characteristic?.value;
        const raw = Buffer.from(pm25, "base64");
        const pm25Value = raw.readInt16LE(0);
        console.log("PM 2.5 value", pm25Value);

        setSensorData((prev) => ({
          ...prev,
          pm2_5_ugm3: pm25Value,
        }));
      },
    );

    const pm10Value = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[5].uuid,
      (error, characteristic) => {
        const pm10 = characteristic?.value;
        const raw = Buffer.from(pm10, "base64");
        const pm10Value = raw.readInt16LE(0);
        console.log("PM 10 value", pm10Value);

        setSensorData((prev) => ({
          ...prev,
          pm10_ugm3: pm10Value,
        }));
      },
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Devices Screen</Text>

      <FlatList
        data={devices}
        renderItem={({ item }) => (
          <DeviceItem name={item.name} onPress={() => onPress(item.id)} />
        )}
        keyExtractor={(device) => device.id}
      />

      <View style={styles.sensorContainer}>
        <Text style={styles.value}>
          Temperature: {sensorData.temperature_c}{" "}
        </Text>

        <Text style={styles.value}>Humidity: {sensorData.humidity_pct} </Text>

        <Text style={styles.value}>Pressure: {sensorData.pressure_hpa} </Text>

        <Text style={styles.value}>PM 1.0: {sensorData.pm1_0_ugm3} </Text>

        <Text style={styles.value}>PM 2.5: {sensorData.pm2_5_ugm3} </Text>

        <Text style={styles.value}>PM 10: {sensorData.pm10_ugm3} </Text>
      </View>

      <Button onPress={onClick} title="Scan" color="#841584"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },

  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
  },
});
