// AirNode — Module 0.2.2: Interfaces & Types
// Theory: modulo-0/docs/02-interfaces.md
// Run: ts-node modulo-0/ts/02-interfaces.ts

// ─────────────────────────────────────────────────────────────
// EXERCISE 1 — Define the core AirNode interfaces
//
// Define the following interfaces:
//
// SensorData:
//   - temperature_c: number
//   - humidity_pct: number
//   - pressure_hpa: number
//   - pm2_5_ugm3: number
//   - pm10_ugm3: number
//   - gas_resistance_ohm?: number  (optional)
//
// AirNodeReading:
//   - device_id: string
//   - timestamp: number
//   - battery_mv: number
//   - sensors: SensorData
//   - firmware_version?: string  (optional)
//
// Then create a valid reading object typed as AirNodeReading and log it.

interface SensorData {
  temperature_c: number;
  humidity_pct: number;
  pressure_hpa: number;
  pm2_5_ugm3: number;
  pm10_ugm3: number;
  gas_resistance_ohm?: number;
}

interface AirNodeReading {
  device_id: string;
  timestamp: number;
  battery_mv: number;
  sensors: SensorData;
  firmware_version?: string;
}

const reading: AirNodeReading = {
  device_id: "airnode_abc123",
  timestamp: Date.now(),
  battery_mv: 3500,
  sensors: {
    temperature_c: 35,
    humidity_pct: 36.3,
    pressure_hpa: 1013,
    pm2_5_ugm3: 34,
    pm10_ugm3: 74,
    gas_resistance_ohm: 123,
  },
  firmware_version: "1.0.1",
};

console.log(reading);

// EXERCISE 2 — Readonly + optional
//
// Define a Device interface:
//   - readonly device_id: string
//   - readonly registered_at: number
//   - owner: string
//   - status: "online" | "offline" | "error"
//   - last_seen?: number  (optional)
//   - firmware_version?: string  (optional)
//
// Create a device object and:
// - Try to reassign device_id — TypeScript should throw an error (comment it out after)
// - Update owner to a new value — this should work fine
// - Log the device

interface Device {
  readonly device_id: string;
  readonly registered_at: number;
  owner: string;
  status: "online" | "offline" | "error";
  last_seen?: number;
  firmware_version?: string;
}

const device: Device = {
  device_id: "airnode_abc123",
  registered_at: 123456,
  owner: "Dave",
  status: "error",
  last_seen: 1234,
  firmware_version: "1.0.1",
};

//device.device_id = "test";
device.owner = "Helen";

console.log(device);

// EXERCISE 3 — Interface extension
//
// Define BaseReading:
//   - device_id: string
//   - timestamp: number
//   - battery_mv: number
//
// Define ProcessedReading extending BaseReading, adding:
//   - temperature_c: number
//   - humidity_pct: number
//   - pm2_5_ugm3: number
//   - airQuality: "good" | "moderate" | "dangerous"
//   - batteryLow: boolean
//   - valid: boolean
//
// Create one valid ProcessedReading object and log it.

interface BaseReading {
  device_id: string;
  timestamp: number;
  battery_mv: number;
}

interface ProcessedReading extends BaseReading {
  temperature_c: number;
  humidity_pct: number;
  pm2_5_ugm3: number;
  airQuality: "good" | "moderate" | "dangerous";
  batteryLow: boolean;
  valid: boolean;
}

const processedreading: ProcessedReading = {
  device_id: "airnode_abc123",
  timestamp: Date.now(),
  battery_mv: 2300,
  temperature_c: 35,
  humidity_pct: 80,
  pm2_5_ugm3: 33,
  airQuality: "dangerous",
  batteryLow: true,
  valid: true,
};

console.log(processedreading);

// EXERCISE 4 — Type aliases + intersection
//
// Define these type aliases:
//   - DeviceStatus: "online" | "offline" | "error"
//   - ConnectionType: "ble" | "wifi" | "none"
//   - SensorValue: number | null
//
// Define a BaseDevice interface:
//   - device_id: string
//   - owner: string
//
// Define FullDevice as an intersection of BaseDevice and:
//   - status: DeviceStatus
//   - connection: ConnectionType
//   - battery_mv: SensorValue
//
// Create a FullDevice object and log it.

type DeviceStatus = "online" | "offline" | "error";
type ConnectionType = "ble" | "wifi" | "none";
type SensorValue = number | null;

