# STM32F723 firmware implementation notes

This folder defines the firmware contract; it is not a complete STM32Cube
project or a compiled image. Start from STM32CubeF7 with the USB OTG HS device
core configured for the embedded HS PHY and a UVC device class.

## Fixed operating mode

- Capture framebuffer: 320x240 RGB565, 153,600 bytes.
- Primary webcam format: uncompressed UVC YUY2, 320x240, exactly 30 fps.
- USB link: USB 2.0 high speed through the embedded PHY on PB14/PB15.
- Frame policy: submit one frame every 33.333 ms; repeat the latest image when
  no source update occurred.
- Conversion policy: convert RGB565 to YUY2 scanlines just before USB packet
  submission. Do not allocate a second full-sized YUY2 frame.

YUY2 at this resolution and rate is 4.608 MB/s. Use an isochronous HS endpoint
configuration with sufficient transactions per microframe, or use HS bulk UVC
if the selected host stack supports it reliably. The endpoint schedule and DMA
buffers must be validated on every supported host OS.

## Capture path

Configure SPI1 as a slave receiver using PA4/PA5/PA7 for NSS/SCK/MOSI. Use DMA
into a power-of-two ring and timestamp/control-sample PC4, PC5, PC6, and PC7.
Keep the DMA ISR limited to publishing completed spans; parse outside the ISR.

The parser should implement at least:

- `CASET` (0x2A) and `PASET` (0x2B) address windows
- `RAMWR` (0x2C) and continued pixel writes
- `MADCTL` (0x36) orientation and RGB/BGR order
- `COLMOD` (0x3A), with RGB565 as the guaranteed input mode
- hardware/software reset and CS-edge resynchronization

If an overrun or malformed transaction occurs, discard the current transaction
and resynchronize on the next CS boundary. Never stall SPI DMA while USB is
late; UVC may repeat a frame, but capture must retain bus synchronization.

## Memory budget

| Region | Suggested bytes |
| --- | ---: |
| RGB565 framebuffer | 153,600 |
| SPI DMA ring | 16,384 |
| two YUY2 scanlines | 1,280 |
| USB HS packet buffers | 12,288 |
| dirty-tile/state tables | 4,096 |
| stacks, heap, HAL and descriptors | about 74,000 remaining |

Place the framebuffer and USB/SPI DMA buffers in DMA-accessible SRAM, aligned
to 32-byte cache lines. Do not place DMA buffers in DTCM. Clean/invalidate the
Cortex-M7 data cache at ownership transitions, or mark the DMA region
non-cacheable with the MPU.

## Clock and USB bring-up

- HSE is 12 MHz. Configure the main PLL for the selected CPU/APB clocks and the
  embedded HS PHY PLL for its supported 12 MHz reference.
- Select the USB OTG HS core with `USE_EMBEDDED_PHY`.
- Set `vbus_sensing_enable = DISABLE`; this board does not route PB13 VBUS sense.
- Advertise only modes the endpoint schedule can reserve. Keep the 30 fps YUY2
  profile first and include 15 fps as a debugging fallback.
- Assert at build time that the scanline converter and UVC interval agree with
  `video_profiles.h`.

## What “guaranteed 30 fps” means

The USB device schedules and delivers 30 webcam frames per second. It cannot
invent source updates that were never sent. A complete RGB565 source frame at
30 Hz requires 36.864 Mbit/s of SPI payload, so a nominal 40 MHz SPI clock has
only modest command/idle margin. Partial updates are much easier. With the
single framebuffer, the picture can tear across a simultaneous source update;
double buffering needs another 153,600 bytes of DMA-accessible RAM.
