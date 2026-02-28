// AirNode — Module 0.1.5: Promises & Promise.all
// Theory: modulo-0/docs/05-promises.md
// Run: node modulo-0/js/05-promises.js

// ─────────────────────────────────────────────────────────────
// SIMULATOR
// ─────────────────────────────────────────────────────────────

const simulateFetch = (data, delay = 500, shouldFail = false) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (shouldFail ? reject(new Error("Network error")) : resolve(data)),
      delay,
    ),
  );

// Fake API data
const fakeDevice = {
  device_id: "airnode_abc123",
  owner: "user_001",
  registered_at: 1709000000,
};

const fakeReadings = [
  { timestamp: 1709000000, sensors: { temperature_c: 22.5, pm2_5_ugm3: 8.3 } },
  { timestamp: 1708999700, sensors: { temperature_c: 21.8, pm2_5_ugm3: 42.0 } },
  { timestamp: 1708999400, sensors: { temperature_c: 23.1, pm2_5_ugm3: 9.5 } },
];

const fakeAlerts = [
  { alert_id: "alert_001", type: "pm2_5_high", timestamp: 1708999700 },
  { alert_id: "alert_002", type: "battery_low", timestamp: 1708999400 },
];

const fakeFirmware = {
  version: "1.0.3",
  release_date: 1709000000,
  size_kb: 248,
};

// ─────────────────────────────────────────────────────────────
// EXERCISES
// ─────────────────────────────────────────────────────────────

// EXERCISE 1
// Create a Promise manually (without async/await) that:
// - Resolves with fakeDevice after 300ms
// - Use .then() to log: "Device loaded: airnode_abc123"
// - Use .catch() to log any errors
// - Use .finally() to log: "Request complete"

simulateFetch(fakeDevice, 300)
  .then((device) => console.log(`Device loaded: ${device.device_id}`))
  .catch((error) => console.log("Error", error.message))
  .finally(() => console.log("Request complete"));

// EXERCISE 2
// Write an async function `loadDashboard` that uses Promise.all to fetch
// fakeDevice (400ms), fakeReadings (600ms), and fakeAlerts (200ms) in parallel.
// Log: "Dashboard loaded | Device: airnode_abc123 | Readings: 3 | Alerts: 2"
// Also log how long it took using Date.now() before and after.

const loadDashboard = async () => {
  const initTime = Date.now();

  const [device, readings, alerts] = await Promise.all([
    simulateFetch(fakeDevice, 400),
    simulateFetch(fakeReadings, 600),
    simulateFetch(fakeAlerts, 200),
  ]);

  const finishTime = Date.now();

  console.log(
    `Dashboard loaded | Device: ${device.device_id} | Readings: ${readings.length} | Alerts: ${alerts.length}`,
  );
  console.log(`Time: ${finishTime - initTime}`);
};

loadDashboard();
// EXERCISE 3
// Write an async function `loadDashboardSafe` using Promise.allSettled.
// Fetch fakeDevice (300ms), fakeReadings (500ms, should fail), fakeAlerts (200ms).
// For each result log either:
//   "✓ device loaded" / "✓ readings loaded: 3" / "✓ alerts loaded: 2"
//   "✗ readings failed: Network error"
// The dashboard should still show partial data even when one request fails.

const loadDashboardSafe = async () => {
  const results = await Promise.allSettled([
    simulateFetch(fakeDevice, 300),
    simulateFetch(fakeReadings, 500, true),
    simulateFetch(fakeAlerts, 200),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      if (index === 0) console.log("✓ device loaded");
      if (index === 1) console.log(`✓ readings loaded: ${result.value.length}`);
      if (index === 2) console.log(`✓ alerts loaded: ${result.value.length}`);
    } else {
      if (index === 0)
        console.log(`✗ readings failed: ${result.reason.message}`);
      if (index === 1)
        console.log(`✗ readings failed: ${result.reason.message}`);
      if (index === 2)
        console.log(`✗ readings failed: ${result.reason.message}`);
    }
  });
};

loadDashboardSafe();

// EXERCISE 4
// Write an async function `loadWithFallback` that:
// - Tries to load fakeDevice (should fail)
// - If it fails, falls back to a default device:
//   { device_id: "unknown", owner: null, registered_at: null }
// - Log the final device object either way

const defaultDevice = {
  device_id: "unknown",
  owner: null,
  registered_at: null,
};

const loadWithFallback = async () => {
  try {
    const device = await simulateFetch(fakeDevice, 500, true);

    return device;
  } catch (error) {
    return defaultDevice;
  }
};

loadWithFallback().then((data) => console.log(data));

// EXERCISE 5 (BONUS)
// Write an async function `loadFullDashboard` that:
// - First loads fakeDevice (required — if this fails, stop and throw)
// - Then in parallel loads fakeReadings and fakeAlerts (both optional)
// - Then loads fakeFirmware only if fakeDevice loaded successfully
// - Log a summary: "Device: airnode_abc123 | Readings: 3 | Alerts: 2 | Firmware: 1.0.3"
// This is the real sequence the AirNode app will use on startup.

const loadFullDashboard = async () => {
  try {
    const device = await simulateFetch(fakeDevice);

    const [readings, alerts] = await Promise.all([
      simulateFetch(fakeReadings),
      simulateFetch(fakeAlerts),
    ]);

    const firmware = await simulateFetch(fakeFirmware);

    console.log(
      `Device: ${device.device_id} | Readings: ${readings?.length} | Alerts: ${alerts?.length} | Firmware: ${firmware.version}`,
    );
  } catch (error) {
    console.log("Device not reached");
  }
};

loadFullDashboard();
