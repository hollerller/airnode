// AirNode — Module 0.3.5: Final Exercise — AirNode Sensor Dashboard
// File: modulo-0/react/final-exercise.jsx
//
// Build a complete AirNode dashboard with:
//
// PART 1 — SensorCard component
// Reuse SensorCard from previous exercises with props:
//   deviceId, temperatureC, pm25, batteryMv, status
// Add DANGER and LOW badges conditionally

import { useEffect, useState } from "react";

const SensorCard = ({ deviceId, temperatureC, pm25, batteryMv, status }) => {
  return (
    <div
      style={{
        background: "#1a1a2e",
        color: "#e0e0e0",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "320px",
        fontFamily: "monospace",
        border: "1px solid #2a2a4a",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "14px", color: "#888" }}>
          {deviceId}
        </h2>
        <span
          style={{
            background: status === "online" ? "#1a4a2e" : "#4a1a1a",
            color: status === "online" ? "#4ade80" : "#f87171",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
          }}
        >
          {status === "online" ? "● online" : "● offline"}
        </span>
      </div>
      <div style={{ display: "grid", gap: "12px" }}>
        <div
          style={{
            background: "#0f0f1a",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            TEMPERATURE
          </div>
          <div style={{ fontSize: "22px", color: "#60a5fa" }}>
            {temperatureC}°C
          </div>
        </div>
        <div
          style={{
            background: "#0f0f1a",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            PM2.5
          </div>
          <div style={{ fontSize: "22px", color: "#4ade80" }}>{pm25}µg/m³</div>
        </div>
        <div
          style={{
            background: "#0f0f1a",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            BATTERY
          </div>
          <div style={{ fontSize: "22px", color: "#facc15" }}>
            {batteryMv}mV
          </div>
        </div>
        {pm25 >= 35 && (
          <div
            style={{
              fontSize: "11px",
              color: "#f87171",
              marginBottom: "4px",
            }}
          >
            ⚠ DANGER
          </div>
        )}
        {batteryMv < 3400 && <div>🔋 LOW</div>}
      </div>
    </div>
  );
};

// PART 2 — DeviceDashboard component
// - Holds devices array in useState
// - Renders a SensorCard for each device
// - Shows "No devices connected" if array is empty
// - Has an "Add Device" button that adds a new fake device to the list
// - Has a "Remove" button on each card that removes it from the list
// PART 3 — Stats bar
// Above the cards, show a summary bar:
//   "Total: 4 | Online: 2 | Dangerous: 1 | Low Battery: 2"
// These numbers update automatically as devices are added/removed
//
// PART 4 — useEffect
// Every time the devices array changes, log to console:
//   "Dashboard updated: X devices"
//
// Hint for remove: filter out the device by deviceId
// Hint for stats: use .filter() on the devices array
// Hint for Add Device: create a fake device object with a unique id
//   (use Date.now() for a unique id suffix)

const DeviceDashboard = () => {
  const [devices, setDevices] = useState([
    {
      deviceId: "airnode_abc123",
      temperatureC: 22.5,
      pm25: 8.3,
      batteryMv: 3650,
      status: "online",
    },
    {
      deviceId: "airnode_xyz999",
      temperatureC: 19.1,
      pm25: 42.0,
      batteryMv: 3100,
      status: "offline",
    },
    {
      deviceId: "airnode_def456",
      temperatureC: 25.3,
      pm25: 5.2,
      batteryMv: 3800,
      status: "online",
    },
    {
      deviceId: "airnode_ghi789",
      temperatureC: 31.0,
      pm25: 38.5,
      batteryMv: 3200,
      status: "error",
    },
  ]);

  const removeDevice = (devices, device) => {
    return devices.filter((element) => element.deviceId !== device.deviceId);
  };

  const onlineDevices = devices.filter((device) => device.status === "online");
  const dangerousDevices = devices.filter((device) => device.pm25 >= 35);
  const lowBatteryDevices = devices.filter((device) => device.batteryMv < 3400);

  useEffect(() => {
    console.log(`Dashboard updated: ${devices.length} devices`);
  }, [devices]);

  return (
    <>
      {devices.length === 0 && <p>No devices connected</p>}
      <div>{`Total: ${devices.length} | Online: ${onlineDevices.length} | Dangerous: ${dangerousDevices.length} | Low Battery: ${lowBatteryDevices.length}`}</div>

      <button
        onClick={() =>
          setDevices([
            ...devices,
            {
              deviceId: `airnode_fake_${Date.now()}`,
              temperatureC: 31.0,
              pm25: 22.9,
              batteryMv: 2400,
              status: "online",
            },
          ])
        }
      >
        Add Device
      </button>

      {devices.map((device) => (
        <div key={device.deviceId}>
          <SensorCard
            deviceId={device.deviceId}
            temperatureC={device.temperatureC}
            pm25={device.pm25}
            batteryMv={device.batteryMv}
            status={device.status}
          />

          <button onClick={() => setDevices(removeDevice(devices, device))}>
            Remove
          </button>
        </div>
      ))}
    </>
  );
};

export default DeviceDashboard;
