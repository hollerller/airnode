// AirNode — Module 0.1.4: Array Methods — map, filter, find, reduce
// Theory: modulo-0/docs/04-array-methods.md
// Run: node modulo-0/js/04-array-methods.js

const readings = [
  {
    device_id: "airnode_abc123",
    timestamp: 1709000000,
    battery_mv: 3650,
    sensors: {
      temperature_c: 22.5,
      humidity_pct: 60.1,
      pm2_5_ugm3: 8.3,
      pm10_ugm3: 12.1,
    },
  },
  {
    device_id: "airnode_abc123",
    timestamp: 1708999700,
    battery_mv: 3500,
    sensors: {
      temperature_c: 21.8,
      humidity_pct: 58.4,
      pm2_5_ugm3: 42.0,
      pm10_ugm3: 67.3,
    },
  },
  {
    device_id: "airnode_xyz999",
    timestamp: 1708999400,
    battery_mv: 3200,
    sensors: {
      temperature_c: 23.1,
      humidity_pct: 55.0,
      pm2_5_ugm3: 9.5,
      pm10_ugm3: 14.2,
    },
  },
  {
    device_id: "airnode_xyz999",
    timestamp: 1708999100,
    battery_mv: 3100,
    sensors: {
      temperature_c: 19.4,
      humidity_pct: 62.3,
      pm2_5_ugm3: 38.7,
      pm10_ugm3: 55.1,
    },
  },
  {
    device_id: "airnode_abc123",
    timestamp: 1708998800,
    battery_mv: 3650,
    sensors: {
      temperature_c: 24.0,
      humidity_pct: 57.9,
      pm2_5_ugm3: 5.1,
      pm10_ugm3: 8.0,
    },
  },
];

// ─────────────────────────────────────────────────────────────
// EXERCISES
// ─────────────────────────────────────────────────────────────

// EXERCISE 1 — map
// Transform `readings` into a simplified display format.
// Each element should be: { device_id, timestamp, temp, pm25 }
// where temp = temperature_c and pm25 = pm2_5_ugm3.
// Log the result.

const displayReadings = readings.map((reading) => ({
  device_id: reading.device_id,
  timestamp: reading.timestamp,
  temp: reading.sensors.temperature_c,
  pm25: reading.sensors.pm2_5_ugm3,
}));

console.log(displayReadings);

// EXERCISE 2 — filter
// Filter readings where pm2_5_ugm3 >= 35 (dangerous air quality).
// Log the count and the device_id of each dangerous reading.

const dangerousAirQuality = readings.filter(
  (reading) => reading.sensors.pm2_5_ugm3 >= 35,
);

console.log(dangerousAirQuality.length);

dangerousAirQuality.map((data) =>
  console.log(data.sensors.pm2_5_ugm3, data.device_id),
);

// EXERCISE 3 — find
// Find the first reading from device "airnode_xyz999".
// Log its timestamp and pm2_5_ugm3.
// If not found, log "Device not found".

const firstReading = readings.find(
  (reading) => reading?.device_id === "airnode_xyz999",
);

if (firstReading) {
  console.log(firstReading.timestamp, firstReading.sensors.pm2_5_ugm3);
} else console.log("Device not found");

// EXERCISE 4 — reduce
// Calculate the average pm2_5_ugm3 across all readings.
// Log: "Average PM2.5: 20.72µg/m³" (rounded to 2 decimals)

const total = readings.reduce((acc, reading) => {
  return acc + reading.sensors.pm2_5_ugm3;
}, 0);

const avg = total / readings.length;

console.log(`Average PM2.5: ${avg.toFixed(2)}µg/m³`);

// EXERCISE 5 — chaining
// From all readings belonging to "airnode_abc123":
// - Filter them out
// - Map to get only pm2_5_ugm3 values
// - Calculate the average using reduce
// Log: "airnode_abc123 avg PM2.5: Xµg/m³" (rounded to 2 decimals)

const avgAirnode_abc123 = readings
  .filter((reading) => reading.device_id === "airnode_abc123")
  .map((reading) => ({ pm2_5_ugm3: reading.sensors.pm2_5_ugm3 }))
  .reduce((acc, reading, _, arr) => {
    return acc + reading.pm2_5_ugm3 / arr.length;
  }, 0);

console.log(`"airnode_abc123 avg PM2.5: ${avgAirnode_abc123.toFixed(2)}µg/m³"`);

// EXERCISE 6 — reduce to object
// Using reduce, build an object that groups readings by device_id.
// Result shape:
// {
//   "airnode_abc123": [ ...readings ],
//   "airnode_xyz999": [ ...readings ],
// }
// Log the number of readings per device.

const readingsByDevice = readings.reduce((acc, reading) => {
  acc[reading.device_id] = [...(acc[reading.device_id] ?? []), reading];
  return acc;
}, {});

for (device in readingsByDevice) {
  console.log(`${device}: ${readingsByDevice[device].length}`);
}

// EXERCISE 7 (BONUS) — chaining
// Find all readings with battery_mv < 3400 (low battery).
// From those, return a map with: { device_id, timestamp, battery_mv }
// Log the result.

const lowBatteryDevices = readings
  .filter((reading) => reading.battery_mv < 3400)
  .map((device) => ({
    device_id: device.device_id,
    timestamp: device.timestamp,
    battery_mv: device.battery_mv,
  }));

console.log(lowBatteryDevices);
