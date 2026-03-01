import { useState } from "react";
import SensorCard from "./01-components";

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
  return (
    <div>
      {devices.length === 0 && <p>No devices connected</p>}

      {devices.map((device) => (
        <div key={device.deviceId}>
          <SensorCard
            deviceId={device.deviceId}
            temperatureC={device.temperatureC}
            pm25={device.pm25}
            batteryMv={device.batteryMv}
            status={device.status}
          />

          {device.pm25 >= 35 && (
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
          {device.batteryMv < 3400 && <div>🔋 LOW</div>}
        </div>
      ))}
    </div>
  );
};

export default DeviceDashboard;
