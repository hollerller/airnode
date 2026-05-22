import { create } from "zustand";

type Device = {
  deviceId: string;
  deviceName: string;
  firmwareVersion: string;
  batteryMv: number;
  isOnline: boolean;
  createdAt: Date;
  lastSeen: Date;
  user: number;
  deviceToken: string;
};

type deviceStoreTypes = {
  devices: Device[];
  deviceId: string;
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => void;
  setConnectedDevice: (deviceId: string) => void;
};

export const deviceStore = create<deviceStoreTypes>((set) => ({
  devices: [],
  deviceId: "",

  setDevices: (devices: Device[]) =>
    set((state) => ({
      devices: devices,
    })),

  addDevice: (device: Device) =>
    set((state) => ({
      devices: [...state.devices, device],
    })),

  removeDevice: (deviceId: string) =>
    set((state) => ({
      devices: state.devices.filter((device) => device.deviceId !== deviceId),
    })),

  setConnectedDevice: (deviceId: string) => {
    set((state) => ({
      deviceId: deviceId,
    }));
  },
}));
