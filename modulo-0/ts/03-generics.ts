// AirNode — Module 0.2.3: Generics
// Theory: modulo-0/docs/03-generics.md
// Run: ts-node modulo-0/ts/03-generics.ts

// Base interfaces (from 0.2.2 — already defined for you)
interface SensorData {
  temperature_c: number;
  humidity_pct: number;
  pressure_hpa: number;
  pm2_5_ugm3: number;
  pm10_ugm3: number;
}

interface AirNodeReading {
  device_id: string;
  timestamp: number;
  battery_mv: number;
  sensors: SensorData;
}

interface Device {
  device_id: string;
  owner: string;
  status: "online" | "offline" | "error";
}

interface Alert {
  alert_id: string;
  device_id: string;
  type: "pm2_5_high" | "battery_low" | "offline";
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────
// EXERCISE 1 — Generic function
//
// Write a generic function `getFirst` that receives an array of any type T
// and returns the first element, or null if the array is empty.
//
// Test it with:
// - An array of AirNodeReading
// - An array of Device
// - An array of numbers
// Log the results and confirm TypeScript inferred the types correctly (hover in VS Code).

const readings: AirNodeReading[] = [
  {
    device_id: "airnode_abc123",
    timestamp: Date.now(),
    battery_mv: 3500,
    sensors: {
      temperature_c: 35,
      humidity_pct: 36.3,
      pressure_hpa: 1013,
      pm2_5_ugm3: 34,
      pm10_ugm3: 74,
    },
  },
  {
    device_id: "airnode_abc999",
    timestamp: Date.now(),
    battery_mv: 3500,
    sensors: {
      temperature_c: 35,
      humidity_pct: 36.3,
      pressure_hpa: 1013,
      pm2_5_ugm3: 34,
      pm10_ugm3: 74,
    },
  },
  {
    device_id: "airnode_abc123",
    timestamp: Date.now(),
    battery_mv: 3500,
    sensors: {
      temperature_c: 35,
      humidity_pct: 36.3,
      pressure_hpa: 1013,
      pm2_5_ugm3: 34,
      pm10_ugm3: 74,
    },
  },
];

const devices: Device[] = [
  { device_id: "airnode_abc123", owner: "Dave", status: "online" },
  { device_id: "airnode_abc999", owner: "Helen", status: "offline" },
  { device_id: "airnode_abc133", owner: "Leo", status: "offline" },
];

const getFirst = <T>(data: T[]): T | null =>
  data.length > 0 ? (data[0] as T) : null;

console.log(getFirst(readings));
console.log(getFirst(devices));
console.log(getFirst([1, 2, 3, 4, 5]));
console.log(getFirst([]));

// EXERCISE 2 — Generic interface
//
// Define a generic interface ApiResponse<T>:
//   - data: T
//   - success: boolean
//   - error?: string
//   - timestamp: number
//
// Then create typed responses for:
// - ApiResponse<Device> — a successful device response
// - ApiResponse<AirNodeReading[]> — a successful readings response with 2 readings
// - ApiResponse<null> — a failed response (success: false, error: "Not found")
//
// Log all three.

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

type DeviceResponse = ApiResponse<Device>;
type AirNodeReadings = ApiResponse<AirNodeReading[]>;
type FailedResponse = ApiResponse<null>;

const deviceResponse: DeviceResponse = {
  data: devices[0]!,
  success: true,
  timestamp: Date.now(),
};

const airNodeReading: AirNodeReadings = {
  data: readings,
  success: true,
  timestamp: Date.now(),
};

const failedResponse: FailedResponse = {
  data: null,
  success: false,
  timestamp: Date.now(),
};

console.log(deviceResponse);

console.log(airNodeReading);

console.log(failedResponse);

// EXERCISE 3 — Generic constraint
//
// Write a generic function `getDeviceId` that:
// - Receives any object T that has at least a device_id: string property
// - Returns the device_id
//
// Test it with an AirNodeReading, a Device, and an Alert.
// Try passing a plain number — TypeScript should show an error (comment it out).

interface Alert {
  alert_id: string;
  device_id: string;
  type: "pm2_5_high" | "battery_low" | "offline";
  timestamp: number;
}

const alerts: Alert[] = [
  {
    alert_id: "humidityAlert",
    device_id: "airnode_abc123",
    type: "pm2_5_high",
    timestamp: Date.now(),
  },
];

const getDeviceId = <T extends { device_id: string }>(item: T): string => {
  return item.device_id;
};

console.log(getDeviceId(readings[0]!));
console.log(getDeviceId(devices[0]!));
console.log(getDeviceId(alerts[0]!));
//console.log(getDeviceId(13));

// EXERCISE 4 — Generic utility function
//
// Write a generic function `filterByDeviceId` that:
// - Receives items: T[] where T extends { device_id: string }
// - Receives targetId: string
// - Returns T[] — only items matching the targetId
//
// Test it with a mixed array of readings from two different devices.
// Log the filtered results for each device.

const filterByDeviceId = <T extends { device_id: string }>(
  item: T[],
  targetId: string,
): T[] => {
  return item.filter((data) => targetId === data.device_id);
};

console.log(filterByDeviceId(readings, "airnode_abc123"));

// EXERCISE 5 — Generic async function
//
// Write a generic async function `fetchData` that:
// - Receives a data parameter of type T and a delay in ms
// - Returns Promise<ApiResponse<T>>
// - Simulates a fetch (use setTimeout + Promise)
// - Returns a successful ApiResponse with the data
//
// Test it with:
// - fetchData<Device>(fakeDevice, 300)
// - fetchData<AirNodeReading[]>(fakeReadings, 500)
// Log both results using Promise.all.

const fakeDevice: Device = {
  device_id: "airnode_abc123",
  owner: "Dave",
  status: "online",
};

const fetchData = async <T>(
  items: T,
  delay: number,
): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: items,
          success: true,
          timestamp: Date.now(),
        }),
      delay,
    );
  });
};

const result = async () => {
  const result = await Promise.all([
    fetchData<Device>(fakeDevice, 300),
    fetchData<AirNodeReading[]>(readings, 500),
  ]);

  console.log(result);
};

result().then((data) => {});

// EXERCISE 6 (BONUS) — Transform response
//
// Write a generic function `transformResponse` that:
// - Receives a response: ApiResponse<T>
// - Receives a transform function: (data: T) => U
// - Returns ApiResponse<U> with the transformed data
//
// Use it to transform an ApiResponse<AirNodeReading[]> into
// an ApiResponse<number[]> containing only the pm2_5_ugm3 values.
// Log the result.

const transformResponse = <T, U>(
  response: ApiResponse<T>,
  transform: (data: T) => U,
): ApiResponse<U> => ({
  ...response,
  data: transform(response.data),
});

const main = async () => {
  const readingsResponse = await fetchData<AirNodeReading[]>(readings, 500);
  const pm25Response = transformResponse(readingsResponse, (data) =>
    data.map((response) => response.sensors.pm2_5_ugm3),
  );

  console.log(pm25Response);
};

main();
