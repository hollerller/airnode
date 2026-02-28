// AirNode — Module 0.1.7: Integrator Exercise
// File: modulo-0/js/sensor-simulator/dashboard.js

// ─────────────────────────────────────────────────────────────
// EXERCISE 7
// Export `printDashboard`: arrow function that receives
// (readingNumber, processedReading, stats) and prints to terminal:
//
// ════════════════════════════════════
//  AirNode Simulator — airnode_abc123
// ════════════════════════════════════
//  Reading #1 — 2024-02-27 10:00:00
//  Temp:     22.5°C
//  Humidity: 60.1%
//  PM2.5:    8.3 µg/m³  ✓ good
//  Battery:  3650mV     ✓ OK
// ────────────────────────────────────
//  History (1 readings)
//  Avg PM2.5: 8.30 µg/m³
//  Avg Temp:  22.50°C
//  Alerts:    0
// ════════════════════════════════════
//
// If the reading is not valid, print:
// ⚠ Reading #X — incomplete (no sensor data)
//
// For PM2.5 status use: ✓ good / ⚠ moderate / ✗ dangerous
// For battery use: ✓ OK / ✗ LOW
//
// Hint: new Date(timestamp).toLocaleString() formats the timestamp.

export const printDashboard = (readingNumber, processedReading, stats) => {
  const {
    device_id,
    temperature_c,
    humidity_pct,
    pm2_5_ugm3,
    battery_mv,
    airQuality,
    batteryLow,
  } = processedReading;

  const { count, avgPm25, avgTemp, alertCount } = stats;

  if (processedReading.valid) {
    const airQualityIcon =
      airQuality === "good"
        ? "✓ good"
        : airQuality === "moderate"
          ? "⚠ moderate"
          : "✗ dangerous";

    const batteryIcon = batteryLow ? "✗ LOW" : "✓ OK";

    console.log("════════════════════════════════════");
    console.log(`AirNode Simulator — ${device_id}`);
    console.log("════════════════════════════════════");
    console.log(
      `Reading #${readingNumber} — ${new Date(processedReading.timestamp).toLocaleString()}`,
    );
    console.log(`Temp:     ${temperature_c}°C`);
    console.log(`Humidity: ${humidity_pct}%`);
    console.log(`PM2.5:    ${pm2_5_ugm3} µg/m³  ${airQualityIcon}`);
    console.log(`Battery:  ${battery_mv}mV     ${batteryIcon}`);
    console.log("────────────────────────────────────");
    console.log(`History (${count} readings)`);
    console.log(`Avg PM2.5: ${avgPm25} µg/m³`);
    console.log(`Avg Temp:  ${avgTemp}°C`);
    console.log(`Alerts:    ${alertCount}`);
    console.log("════════════════════════════════════");
  } else {
    console.log(`⚠ Reading #${readingNumber} — incomplete (no sensor data)`);
  }
};
