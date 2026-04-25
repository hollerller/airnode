# AirNode

> Open-source environmental IoT sensor — air quality monitoring with a full-stack mobile experience.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Platform](https://img.shields.io/badge/platform-nRF52840-blue)
![App](https://img.shields.io/badge/app-Android%20%7C%20iOS-green)
![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)

---

## What is AirNode?

AirNode is a low-power environmental sensor that measures air quality in real time and streams data to a mobile app via BLE. The app acts as a gateway, forwarding sensor data to a cloud backend over HTTP.

It is designed as a complete end to end IoT product, from embedded firmware to cloud backend to cross-platform mobile app.

---

## Features

- 🌡️ Temperature, humidity and pressure (BME680)
- 💨 PM1.0, PM2.5 and PM10 particulate matter (PMSA003I)
- 📱 iOS and Android app — real-time dashboard, historical charts, device config
- 🔵 BLE connection — scan, connect, and read sensor data in real time
- ☁️ Cloud backend with auth, device registry, and data storage
- 🔋 Ultra low-power design — ~15 µA average current at 5-min intervals
- 🔧 Custom PCB hardware design (KiCad)
- 🔄 OTA firmware updates

---

## Architecture

```
┌─────────────────────────────────────────┐
│              AIRNODE DEVICE             │
│         nRF52840 + Zephyr RTOS          │
│      BME680 (I2C) · PMSA003I (I2C)      │
└──────────────────┬──────────────────────┘
                   │ BLE (notify)
                   ▼
┌─────────────────────────────────────────┐
│           MOBILE APP (Gateway)          │
│        React Native · TypeScript        │
│   BLE scan → connect → read → display  │
│          HTTP POST → Backend            │
└──────────────────┬──────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────┐
│              BACKEND                    │
│         NestJS · PostgreSQL             │
│    Auth · Device Registry · Readings    │
└─────────────────────────────────────────┘
```

---

## Tech Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Firmware       | C · Zephyr RTOS · nRF Connect SDK                   |
| Protocols      | BLE 5.0 · I2C                                       |
| Mobile         | React Native · TypeScript · Kotlin (native modules) |
| Backend        | NestJS · PostgreSQL · InfluxDB · Redis              |
| Infrastructure | Fly.io · GitHub Actions · Cloudflare                |

---

## Project Structure

```
airnode/
├── firmware/          # nRF52 firmware (C/C++ + Zephyr)
├── apps/
│   ├── mobile/        # React Native app (iOS + Android)
│   └── backend/       # NestJS REST API + MQTT
├── docs/              # Architecture, BLE profile, API reference
└── hardware/          # Schematics and BOM
```

---

## Status

This project is currently in active development. Follow the progress through commits.

| Phase            | Description                | Status         |
| ---------------- | -------------------------- | -------------- |
| Firmware Phase 1 | MCU Low Power              | ✅ Complete    |
| Firmware Phase 2 | BME680 sensor              | ✅ Complete    |
| Firmware Phase 3 | BLE Minimal                | ✅ Complete    |
| Firmware Phase 4 | PMSA003I sensor            | ✅ Complete    |
| Firmware Phase 5 | System Integration         | ✅ Complete    |
| Backend          | Auth + Device Registry     | ✅ Complete    |
| Mobile App       | Auth + BLE Provisioning    | 🔄 In progress |
| Data Pipeline    | App → HTTP → Backend → DB  | ⚪ Pending     |
| MVP Demo         | End-to-end working product | ⚪ Pending     |
| Hardware         | Custom PCB (KiCad)         | ⚪ Pending     |

---

## Getting Started

Documentation and setup guides coming soon as each phase is completed.

---

## Author

Built by [@hollerller](https://github.com/hollerller)

---

_AirNode — breathing intelligence into air quality monitoring._
