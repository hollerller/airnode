// AirNode — Module 0.2.5: Final Exercise — Full AirNode Type System
// Theory: modulo-0/docs/05-final-exercise.md
// Run: ts-node modulo-0/ts/final-exercise.ts

// ─────────────────────────────────────────────────────────────
// PART 1 — Enums
// Define all enums the system needs:
//
// DeviceStatus: Online, Offline, Error
// AirQuality: Good, Moderate, Dangerous
// AlertType: Pm25High, BatteryLow, Offline, TemperatureHigh
// AlertPriority: Low = 1, Medium = 2, High = 3, Critical = 4
// ConnectionType: BLE, WiFi, None
// ─────────────────────────────────────────────────────────────

enum DeviceStatus {
  Online = "online",
  Offline = "offline",
  Error = "error",
}

enum AirQuality {
  Good = "good",
  Moderate = "moderate",
  Dangerous = "dangerous",
}

enum AlertType {
  Pm25High = "pm2_5_high",
  BatteryLow = "battery_low",
  Offline = "offline",
  TemperatureHigh = "temperature_high",
}

enum AlertPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

enum ConnectionType {
  BLE = "BLE",
  WiFi = "WiFi",
  None = "None",
}

// ─────────────────────────────────────────────────────────────
// PART 2 — Core interfaces
// Define all data model interfaces:
//
// SensorData:
//   temperature_c, humidity_pct, pressure_hpa,
//   pm2_5_ugm3, pm10_ugm3, gas_resistance_ohm? (optional)
//
// AirNodeReading:
//   device_id, timestamp, battery_mv,
//   sensors: SensorData, firmware_version? (optional)
//
// ProcessedReading (extends AirNodeReading):
//   airQuality: AirQuality, batteryLow: boolean, valid: boolean
//
// Device:
//   readonly device_id, readonly registered_at,
//   owner, status: DeviceStatus,
//   connection: ConnectionType,
//   last_seen?: number, firmware_version?: string
//
// User:
//   readonly user_id, email, name,
//   created_at: number, devices: string[] (array of device_ids)
//
// AirNodeAlert:
//   alert_id, device_id, type: AlertType,
//   priority: AlertPriority, status: DeviceStatus,
//   timestamp, resolved: boolean, message?: string
// ─────────────────────────────────────────────────────────────

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

interface ProcessedReading extends AirNodeReading {
  airQuality: AirQuality;
  batteryLow: boolean;
  valid: boolean;
}

interface Device {
  readonly device_id: string;
  readonly registered_at: number;
  owner: string;
  status: DeviceStatus;
  connection: ConnectionType;
  last_seen?: number;
  firmware_version?: string;
}

interface User {
  readonly user_id: number;
  email: string;
  name: string;
  created_at: number;
  devices: string[];
}

interface AirNodeAlert {
  alert_id: string;
  device_id: string;
  type: AlertType;
  priority: AlertPriority;
  status: DeviceStatus;
  timestamp: number;
  resolved: boolean;
  message?: string;
}

// ─────────────────────────────────────────────────────────────
// PART 3 — Generic API response
// Define ApiResponse<T>:
//   data: T, success: boolean,
//   error?: string, timestamp: number
//
// Define these type aliases using ApiResponse:
//   DeviceResponse, ReadingsResponse, AlertsResponse, UserResponse
// ─────────────────────────────────────────────────────────────

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

type DeviceResponse = ApiResponse<Device>;
type ReadingsResponse = ApiResponse<AirNodeReading>;
type AlertsResponse = ApiResponse<AirNodeAlert>;
type UserResponse = ApiResponse<User>;

// ─────────────────────────────────────────────────────────────
// PART 4 — Event system
// Define a discriminated union DeviceEvent with:
//   { kind: "reading"; device_id: string; reading: AirNodeReading }
//   { kind: "alert"; device_id: string; alert: AirNodeAlert }
//   { kind: "status_change"; device_id: string; from: DeviceStatus; to: DeviceStatus }
//   { kind: "connection_change"; device_id: string; from: ConnectionType; to: ConnectionType }
// ─────────────────────────────────────────────────────────────

type DeviceEvent =
  | { kind: "reading"; device_id: string; reading: AirNodeReading }
  | { kind: "alert"; device_id: string; alert: AirNodeAlert }
  | {
      kind: "status_change";
      device_id: string;
      from: DeviceStatus;
      to: DeviceStatus;
    }
  | {
      kind: "connection_change";
      device_id: string;
      from: ConnectionType;
      to: ConnectionType;
    };
// ─────────────────────────────────────────────────────────────
// PART 5 — Typed processing functions
// Write the following typed functions:
//
// getAirQuality(pm25: number): AirQuality
//   < 12 → Good, < 35 → Moderate, >= 35 → Dangerous
//
// isBatteryLow(reading: AirNodeReading): boolean
//   battery_mv < 3400
//
// processReading(reading: AirNodeReading): ProcessedReading
//   builds a ProcessedReading from a raw reading
//   valid = reading.sensors exists
//
// handleEvent(event: DeviceEvent): string
//   returns a formatted log string for each event kind
//   reading       → "📊 device_id | PM2.5: X | AirQuality: good"
//   alert         → "⚠ device_id | Alert: pm2_5_high | Priority: Critical"
//   status_change → "🔄 device_id | online → offline"
//   connection_change → "📡 device_id | ble → wifi"
// ─────────────────────────────────────────────────────────────

const getAirQuality = (pm25: number): AirQuality => {
  if (pm25 < 12) {
    return AirQuality.Good;
  } else if (pm25 < 35) {
    return AirQuality.Moderate;
  } else {
    return AirQuality.Dangerous;
  }
};