interface BaseDevice {
  device_id: string;
  owner: string;
}

type FullDevice = BaseDevice & {
  status: DeviceStatus;
  connection: ConnectionType;
  battery_mv: SensorValue;
};

const fullDevice: FullDevice = {
  device_id: "airnode_abc123",
  owner: "Dave",
  status: "offline",
  connection: "wifi",
  battery_mv: 2400,
};

console.log(fullDevice);
// EXERCISE 5 — Typed functions
//
// Using the interfaces from exercises 1 and 3, write typed functions:
//
// - processReading: receives AirNodeReading, returns ProcessedReading
//   (same logic as the JS version in 0.1.7 — reuse what you know)
//
// - isBatteryLow: receives AirNodeReading, returns boolean
//   (battery_mv < 3400)
//
// - getAirQualityStatus: receives SensorData, returns "good" | "moderate" | "dangerous"
//
// Test processReading with the reading from exercise 1 and log the result.

type airQuality = "good" | "moderate" | "dangerous";

const isBatteryLow = (reading: AirNodeReading) => reading.battery_mv < 3400;

const getAirQualityStatus = (pm25: number): airQuality => {
  if (pm25 < 12) {
    return "good";
  } else if (pm25 < 35) {
    return "moderate";
  } else return "dangerous";
};

const processReading = (reading: AirNodeReading): ProcessedReading => {
  return {
    device_id: reading.device_id,
    timestamp: reading.timestamp,
    battery_mv: reading.battery_mv,
    temperature_c: reading.sensors.temperature_c,
    humidity_pct: reading.sensors.humidity_pct,
    pm2_5_ugm3: reading.sensors.pm2_5_ugm3,
    airQuality: getAirQualityStatus(reading.sensors.pm2_5_ugm3),
    batteryLow: isBatteryLow(reading),
    valid: true,
  };
};

const processReading2 = processReading(reading);

console.log(processReading2);

// EXERCISE 6 (BONUS) — Array of interfaces
//
// Create readings: AirNodeReading[] with at least 3 readings
// (vary the sensor values so some are dangerous and some are low battery)
//
// Then write a typed function `analyzeReadings` that receives AirNodeReading[]
// and returns:
// {
//   total: number,
//   dangerousCount: number,
//   lowBatteryCount: number,
//   avgPm25: number,
// }
//
// Log the result.

const readings2: AirNodeReading[] = [
  {
    device_id: "airnode_abc123",
    timestamp: Date.now(),
    battery_mv: 1000,
    sensors: {
      temperature_c: 35,
      humidity_pct: 36.3,
      pressure_hpa: 1013,
      pm2_5_ugm3: 34,
      pm10_ugm3: 74,
      gas_resistance_ohm: 123,
    },
    firmware_version: "1.0.1",
  },
  {
    device_id: "airnode_abc121",
    timestamp: Date.now(),
    battery_mv: 3500,
    sensors: {
      temperature_c: 35,
      humidity_pct: 36.3,
      pressure_hpa: 1013,
      pm2_5_ugm3: 10,
      pm10_ugm3: 74,
      gas_resistance_ohm: 123,
    },
    firmware_version: "1.0.1",
  },
  {
    device_id: "airnode_abc999",
    timestamp: Date.now(),
    battery_mv: 2930,
    sensors: {
      temperature_c: 35,
      humidity_pct: 36.3,
      pressure_hpa: 1013,
      pm2_5_ugm3: 39,
      pm10_ugm3: 74,
      gas_resistance_ohm: 123,
    },
    firmware_version: "1.0.1",
  },
];

const analyzeReadings = (readings: AirNodeReading[]) => {
  const total = readings.length;
  let dangerousCount = 0;
  let lowBatteryCount = 0;
  let avgPm25 = 0;

  for (const reading of readings) {
    if (getAirQualityStatus(reading.sensors.pm2_5_ugm3) === "dangerous") {
      dangerousCount += 1;
    }

    if (isBatteryLow(reading) === true) {
      lowBatteryCount += 1;
    }
  }

  const totalPm25 = readings.reduce((acc, value) => {
    return acc + value.sensors.pm2_5_ugm3;
  }, 0);

  avgPm25 = totalPm25 / total;
  return {
    total: total,
    dangerousCount: dangerousCount,
    lowBatteryCount: lowBatteryCount,
    avgPm25: avgPm25,
  };
};

console.log(analyzeReadings(readings2));
