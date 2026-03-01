// AirNode — Module 0.2.4: Enums & Union Types
// Theory: modulo-0/docs/04-enums-unions.md
// Run: ts-node modulo-0/ts/04-enums-unions.ts

// ─────────────────────────────────────────────────────────────
// EXERCISE 1 — String enums
//
// Define the following string enums:
//
// DeviceStatus: Online = "online", Offline = "offline", Error = "error"
// AirQuality: Good = "good", Moderate = "moderate", Dangerous = "dangerous"
// ConnectionType: BLE = "ble", WiFi = "wifi", None = "none"
//
// Then:
// - Declare a variable `status` of type DeviceStatus, set to Online
// - Declare a variable `air` of type AirQuality, set to Dangerous
// - Declare a variable `connection` of type ConnectionType, set to BLE
// - Log all three
// - Try assigning status = "online" directly — what does TypeScript say? (comment it out)

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

enum ConnectionType {
  BLE = "ble",
  WiFi = "wifi",
  None = "none",
}

let status: DeviceStatus = DeviceStatus.Online;
let air: AirQuality = AirQuality.Dangerous;
let connection: ConnectionType = ConnectionType.BLE;

console.log(status, air, connection);
// status = "online";  // Type '"online"' is not assignable to type 'DeviceStatus'.ts(2322)

// EXERCISE 2 — Numeric enum
//
// Define a numeric enum AlertPriority:
//   Low = 1, Medium = 2, High = 3, Critical = 4
//
// Write a function `getPriorityLabel` that receives AlertPriority
// and returns a string:
//   1 → "⬇ Low"
//   2 → "➡ Medium"
//   3 → "⬆ High"
//   4 → "🔴 Critical"
//
// Test with all four values and log the results.

enum AlertPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

const getPriorityLabel = (priority: AlertPriority): string => {
  switch (priority) {
    case AlertPriority.Low:
      return "⬇ Low";
    case AlertPriority.Medium:
      return "➡ Medium";
    case AlertPriority.High:
      return "⬆ High";
    case AlertPriority.Critical:
      return "🔴 Critical";
  }
};

console.log(getPriorityLabel(1));
console.log(getPriorityLabel(2));
console.log(getPriorityLabel(3));
console.log(getPriorityLabel(4));

// EXERCISE 3 — Discriminated union
//
// Define a union type DeviceEvent with three variants:
//   { kind: "reading"; device_id: string; pm2_5: number; temperature: number }
//   { kind: "alert"; device_id: string; alertType: "pm2_5_high" | "battery_low" | "offline" }
//   { kind: "status_change"; device_id: string; from: DeviceStatus; to: DeviceStatus }
//
// Write a function `handleEvent` that receives a DeviceEvent and logs:
//   reading     → "📊 airnode_abc123 | PM2.5: 8.3 | Temp: 22.5°C"
//   alert       → "⚠ airnode_abc123 | Alert: pm2_5_high"
//   status_change → "🔄 airnode_abc123 | online → offline"
//
// Test with one event of each kind.

type DeviceEvent =
  | { kind: "reading"; device_id: string; pm2_5: number; temperature: number }
  | {
      kind: "alert";
      device_id: string;
      alertType: "pm2_5_high" | "battery_low" | "offline";
    }
  | {
      kind: "status_change";
      device_id: string;
      from: DeviceStatus;
      to: DeviceStatus;
    };

const handleEvent = (event: DeviceEvent): string => {
  switch (event.kind) {
    case "reading":
      return `📊 ${event.device_id} | PM2.5: ${event.pm2_5} | Temp: ${event.temperature}°C`;
    case "alert":
      return `⚠ ${event.device_id} | Alert: ${event.alertType}`;
    case "status_change":
      return `🔄 ${event.device_id} | ${event.from} → ${event.to}`;
  }
};

const reading: DeviceEvent = {
  kind: "reading",
  device_id: "airnode_abc123",
  pm2_5: 36,
  temperature: 20,
};

const alert: DeviceEvent = {
  kind: "alert",
  device_id: "airnode_abc123",
  alertType: "battery_low",
};

const statusChange: DeviceEvent = {
  kind: "status_change",
  device_id: "airnode_abc123",
  from: DeviceStatus.Offline,
  to: DeviceStatus.Online,
};

console.log(handleEvent(reading));
console.log(handleEvent(alert));
console.log(handleEvent(statusChange));

// Test with one event of each kind.

