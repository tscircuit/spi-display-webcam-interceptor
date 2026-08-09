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
rails. The board is 68 x 54 mm and uses four copper layers: top/bottom signals,
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
router errors or jumpers. The generated circuit JSON contains no PCB error or
warning records, and `tsci check shorts` reports no Gerber shorts. The aggregate
checker still emits advisory metadata, unnamed-trace, and supplier-footprint
similarity warnings; the focused manufacturing checks pass.

The fabrication generator adds separate L1-L2, L1-L3, and L2-L4 blind-via drill
files to the Gerber archive in addition to the normal L1-L4 PTH and NPTH drill
files. Do not merge these span files. The selected fabricator must support the
specified blind-via stack and should run its own CAM connectivity and clearance
checks.

Before ordering, confirm the exact display header orientation, QFN104 exposed-
pad process, 0.20/0.30 mm via capability, USB-C mechanical fit, and a real
four-layer stackup. Tune the USB pair to 90-ohm differential impedance using
that stackup. The generated files are a routed reference design, not a substitute
for assembly-house DFM review or first-article electrical validation.

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
bun run fabrication:drills
```
