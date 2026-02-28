// AirNode — Module 0.1.1: Arrow Functions & Destructuring
// Theory: modulo-0/docs/01-arrow-destructuring.md
// Run: node modulo-0/js/01-arrow-destructuring.js

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
  { timestamp: 1709000000, sensors: { pm2_5_ugm3: 8.3 } },
  { timestamp: 1708999700, sensors: { pm2_5_ugm3: 7.1 } },
  { timestamp: 1708999400, sensors: { pm2_5_ugm3: 9.5 } },
];

// ─────────────────────────────────────────────────────────────
// EXERCISE 1
// Using destructuring, extract `device_id` and `battery_mv`
// from the root of airNodeReading.
// Log: "Device: airnode_abc123 | Battery: 3650mV"

const { device_id, battery_mv } = airNodeReading;
console.log(`Device: ${device_id} | Battery: ${battery_mv}mV`);

// EXERCISE 2
// Using destructuring, extract `temperature_c` and `pm2_5_ugm3`
// from airNodeReading.sensors. Rename them to `temp` and `pm25`.
// Log: "Temp: 22.5°C | PM2.5: 8.3µg/m³"

const { temperature_c: temp, pm2_5_ugm3: pm25 } = airNodeReading.sensors;
console.log(`Temp: ${temp}°C | PM2.5: ${pm25}µg/m³`);
// EXERCISE 3
// Write an arrow function `isBatteryLow` that receives a full reading
// and returns true if battery_mv < 3400, false otherwise.
// Test it with airNodeReading and log the result.

const isBatteryLow = ({ battery_mv }) => battery_mv < 3400;

console.log(isBatteryLow(airNodeReading));

// EXERCISE 4
// Write an arrow function `getAirQualityStatus` that receives { pm2_5_ugm3 }
// and returns:
//   "good"      → pm2_5_ugm3 < 12
//   "moderate"  → pm2_5_ugm3 < 35
//   "dangerous" → pm2_5_ugm3 >= 35
// Test with a few values and log the results.

const getAirQualityStatus = ({ pm2_5_ugm3 }) => {
  if (pm2_5_ugm3 < 12) {
    return "good";
  } else if (pm2_5_ugm3 < 35) {
    return "moderate";
  } else return "dangerous";
};

console.log(getAirQualityStatus({ pm2_5_ugm3: 0 }));
console.log(getAirQualityStatus({ pm2_5_ugm3: 31 }));
console.log(getAirQualityStatus({ pm2_5_ugm3: 512 }));

// EXERCISE 5
// Write an arrow function `summarizeReading` that receives a full reading
// and returns: "AirNode airnode_abc123 | 22.5°C | Battery: OK | Air: good"
// Reuse isBatteryLow and getAirQualityStatus internally.
// Log the result with airNodeReading.

const summarizeReading = (airNodeReading) => {
  const { device_id } = airNodeReading;
  const { pm2_5_ugm3, temperature_c } = airNodeReading.sensors;

  const airQuality = getAirQualityStatus({ pm2_5_ugm3: pm2_5_ugm3 });
  const batteryLevel = isBatteryLow(airNodeReading) ? "LOW" : "OK";

  console.log(
    `AirNode ${device_id} | ${temperature_c}°C | Battery: ${batteryLevel} | Air: ${airQuality}`,
  );
};

summarizeReading(airNodeReading);

// EXERCISE 6 (BONUS)
// Using array destructuring on `readings`, extract the latest and previous
// readings into separate variables.
// Log the pm2_5_ugm3 of each.

const [latest, previous] = readings;
console.log(previous.sensors.pm2_5_ugm3);
console.log(latest.sensors.pm2_5_ugm3);
