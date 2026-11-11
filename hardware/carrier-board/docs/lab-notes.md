# carrier board - lab notes

## bench check (nov 10)

setup: DK on USB, PMSA003I (adafruit) + BME680 (soldered), BSS138 shifter,
10k pullups to VDD on DK side, sensors on DK 5V.
SDA P0.26 / SCL P0.27. BME680 0x76, PMS 0x12.

| point | V |
|---|---|
| 5V pin | 4.99 |
| VDD | 2.99 |
| VDD_nRF (current header) | 2.99 |
| shifter LV / HV | 2.99 / 4.87 |
| SDA/SCL DK side | 2.98-2.99 |
| SDA/SCL sensor side | 4.82-4.84 |
| sensor boards alone | ~4.8 |

5V side pullups (all connected): 3.3k
MAINREGSTATUS = 0 -> normal mode

app ok: 23.2C, 49%, 756 hPa, PM 2/7/7

notes:
- PMS needs 5V (fan), I2C is 3.3V logic
- both sensor boards pull SDA/SCL to 5V -> need shifter
- nRF pin max = VDD + 0.3 = ~3.29V, bus at 2.99 ok
- VDD header = VDD_nRF
- ~0.12V drop on the 5V jumper wire
- PMS max 100kHz

board needs:
- 5V + GND to both sensors
- shifter on SDA/SCL
- pullups only on DK side, to VDD
- SDA -> P0.26, SCL -> P0.27

## DK header positions for the shield (nov 10)

went through the DK hardware files (the pcb in kicad) to get the exact spots
of the header pins i need. the arduino headers on the DK are smd female, each
pin has two pads, so i took the middle point between them as the pin center.

P1.1 (VDD) at x 108.179, y 129.134
P4.1 (SCL) at x 99.035, y 80.874
pitch 2.54, both headers count up to the right (+x)

positions from P1.1 (kicad y goes down):

| pin | signal | x | y |
|---|---|---|---|
| P1.1 | VDD | 0 | 0 |
| P1.5 | 5V | +10.16 | 0 |
| P1.6 | GND | +12.70 | 0 |
| P4.1 | SCL (P0.27) | -9.144 | -48.26 |
| P4.2 | SDA (P0.26) | -6.604 | -48.26 |

so P4 is 48.26 up (1.9in) and 9.144 left of P1. looks like the arduino uno
layout, need to double check against the kicad arduino template.

todo:
- max current on DK 5V pin
- sensor connectors (headers vs stemma qt), mounting holes
- shifter part (PCA9306 vs BSS138), JLC stock
