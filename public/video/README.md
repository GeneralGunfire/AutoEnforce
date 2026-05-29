# Video Assets

Place the following files in this directory before building or running the app:

## Required

| File | Description |
|------|-------------|
| `hero-video.mp4` | Primary hero video — H.264, 1920x1080 recommended, no loop required |
| `hero-fallback.jpg` | Static fallback image shown if video fails to load — 1920x1080 JPEG |

## Optional but Recommended

| File | Description |
|------|-------------|
| `hero-video.webm` | WebM/VP9 version for better compression in Chromium browsers |
| `captions.vtt` | WebVTT captions file (a sample is already included) |

## Video Guidelines

- Keep `hero-video.mp4` under 10 MB for fast initial load (use HandBrake or ffmpeg to compress).
- Duration: 10–30 seconds works well. The brand text animates during the final 2 seconds.
- Avoid a looping clip — the video plays once, text fades in near the end, then holds.

## ffmpeg Quick Compress Example

```bash
# MP4 (H.264, CRF 28 = good quality/size balance)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -an hero-video.mp4

# WebM (VP9)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -an hero-video.webm
```
