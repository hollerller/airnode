import { create } from "zustand";

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
    set((state) => ({
      isLoggedIn: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    })),
  logout: () =>
    set((state) => ({
      isLoggedIn: false,
      accessToken: "",
      refreshToken: "",
    })),
}));
