# AirNode

> Open-source environmental IoT sensor — air quality monitoring with a full-stack mobile experience.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Platform](https://img.shields.io/badge/platform-nRF52840-blue)
![App](https://img.shields.io/badge/app-Android%20%7C%20iOS-green)
![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)

---

## What is AirNode?

AirNode is a low-power environmental sensor that measures air quality in real time and streams data to a mobile app via BLE and MQTT over WiFi.

It is designed as a complete end-to-end IoT product — from embedded firmware to cloud backend to cross-platform mobile app.

---

## Features

- 🌡️ Temperature, humidity and pressure (BME680)
- 💨 PM1.0, PM2.5 and PM10 particulate matter (PMSA003I)
- 📱 iOS and Android app — real-time dashboard, historical charts, device config
- 🔵 BLE provisioning — connect and configure the device from the app
- ☁️ MQTT data pipeline with cloud backend
- 🔋 Ultra low-power design — target <50 µA average current
- 🔧 Custom PCB hardware design (KiCad)
- 🔄 OTA firmware updates

---

## Architecture

```
┌─────────────────────────────────────────┐
│              AIRNODE DEVICE             │
│         nRF52840 + Zephyr RTOS          │
│      BME680 (I2C) · PMSA003I (I2C)      │
└──────────┬──────────────┬───────────────┘
           │ BLE          │ MQTT over WiFi
           ▼              ▼
┌──────────────┐   ┌─────────────────────┐
│  Mobile App  │   │       Backend       │
│ React Native │◄──│ NestJS · PostgreSQL │
│  TypeScript  │   │ InfluxDB · Redis    │
│  iOS/Android │   │ EMQX MQTT Broker    │
└──────────────┘   └─────────────────────┘
```

---

## Tech Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Firmware       | C/C++ · Zephyr RTOS · nRF Connect SDK               |
| Protocols      | BLE 5.0 · MQTT · I2C                                |
| Mobile         | React Native · TypeScript · Kotlin (native modules) |
| Backend        | NestJS · PostgreSQL · InfluxDB · Redis              |
| Broker         | EMQX Cloud                                          |
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
├── hardware/          # Schematics and BOM
└── modulo-0/          # Learning exercises (JS · TS · React)
```

---

## Status

This project is currently in active development. Follow the progress through commits.

| Phase            | Description                | Status         |
| ---------------- | -------------------------- | -------------- |
| Firmware Phase 1 | MCU Low Power              | ✅ Complete    |
| Firmware Phase 2 | BME680 sensor              | ✅ Complete    |
| Firmware Phase 3 | BLE Minimal                | ✅ Complete    |
| Firmware Phase 4 | PMSA003I sensor            | ✅ In progress |
| Firmware Phase 5 | System Integration         | ✅ Pending     |
| Backend          | Auth + Device Registry     | 🔄 Pending     |
| Mobile App       | Auth + BLE Provisioning    | ⚪ Pending     |
| Data Pipeline    | MQTT + Real-time           | ⚪ Pending     |
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
