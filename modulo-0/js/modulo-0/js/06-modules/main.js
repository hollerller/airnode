// AirNode — Module 0.1.6: ES6 Modules
// File: modulo-0/js/06-modules/main.js
// Run: node modulo-0/js/06-modules/main.js

// ─────────────────────────────────────────────────────────────
// EXERCISE 4
// Import from "./index.js" (the barrel file):
//   - getDevice, getReadings (named)
//   - isBatteryLow, getAirQualityStatus, formatReading (named)
//   - BASE_URL (named)
//   - api (default export from api.js — import it directly from "./api.js")
//
// Then write an async main() function that:
// 1. Logs BASE_URL
// 2. Loads device and readings in parallel using Promise.all
// 3. Logs: "Device: airnode_abc123"
// 4. Uses formatReading on each reading and logs the result
// 5. Logs how many readings have low battery using isBatteryLow
//
// Call main() at the bottom.
// ─────────────────────────────────────────────────────────────

import {
  getDevice,
  getReadings,
  isBatteryLow,
  getAirQualityStatus,
  formatReading,
  BASE_URL,
} from "./index.js";

import api from "./api.js";

const main = async () => {
  console.log(BASE_URL);
  const [device, readings] = await Promise.all([getDevice(), getReadings()]);
  console.log(`Device: ${device.device_id}`);

  let total = 0;

  for (const reading of readings) {
    console.log(formatReading(reading));

    if (isBatteryLow(reading)) total += 1;
  }

  console.log(total);
};

main();
