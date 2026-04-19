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

  type DeviceProps = { name: string; onPress: () => void };

  const DeviceItem = ({ name, onPress }: DeviceProps) => (
    <Pressable onPress={onPress}>
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

    const characteristicValue = await manager.monitorCharacteristicForDevice(
      itemId,
      services[2].uuid,
      characteristics[0].uuid,
      (error, characteristic) => {
        const temp = characteristic?.value;
        const raw = Buffer(temp, "base64");
        const tempValue = raw.readInt32LE(0);
        console.log("Temp value", tempValue);
        console.log(
          "characteristicValue",
          JSON.stringify(characteristic?.value),
        );
      },
    );

    console.log("characteristicValue", JSON.stringify(characteristicValue));
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
});
