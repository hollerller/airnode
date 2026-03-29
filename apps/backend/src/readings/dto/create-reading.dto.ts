export class CreateReadingDto {
  deviceId: string;
  timestamp: number;
  temperature_c: number;
  humidity_pct: number;
  pressure_hpa: number;
  pm1_0_ugm3: number;
  pm2_5_ugm3: number;
  pm10_ugm3: number;
}
