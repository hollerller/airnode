// AirNode — Module 0.1.6: ES6 Modules
// File: modulo-0/js/06-modules/sensors.js

// ─────────────────────────────────────────────────────────────
// EXERCISE 1
// Export the following as NAMED exports:
//
// - BATTERY_LOW_THRESHOLD: a constant equal to 3400
//
// - isBatteryLow: arrow function that receives a reading
//   and returns true if battery_mv < BATTERY_LOW_THRESHOLD
//
// - getAirQualityStatus: arrow function that receives { pm2_5_ugm3 }
//   and returns "good" / "moderate" / "dangerous"
//   (same logic as module 0.1.1)
//
// - formatReading: arrow function that receives a reading
//   and returns: "airnode_abc123 | 22.5°C | Air: good | Battery: OK"
//   (reuse isBatteryLow and getAirQualityStatus internally)
// ─────────────────────────────────────────────────────────────

export const BATTERY_LOW_THRESHOLD = 3400;

export const isBatteryLow = (reading) => {
  return reading.battery_mv < BATTERY_LOW_THRESHOLD;
};

export const getAirQualityStatus = ({ pm2_5_ugm3 }) => {
  if (pm2_5_ugm3 < 12) {
    return "good";
  } else if (pm2_5_ugm3 < 35) {
    return "moderate";
  } else return "dangerous";
};

export const formatReading = (reading) => {
  const batteryLevel = isBatteryLow(reading) ? "LOW" : "OK";

  const airQuality = getAirQualityStatus({
    pm2_5_ugm3: reading.sensors.pm2_5_ugm3,
  });

  return `${reading.device_id} | ${reading.sensors.temperature_c}°C | Air: ${airQuality} | Battery: ${batteryLevel}`;
};
