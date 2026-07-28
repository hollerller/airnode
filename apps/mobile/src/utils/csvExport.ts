import { sensorReading } from "./sensorReading";

export function readingsToCSV(readings: sensorReading[]): string {
  const headers =
    "created At,Temperature (°C),Humidity (%),Pressure (hPa),PM1.0 (µg/m³),PM2.5 (µg/m³),PM10 (µg/m³)";

  const lines = readings.map((r) => {
    const reading = `${r.createdAt},${r.temperature_c},${r.humidity_pct},${r.pressure_hpa},${r.pm1_0_ugm3},${r.pm2_5_ugm3},${r.pm10_ugm3}`;

    return reading;
  });

  return headers + "\n" + lines.join("\n");
}
