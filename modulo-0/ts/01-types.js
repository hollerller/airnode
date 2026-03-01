// AirNode — Module 0.2.1: Primitive Types & Type Inference
// Theory: modulo-0/docs/01-types.md
// Run: ts-node modulo-0/ts/01-types.ts
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    var deviceId = "airnode_abc123";
    var batteryMv = 3650;
    var isOnline = true;
    var lastSeen = Date.now();
    var firmwareVersion = "1.0.3";
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
    var deviceId = "airnode_abc123";
    var batteryMv = 3650;
    var isOnline = true;
    var lastSeen = Date.now();
    var firmwareVersion = "1.0.3";
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
    var deviceStatus = "online";
    var pm25Reading = null;
    var connectionType = "ble";
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
    var status_1 = "offline";
    var connection = "wifi";
    var temperature_1 = 22.5;
    var humidity = null;
    console.log(status_1);
    console.log(connection);
    console.log(temperature_1);
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
    var formatBattery = function (batteryMv) {
        return batteryMv < 3400 ? "".concat(batteryMv, "mV (LOW)") : "".concat(batteryMv, "mV (OK)");
    };
    var getAirQualityStatus = function (pm25) {
        if (pm25 < 12) {
            return "good";
        }
        else if (pm25 < 35) {
            return "moderate";
        }
        else
            return "dangerous";
    };
    var isDeviceActive = function (status) { return status === "online"; };
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
var temperature = [22.5, 21.8, 23.1, 19.4, 24.0];
var deviceIds = ["airnode_abc123", "airnode_xyz999"];
var sensorReadings = [8.3, null, 9.5, null, 5.1];
var totalTemp = temperature.reduce(function (acc, temp) {
    return (acc = acc + temp);
}, 0);
var avgTemp = totalTemp / temperature.length;
console.log(avgTemp);
var uniqueDevices = __spreadArray([], new Set(deviceIds), true);
console.log(uniqueDevices.length);
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
