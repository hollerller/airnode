export interface DeviceCardProps {
  deviceId: string;
  temperatureC: number;
  pm25: number;
  batteryMv: number;
  status: "online" | "offline" | "error";
}
