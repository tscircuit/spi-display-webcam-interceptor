# STM32 SPI display pass-through UVC capture board

This tscircuit reference design sits between a host and the common 14-pin,
2.54 mm SPI header used by many 2.4-inch ILI9341-style display modules. Every
header signal passes straight from `J_HOST` to `J_DISPLAY`. A 5 V-tolerant
SN74LVC244A observes the display bus without putting MCU pins directly on it.

The capture processor is an STM32F723VET6 (LQFP100). This exact part has an
integrated USB 2.0 high-speed PHY, so USB-C D+/D- connect through the USBLC6 ESD
device directly to PB15/PB14. No ULPI transceiver or external RAM is required
for the baseline 320x240/30 fps mode.

The capture side is powered from its single USB-C connector. Display-header VCC
is pass-through only and is deliberately isolated from USB VBUS and the local
3.3 V rail. The systems share ground.

The revised board outline is 62x46 mm. The STM32, its local power/clock parts,
and the USB HS ESD endpoint are grouped in an `MCU_BREAKOUT` `<breakout />` so
tscircuit can escape the LQFP100 locally before considering board-level nets.
The two 14-pin connectors use explicit vertical footprints so their courtyard
geometry is checked in its physical orientation.

## Header pinout

Both headers use the same pin numbering, from pin 1 at the square pad:

| Pin | Signal         | STM32 observation pin |
| --: | -------------- | --------------------- |
|   1 | VCC            | pass-through only     |
|   2 | GND            | common ground         |
|   3 | LCD_CS         | PA4 / SPI1_NSS        |
|   4 | LCD_RESET      | PC4                   |
|   5 | LCD_DC / RS    | PC5                   |
|   6 | LCD_SDI / MOSI | PA7 / SPI1_MOSI       |
|   7 | LCD_SCK        | PA5 / SPI1_SCK        |
|   8 | LCD_LED        | PC6                   |
|   9 | LCD_SDO / MISO | PA6 / SPI1_MISO       |
|  10 | TOUCH_CLK      | pass-through only     |
|  11 | TOUCH_CS       | pass-through only     |
|  12 | TOUCH_DIN      | pass-through only     |
|  13 | TOUCH_DO       | pass-through only     |
|  14 | TOUCH_IRQ      | PC7                   |

## 30 fps data path

1. SPI1 slave RX plus DMA records the display byte stream. GPIO state records
   CS, DC, reset, LED, and touch IRQ transitions.
2. An ILI9341 command parser tracks `CASET` (0x2A), `PASET` (0x2B), `RAMWR`
   (0x2C), `MADCTL` (0x36), and `COLMOD` (0x3A), updating a 320x240 RGB565
   framebuffer.
3. A USB Video Class device converts RGB565 to YUY2 one scanline at a time and
   sends an uncompressed 320x240 frame every 33.333 ms over USB high speed.

One RGB565 frame is 153,600 bytes. STM32F723 has 256 KiB SRAM, leaving roughly
108 KiB for DMA rings, two scanline buffers, USB packets, parser state, stacks,
and the heap. A second full framebuffer does not fit, but it is not needed to
maintain a fixed 30 fps USB cadence: the device sends the newest framebuffer
and repeats it if the source has not changed.

Uncompressed 320x240 YUY2 at 30 fps is 4.608 MB/s (36.864 Mbit/s) before USB
packet overhead, which is appropriate for USB 2.0 high speed and impossible to
guarantee over full-speed USB. MJPEG can be added later, but it is not required
and would make frame time depend on image complexity.

For the source itself to rewrite every pixel 30 times per second in RGB565, the
incoming SPI payload must also average 36.864 Mbit/s. Use a display host clock
of at least 40 MHz with nearly contiguous full-frame writes. Slower or partial
updates are still emitted by the webcam at 30 fps using the latest known image.

Because the baseline uses one framebuffer, a USB frame can contain a boundary
between two source updates. If atomic, tear-free source frames are a hard
requirement, add external SDRAM or select an STM32 with at least 512 KiB of
usable DMA-accessible SRAM for double buffering. More RAM is for atomicity, not
for USB bandwidth.

## USB and power details

- One USB-C port provides both capture-board power and the UVC connection.
- USB HS uses PB14 (DM) and PB15 (DP), routed through USBLC6-2SC6 protection.
  No external ULPI PHY is present. Final fabrication still requires the board
  house stackup to be used to tune the pair for 90-ohm differential impedance.
- VDDPHYHS is at 3.3 V; VDD12OTGHS and both VCAP pins each have 2.2 uF local
  capacitors; OTG_HS_REXT uses 3.00 kohm to ground.
- A 12 MHz HSE crystal is used because it is a supported HS-PHY PLL input.
- AP2112K generates the local 3.3 V rail from USB VBUS.
- Firmware must disable VBUS sensing for the HS device core because PB13 is not
  wired as a VBUS-sense input.
- SWD, BOOT0, and NRST are exposed for bring-up and recovery.

## Hardware included

- STM32F723VET6, 512 KiB internal flash, 256 KiB SRAM, integrated USB HS PHY
- 12 MHz HSE crystal and all required VDD, VDDA, VCAP, and USB-PHY passives
- SN74LVC244A bus observer
- USB-C USB 2.0 connector, CC resistors, and USBLC6-2SC6 ESD protection
- AP2112K 3.3 V LDO powered only from USB VBUS
- BOOT and RESET buttons, four-pin SWD header, and four mounting holes

## Status and manufacturing warning

The tscircuit source type-checks, its electrical netlist check reports zero
errors and zero warnings, and `tsci check placement` reports no placement issues
with zero placement DRC errors or warnings. `placementDrcChecksDisabled` is not
used. The placement check is the required gate before any routing attempt.

The enabled high-effort autorouter completes 51 connections inside
`MCU_BREAKOUT` and nine board-level signal connections with no jumpers or router
errors. The generated circuit contains 144 PCB traces and 99 vias, no generated
PCB error records, and no maximum-length warnings. The PCB bitmap shorts checker
reports no shorts on either the top or bottom signal layer. The all-layer Gerber
shorts mode in this tscircuit version cannot rasterize inner-layer copper pours;
inner1 is a single GND pour and inner2 is a single V3V3 pour.

The route is complete in tscircuit, but it is still a reference design rather
than automatically fabrication-qualified hardware. Before ordering, import the
generated KiCad project, select a real four-layer stackup, tune and length-match
the USB pair for 90-ohm differential impedance, and run the fabricator's
clearance, annular-ring, via-in-pad, connectivity, and power-integrity checks.
The 0.3/0.2 mm via-in-pad geometry may require filled/capped microvias or a
larger drill/land choice. Also confirm header orientation against the exact
display module because clone boards sometimes mirror the connector.

The webcam behavior also requires firmware. The `firmware/` directory defines
the hardware pin map, UVC profiles, memory plan, and implementation sequence;
it is not a compiled firmware image.

## Build

```sh
bun install
npx tsc --noEmit
npx tsci check netlist
npx tsci check placement
npx tsci build index.circuit.tsx
npx tsci check shorts dist/index/circuit.json --mode pcb --layer top
npx tsci check shorts dist/index/circuit.json --mode pcb --layer bottom
npx tsci snapshot index.circuit.tsx --pcb-only --update
```