const isBatteryLow = (reading: AirNodeReading): boolean =>
  reading.battery_mv < 3400;

const processReading = (reading: AirNodeReading): ProcessedReading => {
  if (reading.sensors) {
    return {
      ...reading,
      airQuality: getAirQuality(reading.sensors.pm2_5_ugm3),
      batteryLow: isBatteryLow(reading),
      valid: true,
    };
  } else {
    return {
      ...reading,
      airQuality: AirQuality.Good,
      batteryLow: false,
      valid: false,
    };
  }
};

const handleEvent = (event: DeviceEvent): string => {
  switch (event.kind) {
    case "reading":
      return `📊 ${event.device_id} | PM2.5: ${event.reading.sensors.pm2_5_ugm3} | AirQuality: ${getAirQuality(event.reading.sensors.pm2_5_ugm3)}`;
    case "alert":
      return `⚠ ${event.device_id} | Alert: ${event.alert.type} | Priority: ${event.alert.priority}`;
    case "status_change":
      return `🔄 ${event.device_id} | ${event.from} → ${event.to}`;
    case "connection_change":
      return `📡 ${event.device_id} | ${event.from} → ${event.to}`;
  }
};

// ─────────────────────────────────────────────────────────────
// PART 6 — Wire it all together
// Create sample data and test everything:
//
// 1. Create a User with 2 device_ids
// 2. Create 2 Devices (one online, one offline)
// 3. Create 3 AirNodeReadings (vary pm2_5 and battery_mv)
// 4. Process all readings using processReading
// 5. Create 2 AirNodeAlerts
// 6. Create 4 DeviceEvents (one of each kind)
// 7. Handle all events and log the output
// 8. Build ApiResponse wrappers for the device and readings
// 9. Log a final summary:
//    "System ready | Devices: 2 | Readings: 3 | Alerts: 2"
// ─────────────────────────────────────────────────────────────

const user001: User = {
  user_id: 1,
  email: "dave.test@gmail.com",
  name: "Dave",
  created_at: Date.now(),
  devices: ["airnode_abc123", "airnode_abc993"],
};

const devices: Device[] = [
  {
    device_id: "airnode_abc123",
    registered_at: Date.now(),
    owner: "Dave",
    status: DeviceStatus.Online,
    connection: ConnectionType.BLE,
    last_seen: Date.now(),
    firmware_version: "1.0.1",
  },
  {
    device_id: "airnode_abc993",
    registered_at: Date.now(),
    owner: "Dave",
    status: DeviceStatus.Offline,
    connection: ConnectionType.WiFi,
    last_seen: Date.now(),
    firmware_version: "1.0.1",
  },
];

const readings: AirNodeReading[] = [
  {
    device_id: "airnode_abc123",
    timestamp: Date.now(),
    battery_mv: 3600,
    sensors: {
      temperature_c: 23,
      humidity_pct: 90,
      pressure_hpa: 1024,
      pm2_5_ugm3: 40,
      pm10_ugm3: 21,
      gas_resistance_ohm: 12,
    },
    firmware_version: "1.0.1",
  },
  {
    device_id: "airnode_abc993",
    timestamp: Date.now(),
    battery_mv: 3450,
    sensors: {
      temperature_c: 23,
      humidity_pct: 90,
      pressure_hpa: 1024,
      pm2_5_ugm3: 36,
      pm10_ugm3: 21,
      gas_resistance_ohm: 12,
    },
    firmware_version: "1.0.1",
  },
  {
    device_id: "airnode_abc123",
    timestamp: Date.now(),
    battery_mv: 2400,
    sensors: {
      temperature_c: 23,
      humidity_pct: 90,
      pressure_hpa: 1024,
      pm2_5_ugm3: 12,
      pm10_ugm3: 21,
      gas_resistance_ohm: 12,
    },
    firmware_version: "1.0.1",
  },
];

const processedReadings = readings.map((data) => processReading(data));

const alerts: AirNodeAlert[] = [
  {
    alert_id: "001-alert",
    device_id: "airnode_abc123",
    type: AlertType.BatteryLow,
    priority: AlertPriority.Critical,
    status: DeviceStatus.Error,
    timestamp: Date.now(),
    resolved: false,
  },
  {
    alert_id: "003-alert",
    device_id: "airnode_abc993",
    type: AlertType.Pm25High,
    priority: AlertPriority.Medium,
    status: DeviceStatus.Online,
    timestamp: Date.now(),
    resolved: true,
  },
];

const events: DeviceEvent[] = [
  {
    kind: "reading",
    device_id: "airnode_abc993",
    reading: readings[0]!,
  },
  {
    kind: "alert",
    device_id: "airnode_abc123",
    alert: alerts[1]!,
  },
  {
    kind: "status_change",
    device_id: "airnode_abc123",
    from: DeviceStatus.Offline,
    to: DeviceStatus.Online,
  },
  {
    kind: "connection_change",
    device_id: "airnode_abc993",
    from: ConnectionType.BLE,
    to: ConnectionType.None,
  },
];

events.forEach((data) => console.log(handleEvent(data)));

const deviceApiResponse: DeviceResponse = {
  data: devices[0]!,
  success: true,
  timestamp: Date.now(),
};

const readingsApiResponse: ReadingsResponse = {
  data: readings[2]!,
  success: true,
  timestamp: Date.now(),
};

console.log(
  `System ready | Devices: ${devices.length} | Readings: ${readings.length} | Alerts: ${alerts.length}`,
);
