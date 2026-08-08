#pragma once

#include "stm32f7xx_hal.h"

#define CAPTURE_LCD_CS_GPIO_Port      GPIOA
#define CAPTURE_LCD_CS_Pin            GPIO_PIN_4
#define CAPTURE_LCD_SCK_GPIO_Port     GPIOA
#define CAPTURE_LCD_SCK_Pin           GPIO_PIN_5
#define CAPTURE_LCD_MISO_GPIO_Port    GPIOA
#define CAPTURE_LCD_MISO_Pin          GPIO_PIN_6
#define CAPTURE_LCD_MOSI_GPIO_Port    GPIOA
#define CAPTURE_LCD_MOSI_Pin          GPIO_PIN_7

#define CAPTURE_LCD_RESET_GPIO_Port   GPIOC
#define CAPTURE_LCD_RESET_Pin         GPIO_PIN_4
#define CAPTURE_LCD_DC_GPIO_Port      GPIOC
#define CAPTURE_LCD_DC_Pin            GPIO_PIN_5
#define CAPTURE_LCD_LED_GPIO_Port     GPIOC
#define CAPTURE_LCD_LED_Pin           GPIO_PIN_6
#define CAPTURE_TOUCH_IRQ_GPIO_Port   GPIOC
#define CAPTURE_TOUCH_IRQ_Pin         GPIO_PIN_7

#define USB_HS_DM_GPIO_Port           GPIOB
#define USB_HS_DM_Pin                 GPIO_PIN_14
#define USB_HS_DP_GPIO_Port           GPIOB
#define USB_HS_DP_Pin                 GPIO_PIN_15

#define DISPLAY_WIDTH                 320u
#define DISPLAY_HEIGHT                240u
#define DISPLAY_RGB565_BYTES          (DISPLAY_WIDTH * DISPLAY_HEIGHT * 2u)
#define UVC_FRAME_RATE_HZ              30u
#define UVC_FRAME_PERIOD_100NS         333333u
