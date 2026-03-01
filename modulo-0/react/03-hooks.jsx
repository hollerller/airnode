import { useEffect, useState } from "react";

const randomNumber = (min, max) =>
  (Math.random() * (max - min + 1) + min).toFixed(2);

const SensorCard = ({ deviceId, temperatureC, pm25, batteryMv, status }) => {
  const [count, setCount] = useState(0);
  const [currentPm25, setCurrentPm25] = useState(pm25);
  const [currentTemp, setCurrentTemp] = useState(temperatureC);

  useEffect(() => {
    console.log(`PM2.5 updated: ${currentPm25} µg/m³`);
  }, [currentPm25]);

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
            {currentTemp}°C
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
          <div style={{ fontSize: "22px", color: "#4ade80" }}>
            {currentPm25}µg/m³
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
            BATTERY
          </div>
          <div style={{ fontSize: "22px", color: "#facc15" }}>
            {batteryMv}mV
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            setCurrentPm25(randomNumber(0, 100));
            setCurrentTemp(randomNumber(0, 100));
            setCount(count + 1);
          }}
        >
          Refresh
        </button>
        <div>Data refreshed: {count}</div>
      </div>
    </div>
  );
};

export default SensorCard;
