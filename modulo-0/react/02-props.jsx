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
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <SensorCard
        deviceId="airnode_abc123"
        temperatureC={22.5}
        pm25={8.3}
        batteryMv={3100}
        status="offline"
      />

      <SensorCard
        deviceId="airnode_xyz999"
        temperatureC={19.1}
        pm25={42.0}
        batteryMv={3100}
        status="offline"
      />
      <SensorCard
        deviceId="airnode_def456"
        temperatureC={25.3}
        pm25={5.2}
        batteryMv={3800}
        status="online"
      />
    </div>
  );
};

export default App;
