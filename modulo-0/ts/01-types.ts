// AirNode — Module 0.2.1: Primitive Types & Type Inference
// Theory: modulo-0/docs/01-types.md
// Run: ts-node modulo-0/ts/01-types.ts

// ─────────────────────────────────────────────────────────────
// EXERCISE 1 — Explicit type annotations
// Declare the following variables with explicit types:
//   - deviceId: string "airnode_abc123"
//   - batteryMv: number 3650
//   - isOnline: boolean true
//   - lastSeen: number (current timestamp using Date.now())
//   - firmwareVersion: string "1.0.3"
// Log all of them.

{
  const deviceId: string = "airnode_abc123";
  const batteryMv: number = 3650;
  const isOnline: boolean = true;
  const lastSeen: number = Date.now();
  const firmwareVersion: string = "1.0.3";

  console.log(deviceId);
  console.log(batteryMv);
  console.log(isOnline);
  console.log(lastSeen);
  console.log(firmwareVersion);
}

// EXERCISE 2 — Type inference
// Declare the same variables WITHOUT explicit annotations.
// Let TypeScript infer the types.
// Then hover over each variable in VS Code — confirm TypeScript inferred correctly.
// Log all of them.

{
  const deviceId = "airnode_abc123";
  const batteryMv = 3650;
  const isOnline = true;
  const lastSeen = Date.now();
  const firmwareVersion = "1.0.3";

  console.log(deviceId);
  console.log(batteryMv);
  console.log(isOnline);
  console.log(lastSeen);
  console.log(firmwareVersion);
}

// EXERCISE 3 — Union types
// Declare the following using union types:
//   - deviceStatus: can be "online" | "offline" | "error" — set to "online"
//   - pm25Reading: can be number | null — set to null (not yet measured)
//   - connectionType: can be "ble" | "wifi" | "none" — set to "ble"
// Then update pm25Reading to 8.3 (a real reading came in).
// Log all of them.
{
  let deviceStatus: "online" | "offline" | "error" = "online";
  let pm25Reading: number | null = null;
  let connectionType: "ble" | "wifi" | "none" = "ble";

  pm25Reading = 8.3;

  console.log(deviceStatus);
  console.log(pm25Reading);
  console.log(connectionType);
}

// EXERCISE 4 — Type aliases
// Create the following type aliases:
//   - DeviceStatus: "online" | "offline" | "error"
//   - ConnectionType: "ble" | "wifi" | "none"
//   - SensorValue: number | null
// Then declare variables using these aliases:
//   - status: DeviceStatus = "offline"
//   - connection: ConnectionType = "wifi"
//   - temperature: SensorValue = 22.5
//   - humidity: SensorValue = null
// Log all of them.
{
  type DeviceStatus = "online" | "offline" | "error";
  type ConnectionType = "ble" | "wifi" | "none";
  type SensorValue = number | null;

  let status: DeviceStatus = "offline";
  let connection: ConnectionType = "wifi";
  let temperature: SensorValue = 22.5;
  let humidity: SensorValue = null;

  console.log(status);
  console.log(connection);
  console.log(temperature);
  console.log(humidity);
}

// EXERCISE 5 — Typed functions
// Write the following typed arrow functions:
//
// - formatBattery: receives batteryMv (number), returns string
//   returns "3650mV (OK)" if >= 3400, "3200mV (LOW)" if < 3400
//
// - getAirQualityStatus: receives pm25 (number), returns string
//   same logic as before: "good" / "moderate" / "dangerous"
//
// - isDeviceActive: receives status (DeviceStatus), returns boolean
//   returns true only if status === "online"
//
// Test each function with at least 2 values and log the results.

{
  type DeviceStatus = "online" | "offline" | "error";

  const formatBattery = (batteryMv: number): string =>
    batteryMv < 3400 ? `${batteryMv}mV (LOW)` : `${batteryMv}mV (OK)`;

  const getAirQualityStatus = (pm25: number): string => {
    if (pm25 < 12) {
      return "good";
    } else if (pm25 < 35) {
      return "moderate";
    } else return "dangerous";
  };

  const isDeviceActive = (status: DeviceStatus): boolean => status === "online";

  console.log(formatBattery(3000));
  console.log(formatBattery(4500));

  console.log(getAirQualityStatus(10));
  console.log(getAirQualityStatus(38));

  console.log(isDeviceActive("online"));
  console.log(isDeviceActive("offline"));
}

// EXERCISE 6 — Arrays with types
// Declare the following typed arrays:
//   - temperatures: number[] with values [22.5, 21.8, 23.1, 19.4, 24.0]
//   - deviceIds: string[] with values ["airnode_abc123", "airnode_xyz999"]
//   - sensorReadings: (number | null)[] with values [8.3, null, 9.5, null, 5.1]
//
// Then:
// - Filter sensorReadings to remove nulls and log the result with its type
// - Calculate the average of temperatures and log it
// - Log how many unique deviceIds there are

{
  const temperature: number[] = [22.5, 21.8, 23.1, 19.4, 24.0];
  const deviceIds: string[] = ["airnode_abc123", "airnode_xyz999"];
  const sensorReadings: (number | null)[] = [8.3, null, 9.5, null, 5.1];

  const readings = sensorReadings.filter((data) => data !== null);

  for (const reading of readings) console.log(`${reading}: ${typeof reading}`);

  const totalTemp = temperature.reduce((acc, temp) => {
    return (acc = acc + temp);
  }, 0);

  const avgTemp = totalTemp / temperature.length;
  console.log(avgTemp);

  const uniqueDevices = [...new Set(deviceIds)];
  console.log(uniqueDevices.length);
}

// EXERCISE 7 (BONUS) — Putting it together
// Write a typed function `summarizeDevice` that receives:
//   - deviceId: string
//   - batteryMv: number
//   - status: DeviceStatus
//   - pm25: SensorValue
// And returns a string:
//   "airnode_abc123 | online | Battery: OK | PM2.5: 8.3µg/m³"
//   "airnode_xyz999 | offline | Battery: LOW | PM2.5: N/A"
// Reuse formatBattery and getAirQualityStatus internally.
// Test with 2 different devices.

{
  type DeviceStatus = "online" | "offline" | "error";
  type SensorValue = number | null;

  const formatBattery = (batteryMv: number): string =>
    batteryMv < 3400 ? `${batteryMv}mV (LOW)` : `${batteryMv}mV (OK)`;

  const summarizeDevice = (
    deviceId: string,
    batteryMv: number,
    status: DeviceStatus,
    pm25: SensorValue,
  ): string => {
    const formattedBattery = formatBattery(batteryMv);
    const pm25Reading = pm25 !== null ? `${pm25}µg/m³` : "N/A";

    return `${deviceId} | ${status} | Battery: ${formattedBattery} | PM2.5: ${pm25Reading}`;
  };

  console.log(summarizeDevice("airnode_abc123", 3300, "online", 32));
  console.log(summarizeDevice("airnode_xyz999", 1234, "offline", null));
}
