// AirNode — Module 0.1.6: ES6 Modules
// File: modulo-0/js/06-modules/index.js

// ─────────────────────────────────────────────────────────────
// EXERCISE 3 — Barrel file
// Re-export everything from sensors.js and api.js
// so that main.js can import everything from a single path.
//
// After this, main.js should be able to do:
//   import { isBatteryLow, getDevice, BASE_URL } from "./index.js"
// instead of importing from each file separately.
// ─────────────────────────────────────────────────────────────

export * from "./sensors.js";
export * from "./api.js";
