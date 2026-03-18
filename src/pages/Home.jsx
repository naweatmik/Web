import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import CurriculumFlow from '../components/CurriculumFlow'
import Gallery from '../components/Gallery'
import { instructor as defaultInstructor, instructor2 as defaultInstructor2, aboutCourse } from '../data/content'
import { supabase, isSupabaseReady } from '../lib/supabase'

const inView = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] } },
})

export default function Home() {
  const aboutRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: 'bottom bottom', // about 하단이 화면 하단에 닿는 순간 (다 읽은 후)
        end: 'bottom top',      // about 하단이 화면 상단에 닿을 때까지
        pin: true,
        pinSpacing: false,      // curriculum 위치 그대로 유지
      })
    })
    return () => ctx.revert()
  }, [])

  const [instructors, setInstructors] = useState([defaultInstructor, defaultInstructor2])
  const [aboutSections, setAboutSections] = useState(aboutCourse.cards)
  const [compMeta, setCompMeta] = useState({ tag: aboutCourse.comparison.tag, title: aboutCourse.comparison.title, subtitle: aboutCourse.comparison.subtitle, webColor: '#2D3FE7', printColor: '#6b7280' })
  const [compRows, setCompRows] = useState(aboutCourse.comparison.rows)

  useEffect(() => {
    if (!isSupabaseReady) return

    // 방문 기록
    supabase.from('page_views').insert({})

    supabase
      .from('instructors')
      .select('*')
      .order('slot', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setInstructors(data.map((d) => ({ name: d.name, title: d.title, photo: d.photo })))
        }
      })

    supabase.from('site_content').select('value').eq('key', 'about_sections').single()
      .then(({ data }) => { if (data?.value) setAboutSections(data.value) })

    supabase.from('site_content').select('value').eq('key', 'about_comparison').single()
      .then(({ data }) => {
        if (data?.value) {
          setCompMeta(data.value.meta)
          setCompRows(data.value.rows)
        }
      })
  }, [])

  return (
    <div style={{ background: '#000000', position: 'relative' }}>
      <Header />

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════════ */}
      <section ref={aboutRef} id="about" style={{ background: '#000000', position: 'relative', zIndex: 2, padding: 'clamp(80px, 14vw, 160px) 0 clamp(80px, 12vw, 160px)' }}>
        <div className="container">

          {/* 레이블 + 타이틀 */}
          <motion.p variants={fadeUp(0)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
            style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif", marginBottom: '20px' }}>
            {aboutCourse.label}
          </motion.p>
          <motion.h2 variants={fadeUp(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
            style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#ffffff', margin: '0 0 clamp(32px, 5vw, 64px)' }}>
            학과소개
          </motion.h2>

          {/* 벤토 그리드 */}
          <div className="about-bento">

            {/* 카드 — 학과소개 섹션 */}
            {aboutSections.map((card, idx) => (
              <motion.div
                key={card.tag}
                variants={fadeUp(idx * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0 }}
                style={{
                  background: card.gradient ?? aboutCourse.cards[idx]?.gradient ?? '#141414',
                  borderRadius: '20px',
                  padding: 'clamp(28px, 3vw, 40px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  minHeight: '280px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* 광택 하이라이트 */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)', pointerEvents: 'none' }} />
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif", margin: 0, position: 'relative' }}>
                  {card.tag}
                </p>
                <h3 style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.03em', color: '#ffffff', margin: 0, position: 'relative' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 400, lineHeight: 1.85, color: 'rgba(255,255,255,0.75)', fontFamily: "'Pretendard', sans-serif", margin: 0, marginTop: 'auto', position: 'relative' }}>
                  {card.body}
                </p>
              </motion.div>
            ))}

            {/* 비교 표 카드 — 전폭 */}
            <motion.div
              variants={fadeUp(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0 }}
              className="about-bento-full"
              style={{ background: '#0f172a', borderRadius: '20px', padding: 'clamp(28px, 3vw, 48px)' }}
            >
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif", marginBottom: '16px' }}>
                {compMeta.tag}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#ffffff', margin: 0 }}>
                  {compMeta.title}
                </h3>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontFamily: "'Pretendard', sans-serif" }}>
                  {compMeta.subtitle}
                </span>
              </div>

              {/* 테이블 */}
              <div style={{ marginTop: '32px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Pretendard', 'Inter', sans-serif" }}>
                  <thead>
                    <tr>
                      <th style={{ width: '22%', padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>구분</th>
                      <th style={{ width: '39%', padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#60a5fa', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>웹디자인</th>
                      <th style={{ width: '39%', padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>편집디자인</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compRows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{row.aspect}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{row.web}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{row.print}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* about 핀 후 curriculum까지 텀 */}
      <div style={{ height: '40vh', background: '#000000' }} />

      {/* ═══════════════════════════════════════════════
          CURRICULUM
      ═══════════════════════════════════════════════ */}
      <section
        id="curriculum"
        className="section-light"
        style={{
          borderRadius: 'clamp(20px, 5vw, 60px) clamp(20px, 5vw, 60px) 0 0',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="container" style={{ maxWidth: 'none' }}>
          <CurriculumFlow />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          INSTRUCTOR
      ═══════════════════════════════════════════════ */}
      <section id="instructor" style={{ background: '#000000', padding: 'clamp(80px, 14vw, 200px) 0 clamp(80px, 14vw, 220px)' }}>
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
          <div className="instructor-cards-grid">
            {instructors.map((person, idx) => (
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
                  <p style={{ marginTop: '12px', fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
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
      <section id="works" style={{ background: '#000000', paddingBottom: 'clamp(140px, 20vw, 320px)' }}>
        <div className="container" style={{ paddingTop: 'clamp(80px, 14vw, 200px)', paddingBottom: '80px' }}>
          <motion.div
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif", marginBottom: '20px' }}>
              Student Works
            </p>
            <h2 style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#ffffff', margin: 0 }}>
              Portfolio
            </h2>
            <p style={{ marginTop: '20px', fontSize: 'clamp(13px, 1.2vw, 15px)', fontWeight: 400, lineHeight: 1.8, color: 'rgba(255,255,255,0.35)', fontFamily: "'Pretendard', sans-serif" }}>
              수강생들이 직접 만든 포트폴리오 작업물입니다
            </p>
          </motion.div>
        </div>
        <Gallery />
      </section>

      <Footer />
    </div>
  )
}
