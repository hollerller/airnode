// AirNode — Module 0.1.7: Integrator Exercise
// File: modulo-0/js/sensor-simulator/simulator.js
//
// Generates fake AirNode sensor readings.
// Occasionally produces incomplete readings to simulate BLE packet loss.

const DEVICE_ID = "airnode_abc123";

// Generates a random number between min and max (inclusive)
const randomBetween = (min, max) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

// Generates a complete sensor reading
const generateReading = () => ({
  device_id: DEVICE_ID,
  timestamp: Date.now(),
  battery_mv: randomBetween(3000, 3700),
  sensors: {
    temperature_c: randomBetween(18, 35),
    humidity_pct: randomBetween(40, 80),
    pm2_5_ugm3: randomBetween(2, 60),
    pm10_ugm3: randomBetween(5, 80),
  },
});

// Generates an incomplete reading (simulates BLE packet loss)
const generateIncompleteReading = () => ({
  device_id: DEVICE_ID,
  timestamp: Date.now(),
  battery_mv: randomBetween(3000, 3700),
  // sensors is missing entirely
});

// 20% chance of returning an incomplete reading
export const getNextReading = async () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          Math.random() < 0.2 ? generateIncompleteReading() : generateReading(),
        ),
      500,
    ),
  );

export { DEVICE_ID };
