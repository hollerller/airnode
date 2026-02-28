// AirNode — Module 0.1.6: ES6 Modules
// File: modulo-0/js/06-modules/api.js

const simulateFetch = (data, delay = 500, shouldFail = false) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (shouldFail ? reject(new Error("Network error")) : resolve(data)),
      delay,
    ),
  );

const fakeDevice = {
  device_id: "airnode_abc123",
  owner: "user_001",
  registered_at: 1709000000,
};

const fakeReadings = [
  {
    device_id: "airnode_abc123",
    timestamp: 1709000000,
    battery_mv: 3650,
    sensors: { temperature_c: 22.5, humidity_pct: 60.1, pm2_5_ugm3: 8.3 },
  },
  {
    device_id: "airnode_abc123",
    timestamp: 1708999700,
    battery_mv: 3200,
    sensors: { temperature_c: 21.8, humidity_pct: 58.4, pm2_5_ugm3: 42.0 },
  },
  {
    device_id: "airnode_abc123",
    timestamp: 1708999400,
    battery_mv: 3500,
    sensors: { temperature_c: 23.1, humidity_pct: 55.0, pm2_5_ugm3: 9.5 },
  },
];

// ─────────────────────────────────────────────────────────────
// EXERCISE 2
// Export the following as NAMED exports:
//
// - getDevice: async function, fetches fakeDevice (400ms)
//   handles errors, returns null on failure
//
// - getReadings: async function, fetches fakeReadings (600ms)
//   handles errors, returns [] on failure
//
// Also export BASE_URL as a named constant:
// - BASE_URL = "https://api.airnode.io"
//
// Export a DEFAULT export: an object { getDevice, getReadings }
// ─────────────────────────────────────────────────────────────

export const getDevice = async () => {
  try {
    const device = await simulateFetch(fakeDevice, 400);
    return device;
  } catch (error) {
    console.log(`Error reading device: ${error.message}`);
    return null;
  }
};

//getDevice().then((data) => console.log(data));

// - getReadings: async function, fetches fakeReadings (600ms)
//   handles errors, returns [] on failure

export const getReadings = async () => {
  try {
    const readings = await simulateFetch(fakeReadings, 600);
    return readings;
  } catch (error) {
    console.log(`Error fetching readings: ${error.message}`);
    return [];
  }
};

//getReadings().then((data) => console.log(data));

export const BASE_URL = "https://api.airnode.io";

const api = { getDevice, getReadings };

export default api;
