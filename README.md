# ESP32-P4 SPI display pass-through UVC capture board

This tscircuit design sits between a host and the common 14-pin, 2.54 mm SPI
header used by many 2.4-inch ILI9341-style display modules. Every header signal
passes directly from `J_HOST` to `J_DISPLAY`. An SN74LVC244A observes the eight
display signals without loading the pass-through bus with MCU inputs.

The capture processor is the exact `ESP32-P4NRW32X` requested for assembly
(JLCPCB/LCSC `C54540373`). It is a QFN104 ESP32-P4 v3.x with 32 MB of in-package
PSRAM. A W25Q128JVSIQ provides external boot flash. The P4's dedicated USB 2.0
High-Speed OTG pins connect to the single USB-C port through 27 ohm series
resistors and low-capacitance USBLC6-2SC6 protection; no external ULPI PHY is
needed.

USB-C supplies the capture side as well as carrying UVC data. Display-header
VCC remains pass-through-only and is isolated from USB VBUS and the local
rails. The board is 35.7 x 38.74 mm and uses four copper layers: top/bottom signals,
inner1 GND, and inner2 3.3 V, with local 1.2 V routing on the bottom.

## Header pinout

Both headers use the same pin numbering, from pin 1 at the square pad:

| Pin | Signal         | ESP32-P4 observation pin |
| --: | -------------- | ------------------------ |
|   1 | VCC            | pass-through only        |
|   2 | GND            | common ground            |
|   3 | LCD_CS         | GPIO1                    |
|   4 | LCD_RESET      | GPIO2                    |
|   5 | LCD_DC / RS    | GPIO3                    |
|   6 | LCD_SDI / MOSI | GPIO4                    |
|   7 | LCD_SCK        | GPIO5                    |
|   8 | LCD_LED        | GPIO6                    |
|   9 | LCD_SDO / MISO | GPIO7                    |
|  10 | TOUCH_CLK      | pass-through only        |
|  11 | TOUCH_CS       | pass-through only        |
|  12 | TOUCH_DIN      | pass-through only        |
|  13 | TOUCH_DO       | pass-through only        |
|  14 | TOUCH_IRQ      | GPIO8                    |

The GPIO matrix can route CS/SCK/MOSI/MISO to a GP-SPI slave, with DMA used for
long transactions. Espressif specifies up to 60 MHz for the P4 SPI-slave
peripheral, subject to duty-cycle, host timing, and DMA-buffer restrictions.

## 30 fps data path

Firmware should parse ILI9341 address-window and pixel-write commands into a
320x240 RGB565 framebuffer, then expose a UVC YUY2 stream over the P4's native
USB High-Speed device controller. One RGB565 or YUY2 frame is 153,600 bytes.
The 32 MB in-package PSRAM makes double buffering practical, so RAM is no longer
the limiting issue that it was on the STM32 version.

Uncompressed 320x240 YUY2 at 30 fps is 4.608 MB/s before USB overhead and fits
comfortably within USB High Speed. A source that rewrites every RGB565 pixel at
30 Hz must deliver 36.864 Mbit/s of SPI pixel payload, so 40 MHz has very little
command or idle margin; 50-60 MHz or partial updates provide healthier margin.
The UVC endpoint can maintain a fixed 30 fps cadence by repeating the latest
frame when the display has not changed.

MJPEG is optional. The P4 has hardware image-processing blocks, but the simplest
deterministic first firmware target is uncompressed YUY2. Hardware routing alone
does not guarantee 30 fps: firmware, DMA scheduling, PSRAM bandwidth, endpoint
configuration, and host interoperability still need validation.

## Power, clock, memory, and recovery

- Two TLV62569 buck converters generate 3.3 V from USB VBUS and the P4's 1.2 V
  core rail.
- The exact P4 variant's in-package PSRAM rails are supplied and decoupled; the
  external W25Q128 flash is powered from 3.3 V.
- A 40 MHz crystal supplies the main reference clock.
- BOOT pulls GPIO35 low and RESET pulls `CHIP_PU` low. Holding BOOT while
  pressing RESET enters the ROM joint-download mode.
- The same High-Speed USB connection can be used by the ROM download path when
  the chip is forced into download mode, even if application firmware later
  repurposes USB as UVC.

## Manufacturing status

The source type-checks, the electrical netlist reports zero errors and warnings,
schematic and PCB placement checks pass, and the autorouter completes without
router errors or jumpers. Every generated via is a conventional L1-L4 plated
through hole with a 0.30 mm finished drill and 0.60 mm copper pad. Blind, buried,
and microvias are not used. The sole intentional via-in-pad is the grounded via
in the ESP32-P4 exposed paddle; request bottom-side tenting or plugging to reduce
solder wicking.

The two 2.54 mm headers now use explicit, assembly-supported JLCPCB parts:
`J_DISPLAY` is the vertical 1x14 female HCTL `PM254-1-14-Z-8.5`
(`C2897377`), and `J_HOST` is the vertical 1x14 male HCTL
`PZ254-1-14-Z-8.5` (`C2894937`). Both footprints use 1.10 mm finished drills.
JLCPCB lists both as extended through-hole parts installed by wave soldering and
notes that an assembly fixture is required.

The manufacturing-blocker pass adds separate 10 uF capacitors at `VDD_LDO` and
`VDD_DCDCC`, keeps their 100 nF capacitors beside the MCU, adds the required
GPIO36 boot strap, and removes the core-inductor/output-capacitor overlap. The
USB ESD-to-MCU lanes are explicit top-layer routes with no vias. Their total
post-ESD lengths are 8.1895 mm (D-) and 8.1855 mm (D+), a 0.004 mm skew. The
short USB-C duplicate-pin fan-in before the ESD device remains autorouted.

The generated PCB currently has zero clearance/overlap errors, zero placement
errors, zero netlist errors, zero shorts, no jumpers, and 183 routed
connections. A fresh PTH-only Gerber/BOM/CPL package is generated under
`outputs/fabrication/spi-display-webcam-interceptor-v1.0.0/`.

The package is still a **release candidate, not an unconditional order
approval**. tscircuit reports 17 maximum-length warnings, primarily on the
shared power-plane/decoupling routing tree. These should be reviewed in the
Gerbers, and the relevant capacitor breakouts should be manually shortened if
the assembly-house review agrees they represent the physical current path.
Also confirm live stock or pre-order the exact `ESP32-P4NRW32X` before
submitting the assembly BOM.

Before ordering, also confirm the exact display header orientation, QFN104
exposed-pad process, USB-C mechanical fit, and the four-layer stackup. Request
90-ohm differential impedance control for the USB pair and have the fabricator
adjust the 0.18 mm nominal geometry for the selected stackup. The generated
files are not a substitute for assembly-house DFM review or first-article
electrical validation.

The `firmware/` directory is an implementation contract, not a compiled ESP-IDF
application.

## Build

```sh
bun install
bunx tsc --noEmit
npx tsci check netlist
npx tsci check schematic-placement
npx tsci check placement
npx tsci check shorts
npx tsci build --site --pcb-png --schematic-png --autorouter-timeout 8m
npx tsci export index.circuit.tsx --format gerbers --output outputs/fabrication/spi-display-webcam-interceptor-v1.0.0/gerbers.zip
bun run fabrication:csv
```
