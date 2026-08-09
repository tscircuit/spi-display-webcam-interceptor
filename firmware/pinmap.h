#pragma once

#include "driver/gpio.h"

#define CAPTURE_LCD_CS_GPIO       GPIO_NUM_1
#define CAPTURE_LCD_RESET_GPIO    GPIO_NUM_2
#define CAPTURE_LCD_DC_GPIO       GPIO_NUM_3
#define CAPTURE_LCD_MOSI_GPIO     GPIO_NUM_4
#define CAPTURE_LCD_SCK_GPIO      GPIO_NUM_5
#define CAPTURE_LCD_LED_GPIO      GPIO_NUM_6
#define CAPTURE_LCD_MISO_GPIO     GPIO_NUM_7
#define CAPTURE_TOUCH_IRQ_GPIO    GPIO_NUM_8

#define CAPTURE_BOOT_GPIO         GPIO_NUM_35

/* USB High Speed uses the ESP32-P4's dedicated USB_DM/USB_DP package pins. */

#define DISPLAY_WIDTH                 320u
#define DISPLAY_HEIGHT                240u
#define DISPLAY_RGB565_BYTES          (DISPLAY_WIDTH * DISPLAY_HEIGHT * 2u)
#define UVC_FRAME_RATE_HZ              30u
#define UVC_FRAME_PERIOD_100NS         333333u
