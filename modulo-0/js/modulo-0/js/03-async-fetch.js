// AirNode — Module 0.1.3: Async/Await + Fetch
// Theory: modulo-0/docs/03-async-fetch.md
// Run: node modulo-0/js/03-async-fetch.js

// ─────────────────────────────────────────────────────────────
// SIMULATOR — fake API calls, no network needed
// Behaves exactly like a real fetch: returns a Promise,
// resolves after a delay, can be forced to fail.
// ─────────────────────────────────────────────────────────────

const simulateFetch = (data, delay = 500, shouldFail = false) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (shouldFail ? reject(new Error("Network error")) : resolve(data)),
      delay,
    ),
  );

// Fake API responses
const fakeDevice = {
  device_id: "airnode_abc123",
  owner: "user_001",
  registered_at: 1709000000,
};

const fakeReadings = [
  { timestamp: 1709000000, sensors: { temperature_c: 22.5, pm2_5_ugm3: 8.3 } },
  { timestamp: 1708999700, sensors: { temperature_c: 21.8, pm2_5_ugm3: 7.1 } },
  { timestamp: 1708999400, sensors: { temperature_c: 23.1, pm2_5_ugm3: 9.5 } },
];

const fakeAlert = {
  alert_id: "alert_001",
  type: "pm2_5_high",
  threshold: 35,
  created_at: 1709000100,
};

// ─────────────────────────────────────────────────────────────
// EXERCISES
// ─────────────────────────────────────────────────────────────

// EXERCISE 1
// Write an async function `getDevice` that:
// - Calls simulateFetch(fakeDevice)
// - Returns the device object
// - Handles errors with try/catch — log the error and return null
// Call it and log the result.

const getDevice = async () => {
  try {
    return await simulateFetch(fakeDevice);
  } catch (error) {
    console.error("Failed to fetch data", error.message);
    return null;
  }
};

getDevice().then((data) => console.log(data));

// EXERCISE 2
// Write an async function `getReadings` that:
// - Calls simulateFetch(fakeReadings)
// - Returns the readings array
// - Handles errors with try/catch — log the error and return []
// Call it and log the length of the result.

const getReadings = async () => {
  try {
    return await simulateFetch(fakeReadings);
  } catch (error) {
    console.log("Failed to fetch readings", error.message);
    return [];
  }
};

getReadings().then((data) => console.log(data.length));

// EXERCISE 3
// Write an async function `getDeviceSafe` that:
// - Calls simulateFetch(fakeDevice, 500, true) — this one always fails
// - Handles the error gracefully — log "Failed to load device: <error message>"
// - Returns null on failure
// Call it and log the result.

const getDeviceSafe = async () => {
  try {
    return await simulateFetch(fakeDevice, 500, true);
  } catch (error) {
    console.log(`Failed to load device: ${error.message}`);
    return null;
  }
};

getDeviceSafe().then((data) => console.log(data));

// EXERCISE 4
// Write an async function `initDashboard` that:
// - Calls getDevice and getReadings in sequence (one after the other)
// - Logs: "Device: airnode_abc123 | Readings loaded: 3"
// - Handles the case where either returns null or []

const initDashboard = async () => {
  try {
    const device = await getDevice();
    const readings = await getReadings();

    console.log(
      `Device: ${device?.device_id} | Readings loaded: ${readings?.length}`,
    );
  } catch (error) {
    console.log("Dashboard init failed", error.message);
  }
};

initDashboard().then((data) => {});

// EXERCISE 5
// Write an async function `createAlert` that:
// - Receives an alert object as parameter
// - Calls simulateFetch(alert, 300) to simulate a POST
// - Logs: "Alert created: alert_001 (pm2_5_high)"
// - Handles errors with try/catch
// Call it with fakeAlert.

const createAlert = async (alert) => {
  try {
    await simulateFetch(alert, 300);
    return `Alert created: ${alert.alert_id} (${alert.type})`;
  } catch (error) {
    console.log("Error creating alert", error.message);
    return null;
  }
};

createAlert(fakeAlert).then((data) => console.log(data));

// EXERCISE 6 (BONUS)
// Write an async function `loadDashboardData` that:
// - Calls getDevice and getReadings at the same time (in parallel, not sequence)
// - Only logs the result when BOTH have resolved
// - Logs: "Dashboard ready | Device: airnode_abc123 | Readings: 3"
// Hint: there's a built-in way to run multiple promises in parallel.
// (You'll see this covered in depth in 0.1.5 — try to figure it out here first)

const loadDashboardData = async () => {
  const [device, readings] = await Promise.all([getDevice(), getReadings()]);

  console.log(
    `Dashboard ready | Device: ${device.device_id} | Readings: ${readings.length}`,
  );
};

loadDashboardData().then((data) => {});
