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

export const register = async (
  name: string,
  lastName: string,
  email: string,
  password: string,
) => {
  try {
    const response = await instance.post("users", {
      name: name,
      lastName: lastName,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
