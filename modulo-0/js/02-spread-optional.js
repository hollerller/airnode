// AirNode — Module 0.1.2: Spread Operator & Optional Chaining
// Theory: modulo-0/docs/02-spread-optional.md
// Run: node modulo-0/js/02-spread-optional.js

const airNodeReading = {
  device_id: "airnode_abc123",
  timestamp: 1709000000,
  battery_mv: 3650,
  sensors: {
    temperature_c: 22.5,
    humidity_pct: 60.1,
    pressure_hpa: 1013.2,
    pm2_5_ugm3: 8.3,
    pm10_ugm3: 12.1,
  },
};

const readings = [
  { timestamp: 1709000000, battery_mv: 3650, sensors: { pm2_5_ugm3: 8.3 } },
  { timestamp: 1708999700, battery_mv: 3500, sensors: { pm2_5_ugm3: 7.1 } },
  { timestamp: 1708999400, battery_mv: 3200, sensors: { pm2_5_ugm3: 9.5 } },
];

// Some readings arrive incomplete — missing sensors or fields
const incompleteReading = {
  device_id: "airnode_xyz999",
  timestamp: 1709000100,
  battery_mv: 3100,
  // sensors is missing entirely
};

const partialReading = {
  device_id: "airnode_def456",
  timestamp: 1709000200,
  battery_mv: 3400,
  sensors: {
    temperature_c: 19.3,
    // pm2_5_ugm3 is missing
  },
};

// ─────────────────────────────────────────────────────────────
// EXERCISE 1
// A firmware update changed the battery level on airNodeReading to 3100mV
// and added a new field: firmware_version: "1.0.3"
// Using spread, create a new object `updatedReading` with these changes.
// Do NOT mutate the original airNodeReading.
// Log both objects to confirm the original is unchanged.

const updatedReading = {
  ...airNodeReading,
  battery_mv: 3100,
  firmware_version: "1.0.3",
};
console.log(airNodeReading, updatedReading);

// EXERCISE 2
// A new temperature reading came in: temperature_c is now 24.8°C
// Using spread, create `updatedReading2` with the updated sensor value.
// All other sensor fields must remain intact.
// Log updatedReading2.sensors to confirm.

const updatedReading2 = {
  ...airNodeReading,
  sensors: {
    ...airNodeReading.sensors,
    temperature_c: 24.8,
  },
};

console.log(updatedReading2.sensors);

// EXERCISE 3
// Using spread, merge the `readings` array with this new batch:
const newBatch = [
  { timestamp: 1709000300, battery_mv: 3600, sensors: { pm2_5_ugm3: 6.2 } },
  { timestamp: 1709000600, battery_mv: 3580, sensors: { pm2_5_ugm3: 5.9 } },
];
// Create `allReadings` with the new batch at the end.
// Log the length and the last element to confirm.

const allReadings = [...readings, ...newBatch];
const last = allReadings[allReadings.length - 1];
console.log(allReadings.length, last);

// EXERCISE 4
// Using rest parameters, separate the latest reading from the rest.
// From the `readings` array, extract `latest` and `olderReadings`.
// Log latest.timestamp and olderReadings.length.

const [latest, ...olderReadings] = readings;

console.log(latest.timestamp, olderReadings.length);

// EXERCISE 5
// BLE data sometimes arrives incomplete. Write an arrow function `getTemperature`
// that receives a reading and safely returns temperature_c.
// If temperature_c doesn't exist, return "N/A" instead of crashing.
// Test it with: airNodeReading, incompleteReading, and partialReading.

const getTemperature = (reading) => {
  const temp = reading.sensors?.temperature_c ?? "N/A";

  return temp;
};

console.log(getTemperature(airNodeReading));
console.log(getTemperature(incompleteReading));
console.log(getTemperature(partialReading));

// EXERCISE 6
// Write an arrow function `getSafepm25` that receives a reading and returns
// pm2_5_ugm3 if it exists, or 0 as a fallback.
// Test it with: airNodeReading, incompleteReading, and partialReading.

const getSafepm25 = (airNodeReading) => {
  const pm2_5_ugm3 = airNodeReading.sensors?.pm2_5_ugm3 ?? 0;

  return pm2_5_ugm3;
};

console.log(getSafepm25(airNodeReading));
console.log(getSafepm25(incompleteReading));
console.log(getSafepm25(partialReading));

// EXERCISE 7 (BONUS)
// Write an arrow function `buildMqttPayload` that receives a reading and returns
// a new object with only these fields (use spread + optional chaining + fallbacks):
//   device_id, timestamp, temperature_c (or "N/A"), pm2_5_ugm3 (or 0), battery_mv
// Test it with all four readings: airNodeReading, readings[1], incompleteReading, partialReading.
// Log each result.

const buildMqttPayload = (readings) => ({
  device_id: readings?.device_id,
  timestamp: readings?.timestamp,
  temperature_c: readings.sensors?.temperature_c ?? "N/A",
  pm2_5_ugm3: readings.sensors?.pm2_5_ugm3 ?? 0,
  battery_mv: readings?.battery_mv,
});

console.log(buildMqttPayload(airNodeReading));
console.log(buildMqttPayload(readings[1]));
console.log(buildMqttPayload(incompleteReading));
console.log(buildMqttPayload(partialReading));
