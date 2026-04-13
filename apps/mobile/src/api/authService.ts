import { instance } from "./axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await instance.post("users/auth/login", {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