// EXERCISE 4 — Type narrowing
//
// Write a function `formatSensorValue` that receives value: number | null
// and returns:
//   - "N/A" if null
//   - the number formatted to 2 decimals + "µg/m³" if number
//
// Write a function `getDeviceStatusMessage` that receives status: DeviceStatus
// and returns:
//   Online  → "✓ Device is online and reporting"
//   Offline → "✗ Device is offline"
//   Error   → "⚠ Device reported an error"
//
// Test both functions with multiple values.

const formatSensorValue = (value: number | null): string => {
  if (value === null) {
    return "N/A";
  }
  return `${value.toFixed(2)}µg/m³`;
};

const getDeviceStatusMessage = (status: DeviceStatus): string => {
  switch (status) {
    case DeviceStatus.Online:
      return "✓ Device is online and reporting";
    case DeviceStatus.Offline:
      return "✗ Device is offline";
    case DeviceStatus.Error:
      return "⚠ Device reported an error";
  }
};

console.log(formatSensorValue(25));
console.log(formatSensorValue(null));
console.log(getDeviceStatusMessage(DeviceStatus.Online));
console.log(getDeviceStatusMessage(DeviceStatus.Offline));
console.log(getDeviceStatusMessage(DeviceStatus.Error));

// EXERCISE 5 — Enum in interface
//
// Define an interface AirNodeAlert:
//   - alert_id: string
//   - device_id: string
//   - type: "pm2_5_high" | "battery_low" | "offline"
//   - priority: AlertPriority
//   - status: DeviceStatus
//   - timestamp: number
//   - resolved: boolean
//
// Create an array of 3 alerts with different priorities and statuses.
// Write a function `getCriticalAlerts` that receives AirNodeAlert[]
// and returns only alerts with priority >= AlertPriority.High that are not resolved.
// Log the result.

interface AirNodeAlert {
  alert_id: string;
  device_id: string;
  type: "pm2_5_high" | "battery_low" | "offline";
  priority: AlertPriority;
  status: DeviceStatus;
  timestamp: number;
  resolved: boolean;
}

const alerts: AirNodeAlert[] = [
  {
    alert_id: "001-alert",
    device_id: "airnode_abc123",
    type: "pm2_5_high",
    priority: AlertPriority.Critical,
    status: DeviceStatus.Error,
    timestamp: Date.now(),
    resolved: false,
  },
  {
    alert_id: "003-alert",
    device_id: "airnode_abc123",
    type: "battery_low",
    priority: AlertPriority.Medium,
    status: DeviceStatus.Online,
    timestamp: Date.now(),
    resolved: true,
  },
  {
    alert_id: "003-alert",
    device_id: "airnode_abc123",
    type: "offline",
    priority: AlertPriority.High,
    status: DeviceStatus.Offline,
    timestamp: Date.now(),
    resolved: false,
  },
];

const getCriticalAlerts = (alerts: AirNodeAlert[]): AirNodeAlert[] => {
  const criticalAlerts = alerts.filter(
    (alert) => alert.priority >= AlertPriority.High && alert.resolved === false,
  );
  return criticalAlerts;
};

console.log(getCriticalAlerts(alerts));

// Write a function `getCriticalAlerts` that receives AirNodeAlert[]
// and returns only alerts with priority >= AlertPriority.High that are not resolved.
// Log the result.

// EXERCISE 6 (BONUS) — Full event pipeline
//
// Create an array of DeviceEvents (mix of reading, alert, status_change).
// Write a function `processEvents` that receives DeviceEvent[]
// and returns:
// {
//   readings: number,       ← count of reading events
//   alerts: number,         ← count of alert events
//   statusChanges: number,  ← count of status_change events
//   dangerousReadings: number, ← readings where pm2_5 >= 35
// }
// Log the result.

const mixedEvents: DeviceEvent[] = [reading, alert, statusChange];

const processEvents = (events: DeviceEvent[]) => {
  const readings = events.filter((event) => event.kind === "reading").length;
  const alerts = events.filter((event) => event.kind === "alert").length;
  const statusChanges = events.filter(
    (event) => event.kind === "status_change",
  ).length;

  const dangerousReadings = events.filter(
    (event) => event.kind === "reading" && event.pm2_5 >= 35,
  ).length;

  return {
    readings: readings,
    alerts: alerts,
    statusChanges: statusChanges,
    dangerousReadings: dangerousReadings,
  };
};

console.log(processEvents(mixedEvents));
