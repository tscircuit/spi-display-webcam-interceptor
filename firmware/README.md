# ESP32-P4 firmware implementation notes

This directory defines the firmware contract; it is not a complete ESP-IDF
project or a compiled image. Start with an ESP-IDF version that supports the
ESP32-P4 USB High-Speed device stack and TinyUSB UVC.

## Fixed baseline

- Capture framebuffer: 320x240 RGB565, 153,600 bytes.
- Webcam format: uncompressed UVC YUY2, 320x240 at 30 fps.
- USB link: the dedicated USB 2.0 High-Speed OTG PHY pins.
- Frame policy: submit every 33.333 ms and repeat the newest completed image if
  the source has not changed.
- Buffer policy: keep two RGB565 framebuffers in the 32 MB in-package PSRAM;
  use internal DMA-capable memory for any buffers required by a peripheral that
  cannot access PSRAM directly.

YUY2 requires 4.608 MB/s before USB overhead. Validate endpoint scheduling and
DMA behavior on every supported host OS. MJPEG can be added later, but YUY2 is
the lower-complexity bring-up target.

## Capture path

Route a GP-SPI slave through the GPIO matrix using GPIO1 CS, GPIO5 SCK, GPIO4
MOSI, and GPIO7 MISO. Sample GPIO2 reset, GPIO3 DC, GPIO6 LED, and GPIO8 touch
IRQ. Queue multiple DMA receive transactions so CS gaps do not leave the slave
unarmed. Follow ESP-IDF's alignment and transaction-length restrictions for SPI
slave DMA and treat 60 MHz as an upper limit, not a board-level guarantee.

The parser should implement at least:

- `CASET` (0x2A) and `PASET` (0x2B) address windows
- `RAMWR` (0x2C) and continued pixel writes
- `MADCTL` (0x36) orientation and RGB/BGR order
- `COLMOD` (0x3A), with RGB565 as the guaranteed input mode
- hardware/software reset and CS-edge resynchronization

On overrun or malformed traffic, discard the transaction and resynchronize at
the next CS boundary. Never back-pressure the display bus; UVC may repeat the
last completed frame.

## USB and recovery

Use the ESP32-P4 High-Speed device stack on dedicated `USB_DM`/`USB_DP`. BOOT is
GPIO35 and RESET is `CHIP_PU`. For recovery, hold BOOT, tap RESET, then release
BOOT to enter ROM joint-download mode. This remains important because application
firmware reuses the only USB connector as a UVC device.

Advertise the 30 fps profile first and retain 15 fps as a bring-up fallback.
Verify that descriptors, maximum payload size, endpoint interval, cache
maintenance, and scanline conversion agree with `video_profiles.h`.

## Meaning of “30 fps”

The USB device can schedule 30 webcam frames per second; it cannot invent source
updates. A full 320x240 RGB565 rewrite at 30 Hz requires 36.864 Mbit/s of pixel
payload before SPI commands and gaps. Double buffering prevents a USB frame from
mixing two completed display frames, but throughput still depends on source SPI
timing and firmware keeping the receive queue armed.
