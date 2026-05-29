import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero'
import HeroContent       from '@/components/sections/HeroContent'
import SceneRoom         from '@/components/scenes/SceneRoom'
import SceneSplit        from '@/components/scenes/SceneSplit'
import SceneMarquee      from '@/components/scenes/SceneMarquee'
import SceneClosing      from '@/components/scenes/SceneClosing'
import BottomNav         from '@/components/BottomNav'
import ScrollProgress    from '@/components/ScrollProgress'

export default function Home() {
  return (
    <main style={{ background: '#080808' }}>
      <ScrollProgress />

      {/* ── Hero: scroll-expand video (keep as-is) ── */}
      <ScrollExpandMedia
        mediaType='video'
        mediaSrc='/video/clip1.mp4'
        bgImageSrc='https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80'
        title='AutoEnforce ZA'
        scrollToExpand='Scroll to expand'
        accentColor='rgba(232,224,208,0.9)'
      >
        <HeroContent />
      </ScrollExpandMedia>

      {/* ── Scene 1: 3D room — panels floating in perspective ── */}
      <SceneRoom />

      {/* ── Scene 2: Split feature rows — left/right alternating ── */}
      <SceneSplit />

      {/* ── Scene 3: Process steps ── */}
      <SceneMarquee />

      {/* ── Scene 5: Closing CTA ── */}
      <SceneClosing />

      <BottomNav />
    </main>
  )
}
