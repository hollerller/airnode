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
      try {
        await manager.cancelDeviceConnection(deviceId);
        console.log("Device disconnected");
      } catch (error) {
        console.error("Problem disconnecting device ", error);
      }
    }

    set({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
    });
  },
}));
