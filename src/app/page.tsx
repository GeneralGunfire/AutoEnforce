import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'
import HeroContent       from '@/components/sections/HeroContent'
import SceneRoom         from '@/components/scenes/SceneRoom'
import SceneSplit        from '@/components/scenes/SceneSplit'
import SceneMarquee      from '@/components/scenes/SceneMarquee'
import SceneClosing      from '@/components/scenes/SceneClosing'
import BottomNav         from '@/components/BottomNav'
import ScrollProgress    from '@/components/ScrollProgress'

// Hosted video — works on Vercel (no file size limit issues)
// Pexels free license, top-down highway aerial footage
// Using HD (720p) instead of UHD — dramatically reduces bandwidth & decode load on mobile
const HERO_VIDEO = 'https://videos.pexels.com/video-files/14114362/14114362-hd_1920_2560_25fps.mp4'
const HERO_POSTER = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=75'

export default function Home() {
  return (
    <main style={{ background: '#080808' }}>
      <ScrollProgress />

      {/* ── 1. Hero: scroll-expand aerial highway video ── */}
      <ScrollExpandMedia
        mediaType='video'
        mediaSrc={HERO_VIDEO}
        posterSrc={HERO_POSTER}
        bgImageSrc={HERO_POSTER}
        title='AutoEnforce ZA'
        scrollToExpand='Scroll to expand'
        accentColor='rgba(232,224,208,0.9)'
      >
        <HeroContent />
      </ScrollExpandMedia>

      {/* ── 2. Coverage: floating 3D panels of camera feeds ── */}
      <SceneRoom />

      {/* ── 3. Features: 3 alternating split rows with depth ── */}
      <SceneSplit />

      {/* ── 4. Process: 4-step cards ── */}
      <SceneMarquee />

      {/* ── 5. Closing CTA ── */}
      <SceneClosing />

      <BottomNav />
    </main>
  )
}
