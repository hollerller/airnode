// AirNode — Module 0.3.1: Functional Components & JSX

/* const SensorCard = () => {
  const device_id = "airnode_abc123";
  const temperature_c = "22.5°C";
  const pm2_5_ugm3 = "8.3 µg/m³";
  const battery_mv = "3650mV";
  const status = "online";
  return (
    <div>
      <h2>Device ID: {device_id}</h2>
      <p>Temperature: {temperature_c}</p>
      <p>pm2_5_ugm3: {pm2_5_ugm3}</p>
      <p>battery_mv: {battery_mv}</p>
      <p>status: {status}</p>
    </div>
  );
}; */

const SensorCard = () => {
  const device_id = "airnode_abc123";
  const temperature_c = "22.5°C";
  const pm2_5_ugm3 = "8.3 µg/m³";
  const battery_mv = "3650mV";
  const status = "online";

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
          {device_id}
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
            {temperature_c}
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
          <div style={{ fontSize: "22px", color: "#4ade80" }}>{pm2_5_ugm3}</div>
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
          <div style={{ fontSize: "22px", color: "#facc15" }}>{battery_mv}</div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
