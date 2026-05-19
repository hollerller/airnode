import { instance } from "./axios";

export const postReading = async (
  deviceId: string,
  temperature_c: number,
  humidity_pct: number,
  pressure_hpa: number,
  pm1_0_ugm3: number,
  pm2_5_ugm3: number,
  pm10_ugm3: number,
) => {
  try {
    const response = await instance.post("readings", {
      deviceId: deviceId,
      temperature_c: temperature_c,
      humidity_pct: humidity_pct,
      pressure_hpa: pressure_hpa,
      pm1_0_ugm3: pm1_0_ugm3,
      pm2_5_ugm3: pm2_5_ugm3,
      pm10_ugm3: pm10_ugm3,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
