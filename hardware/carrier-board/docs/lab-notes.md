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

P1.1 is net VIO in the DK schematic, P1.5 is V5V, P1.6 GND.

## 5V pin power (nov 10)

J2 usb -> D80 -> SW8 (power switch) -> U12 boost XC9148 -> V5V -> P1.5
V5V also feeds the VDD buck (U11 XC9236, 3.0V)

| limit | mA |
|---|---|
| usb J2 | 500 |
| D80 IF | 500 |
| XC9148 (5V out, 3.3V in) | 750 |

shield load @5V: PMS <=100, BME680 module <15 -> ~115mA
from usb ~140mA. works fine on the bench.

## sensor modules on the shield (nov 10)

both plug into female 2.54 headers on the shield.

| module | header | used | not connected |
|---|---|---|---|
| BME680 (soldered) | 1x4 | GND, VCC, SDA, SCL | - |
| PMSA003I (adafruit) | 1x7 | VIN, GND, SCL, SDA | 3Vo, RST, SET |

adafruit board 51.0 x 35.5, mounting holes 2.5mm (M2.5), in line with the
header row. from VIN center: -7.62 and +22.86 (measured -7.609 / +22.849),
pins count up to +x. air goes out the side, keep that side clear.

BME680 board 22 x 22, holes 3.2mm, no drawings found -> no screws, 5g, the
header holds it. it also has 2 easyC connectors if i ever want a cable.

## shifter (nov 10)

2x BSS138, same circuit as the bench shifter. both options were extended at
JLC, the PCA9306 was more parts and harder to hand solder.

part: nexperia BSS138P,215, LCSC C75547, SOT-23
- VGS(th) 0.9 / 1.2 / 1.5 V, gate at 3.0V -> ok
- RDSon <= 2 ohm @ VGS 5V, bus is ~2mA -> doesn't matter
- pins: 1 G, 2 S, 3 D

per channel: G -> VDD, S -> DK side (pullup to VDD), D -> sensor side
(module pullups to 5V)

assembly: SMD on top by JLC, headers hand soldered. male headers to the DK
on the bottom, female headers for the modules on top.

## pullups (nov 11)

module pullups, measured unpowered, each module alone:
BME680 10k, PMS 9.7k -> 4.92k in parallel on the 5V side.
the 3.3k from the bench check included the shifter's 10k (4.92k || 10k = 3.30k).

I2C spec, standard mode: VOL 0.4V, IOL 3mA, tr 1000ns, Cb guess 100pF

| side | V | Rmin | Rmax | R |
|---|---|---|---|---|
| DK | 3.0 | 0.87k | 11.8k | 4.7k (mine) |
| sensors | 5.0 | 1.53k | 11.8k | 4.92k (modules) |

nRF pin sinks both sides when it pulls low: 0.64 + 1.0 = 1.66mA < 3mA

## bom (nov 11)

| ref | part | LCSC | JLC | qty |
|---|---|---|---|---|
| Q1, Q2 | BSS138P,215 SOT-23 | C75547 | extended | 2 |
| R1, R2 | 4.7k 1% 0805 | C17673 | basic | 2 |
| C1, C2 | 10uF 25V X5R 0805 | C15850 | basic | 2 |
| J1 | male header to DK P1 | - | hand | 1 |
| J2 | male header to DK P4 | - | hand | 1 |
| J3 | female 1x4 (BME680) | - | hand | 1 |
| J4 | female 1x7 (PMS) | - | hand | 1 |
| H1, H2 | M2.5 holes (PMS) | - | - | 2 |

C1, C2 next to the PMS header (adafruit board has no cap on VIN).
