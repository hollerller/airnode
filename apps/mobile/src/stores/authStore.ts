import { create } from "zustand";
import { manager } from "../ble/bleManager";
import { deviceStore } from "../stores/deviceStore";

type authStoreTypes = {
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const authStore = create<authStoreTypes>((set) => ({
  isLoggedIn: false,
  accessToken: "",
  refreshToken: "",

  login: (accessToken: string, refreshToken: string) =>
    set({
      isLoggedIn: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  logout: async () => {
    const deviceId = deviceStore.getState().deviceId;

    if (deviceId) {
      await manager.cancelDeviceConnection(deviceId);

      console.log("Device disconnected");
    }

    set({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
    });
  },
}));
