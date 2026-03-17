import { motion } from 'framer-motion'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import CurriculumFlow from '../components/CurriculumFlow'
import Gallery from '../components/Gallery'
import { instructor, instructor2 } from '../data/content'

const inView = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function Home() {
  return (
    <div style={{ background: '#0A0A0A' }}>
      <Header />

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════════════
          CURRICULUM
      ═══════════════════════════════════════════════ */}
      <section id="curriculum" className="section-light" style={{ borderRadius: '60px 60px 0 0', position: 'relative', zIndex: 10, marginTop: '-100vh' }}>
        <div className="container" style={{ maxWidth: 'none' }}>
          <CurriculumFlow />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          INSTRUCTOR
      ═══════════════════════════════════════════════ */}
      <section id="instructor" style={{ background: '#000000', padding: '200px 0 220px' }}>
        <div className="container">
          <motion.div
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{ marginBottom: '72px' }}
          >
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif", marginBottom: '20px' }}>
              Instructors
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#ffffff', margin: 0, fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
              강사 소개
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[instructor, instructor2].map((person, idx) => (
              <motion.div
                key={person.name}
                variants={fadeUp(idx * 0.12)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', background: '#111111' }}
              >
                <img
                  src={person.photo}
                  alt={person.name}
                  style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '32px 36px 36px' }}>
                  <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1, margin: 0 }}>
                    {person.name}
                  </h3>
                  <p style={{ marginTop: '20px', fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                    {person.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WORKS
      ═══════════════════════════════════════════════ */}
      <section id="works" style={{ background: '#000000', padding: '200px 0 220px' }}>
        <div className="container">

          {/* 섹션 헤더 */}
          <motion.div
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{ marginBottom: '72px' }}
          >
            <p style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '20px',
            }}>
              Student Works
            </p>
            <h2 style={{
              fontFamily: "'Inter', 'Pretendard', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              margin: 0,
            }}>
              Portfolio
            </h2>
            <p style={{
              marginTop: '20px',
              fontSize: 'clamp(13px, 1.2vw, 15px)',
              fontWeight: 400,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.35)',
              fontFamily: "'Pretendard', sans-serif",
            }}>
              수강생들이 직접 만든 포트폴리오 작업물입니다
            </p>
          </motion.div>

          {/* 갤러리 */}
          <Gallery />

        </div>
      </section>

      <Footer />
    </div>
  )
}
