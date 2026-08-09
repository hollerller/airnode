export type sensorReading = {
  id: number | null;
  deviceId: string | null;
  createdAt: Date | null;
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  pm1_0_ugm3: number | null;
  pm2_5_ugm3: number | null;
  pm10_ugm3: number | null;
};
