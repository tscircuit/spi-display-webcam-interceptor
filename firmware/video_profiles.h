#pragma once

#include <stdint.h>

typedef enum {
  VIDEO_FORMAT_YUY2,
} video_format_t;

typedef struct {
  video_format_t format;
  uint16_t width;
  uint16_t height;
  uint8_t frames_per_second;
  uint32_t frame_interval_100ns;
  uint32_t max_frame_bytes;
} video_profile_t;

static const video_profile_t k_video_profiles[] = {
    {VIDEO_FORMAT_YUY2, 320, 240, 30, 333333u, 320u * 240u * 2u},
    {VIDEO_FORMAT_YUY2, 320, 240, 15, 666666u, 320u * 240u * 2u},
};

#define VIDEO_PROFILE_COUNT \
  (sizeof(k_video_profiles) / sizeof(k_video_profiles[0]))

#define UVC_PRIMARY_FRAME_BYTES       (320u * 240u * 2u)
#define UVC_PRIMARY_BYTES_PER_SECOND  (UVC_PRIMARY_FRAME_BYTES * 30u)

_Static_assert(UVC_PRIMARY_FRAME_BYTES == 153600u,
               "320x240 YUY2 frame size changed unexpectedly");
_Static_assert(UVC_PRIMARY_BYTES_PER_SECOND == 4608000u,
               "30 fps bandwidth calculation changed unexpectedly");
