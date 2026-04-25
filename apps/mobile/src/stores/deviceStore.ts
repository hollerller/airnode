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
  setDevices: (devices: Device[]) => void;
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => void;
};

export const deviceStore = create<deviceStoreTypes>((set) => ({
  devices: [],

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
}));
