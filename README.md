# AutoEnforce ZA — Landing Page

A Next.js 14 landing page with a full-screen video hero section, Framer Motion animations, and Tailwind CSS styling.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Add your video

Drop the following files into `public/video/` (see `public/video/README.md` for full details):

- `hero-video.mp4` — required
- `hero-fallback.jpg` — required fallback image
- `hero-video.webm` — optional (better compression for Chrome)

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build (static export)

```bash
npm run build
```

The static output is written to the `out/` directory.

## Deploy to Vercel

1. Push to a GitHub/GitLab/Bitbucket repository.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no extra configuration needed.
4. For large video files, use Vercel Blob Storage or an external CDN and update the `src` paths in `Hero.tsx`.

## Project Structure

```
src/
  app/
    layout.tsx      Root layout with Inter font
    page.tsx        Home page (Hero + placeholder section)
    globals.css     Tailwind directives + custom utilities
  components/
    Hero.tsx        Full-screen hero with video bg + animations
public/
  video/
    captions.vtt    Sample WebVTT captions
    README.md       Video asset instructions
```

## Animation Behaviour

The brand name and subtext are invisible on load. Near the end of the video (< 2 seconds remaining):

1. "AutoEnforce ZA" fades in with a subtle scale (0.95 → 1) over 0.8 s.
2. 200 ms later, "Redefining Policing" fades in and slides up over 0.8 s.

Users with `prefers-reduced-motion` see the text immediately without animation.
