// AirNode — Module 0.1.7: Integrator Exercise
// File: modulo-0/js/sensor-simulator/processor.js

export const BATTERY_LOW_THRESHOLD = 3400;
export const PM25_MODERATE_THRESHOLD = 12;
export const PM25_DANGEROUS_THRESHOLD = 35;
export const MAX_HISTORY = 10;

// ─────────────────────────────────────────────────────────────
// EXERCISE 1
// Export `isValidReading`: arrow function that receives a reading
// and returns true only if reading.sensors exists AND
// reading.sensors.pm2_5_ugm3 exists AND
// reading.sensors.temperature_c exists.
// Use optional chaining.

export const isValidReading = (reading) => {
  const isValid =
    reading?.sensors &&
    reading?.sensors?.pm2_5_ugm3 &&
    reading?.sensors?.temperature_c;
  return isValid;
};

// EXERCISE 2
// Export `getAirQualityStatus`: arrow function that receives { pm2_5_ugm3 }
// and returns "good" / "moderate" / "dangerous"
// Use the threshold constants above.

export const getAirQualityStatus = ({ pm2_5_ugm3 }) => {
  if (pm2_5_ugm3 > PM25_DANGEROUS_THRESHOLD) {
    return "dangerous";
  } else if (pm2_5_ugm3 > PM25_MODERATE_THRESHOLD) {
    return "moderate";
  } else {
    return "good";
  }
};

// EXERCISE 3
// Export `isBatteryLow`: arrow function that receives a reading
// and returns true if battery_mv < BATTERY_LOW_THRESHOLD.

export const isBatteryLow = (reading) =>
  reading.battery_mv < BATTERY_LOW_THRESHOLD;

// EXERCISE 4
// Export `processReading`: arrow function that receives a reading
// and returns a new object with this shape:
// {
//   device_id,
//   timestamp,
//   battery_mv,
//   temperature_c,   ← from sensors (use fallback 0 if missing)
//   humidity_pct,    ← from sensors (use fallback 0 if missing)
//   pm2_5_ugm3,      ← from sensors (use fallback 0 if missing)
//   airQuality,      ← result of getAirQualityStatus
//   batteryLow,      ← result of isBatteryLow
//   valid,           ← result of isValidReading
// }
// Use spread + optional chaining + fallbacks.

export const processReading = (reading) => {
  return {
    device_id: reading.device_id,
    timestamp: reading.timestamp,
    battery_mv: reading.battery_mv,
    temperature_c: reading?.sensors?.temperature_c ?? 0,
    humidity_pct: reading?.sensors?.humidity_pct ?? 0,
    pm2_5_ugm3: reading?.sensors?.pm2_5_ugm3 ?? 0,
    airQuality: getAirQualityStatus({
      pm2_5_ugm3: reading?.sensors?.pm2_5_ugm3,
    }),
    batteryLow: isBatteryLow(reading),
    valid: isValidReading(reading),
  };
};

// EXERCISE 5
// Export `updateHistory`: arrow function that receives (history, processedReading)
// and returns a new array with the reading added at the beginning.
// If the array exceeds MAX_HISTORY, drop the oldest entry.
// Do NOT mutate the original history array.

export const updateHistory = (history, processedReading) => {
  const updatedHistory = [processedReading, ...history];

  if (updatedHistory.length > MAX_HISTORY) {
    return updatedHistory.slice(0, -1);
  } else {
    return updatedHistory;
  }
};

// EXERCISE 6
// Export `getStats`: arrow function that receives a history array
// and returns:
// {
//   count,       ← number of readings
//   avgPm25,     ← average pm2_5_ugm3 rounded to 2 decimals
//   avgTemp,     ← average temperature_c rounded to 2 decimals
//   alertCount,  ← number of readings where airQuality === "dangerous"
// }
// Use array methods (filter, reduce).
// If history is empty, return { count: 0, avgPm25: 0, avgTemp: 0, alertCount: 0 }.

export const getStats = (history) => {
  if (history.length === 0) {
    return { count: 0, avgPm25: 0, avgTemp: 0, alertCount: 0 };
  } else {
    const count = history.length;
    const totalPm25 = history.reduce((acc, data) => {
      return (acc = acc + data?.pm2_5_ugm3);
    }, 0);
    const avgPm25 = (totalPm25 / count).toFixed(2);
    const totalTemp = history.reduce((acc, data) => {
      return (acc = acc + data?.temperature_c);
    }, 0);
    const avgTemp = (totalTemp / count).toFixed(2);
    const dangerousAlerts = history.filter(
      (data) =>
        getAirQualityStatus({
          pm2_5_ugm3: data?.pm2_5_ugm3,
        }) === "dangerous",
    );
    const alertCount = dangerousAlerts.length;
    return { count, avgPm25, avgTemp, alertCount };
  }
};
