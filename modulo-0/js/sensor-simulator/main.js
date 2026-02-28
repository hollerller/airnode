// AirNode — Module 0.1.7: Integrator Exercise
// File: modulo-0/js/sensor-simulator/main.js
// Run: node modulo-0/js/sensor-simulator/main.js
// Stop: Ctrl+C

import { getNextReading, DEVICE_ID } from "./simulator.js";
import { processReading, updateHistory, getStats } from "./processor.js";
import { printDashboard } from "./dashboard.js";

// ─────────────────────────────────────────────────────────────
// EXERCISE 8 — Orchestrate everything
//
// Write an async function `runSimulator` that:
// 1. Starts with an empty history array and readingNumber = 0
// 2. Runs an infinite loop using `while (true)`
// 3. On each iteration:
//    a. Calls getNextReading() to get a raw reading
//    b. Increments readingNumber
//    c. Processes the reading using processReading()
//    d. Updates history using updateHistory()
//    e. Gets stats using getStats()
//    f. Prints the dashboard using printDashboard()
// 4. Waits 2 seconds between readings (use a small helper Promise)
//
// Call runSimulator() at the bottom.
// ─────────────────────────────────────────────────────────────

const runSimulator = async () => {
  let history = [];
  let readingNumber = 0;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    const reading = await getNextReading();
    readingNumber += 1;
    const processedReading = processReading(reading);
    history = updateHistory(history, processedReading);
    const stats = getStats(history);
    printDashboard(readingNumber, processedReading, stats);

    await wait(2000);
  }
};

runSimulator();
