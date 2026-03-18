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
  const [compMeta, setCompMeta] = useState(aboutCourse.comparison)
  const [compRows, setCompRows] = useState(aboutCourse.comparison.rows)

  useEffect(() => {
    if (!isSupabaseReady) return

    supabase.from('page_views').insert({})

    supabase.from('instructors').select('*').order('slot', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0)
          setInstructors(data.map((d) => ({ name: d.name, title: d.title, photo: d.photo })))
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
      <section ref={aboutRef} id="about" style={{ background: '#000000', position: 'relative', zIndex: 2, padding: 'clamp(80px, 14vw, 160px) 0 clamp(80px, 12vw, 160px)', overflowX: 'hidden' }}>
        {/* 배경 포인트 */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          {/* 레이블 + 타이틀 */}
          <motion.p variants={fadeUp(0)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
            style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif", marginBottom: '20px' }}>
            {aboutCourse.label}
          </motion.p>
          <motion.h2 variants={fadeUp(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
            style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#ffffff', margin: '0 0 clamp(32px, 5vw, 64px)' }}>
            학과소개
          </motion.h2>

          {/* ── 에디토리얼 카드 목록 ── */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {aboutSections.map((card, idx) => {
              const accent = idx === 0 ? '#60a5fa' : '#a78bfa'
              const accentBg = idx === 0 ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.1)'
              const accentBorder = idx === 0 ? 'rgba(96,165,250,0.25)' : 'rgba(167,139,250,0.25)'
              const tagLabel = card.tag.split(' — ')[1] ?? card.tag
              return (
                <motion.div
                  key={card.tag}
                  variants={fadeUp(idx * 0.12)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0 }}
                  style={{ padding: 'clamp(36px, 5vw, 64px) 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* 번호 + 태그 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'clamp(20px, 3vw, 36px)' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>0{idx + 1}</span>
                    <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, background: accentBg, border: `1px solid ${accentBorder}`, padding: '4px 10px', borderRadius: '100px', fontFamily: "'Inter', sans-serif" }}>{tagLabel}</span>
                  </div>
                  {/* 제목 + 본문 2컬럼 */}
                  <div className="about-editorial-row">
                    <h3 style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(1.6rem, 3.6vw, 2.2rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.05em', color: '#ffffff', margin: 0, wordBreak: 'keep-all' }}>
                      {card.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {card.body.split('\n\n').map((para, i) => (
                        <p key={i} style={{ fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 400, lineHeight: 1.9, color: 'rgba(255,255,255,0.72)', margin: 0, wordBreak: 'keep-all', overflowWrap: 'break-word', fontFamily: "'Pretendard', sans-serif" }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── 비교 섹션 ── */}
          <motion.div
            variants={fadeUp(0.24)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            style={{ paddingTop: 'clamp(36px, 5vw, 64px)' }}
          >
            {/* 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: 'clamp(24px, 3.5vw, 40px)' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>03</span>
              <div style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.12)' }} />
              <h3 style={{ fontFamily: "'Inter', 'Pretendard', sans-serif", fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff', margin: 0 }}>{compMeta.title}</h3>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Pretendard', sans-serif" }}>{compMeta.subtitle}</span>
            </div>

            {/* 두 패널 */}
            <div className="about-comp-panels">
              {/* 웹디자인 */}
              <div style={{ background: 'rgba(45,63,231,0.07)', border: '1px solid rgba(96,165,250,0.18)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', background: 'rgba(45,63,231,0.15)', borderBottom: '1px solid rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>웹디자인</span>
                </div>
                {compRows.map((row, i) => (
                  <div key={i} style={{ padding: '14px 24px', borderBottom: i < compRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: '4px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>{row.aspect}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, wordBreak: 'keep-all', fontFamily: "'Pretendard', sans-serif" }}>{row.web}</span>
                  </div>
                ))}
              </div>
              {/* 편집디자인 */}
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>편집디자인</span>
                </div>
                {compRows.map((row, i) => (
                  <div key={i} style={{ padding: '14px 24px', borderBottom: i < compRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: '4px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>{row.aspect}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, wordBreak: 'keep-all', fontFamily: "'Pretendard', sans-serif" }}>{row.print}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* about 핀 후 curriculum까지 텀 — 유리 효과용 컬러 오브 */}
      <div style={{ height: '40vh', background: '#000000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: 'clamp(200px,40vw,500px)', height: 'clamp(200px,40vw,500px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,63,231,0.55) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '0%', right: '10%', width: 'clamp(160px,30vw,380px)', height: 'clamp(160px,30vw,380px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '40%', width: 'clamp(120px,20vw,280px)', height: 'clamp(120px,20vw,280px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      </div>

      {/* ═══════════════════════════════════════════════
          CURRICULUM
      ═══════════════════════════════════════════════ */}
      <section
        id="curriculum"
        style={{
          background: 'linear-gradient(180deg, #010d1f 0%, #051a3a 30%, #041a2e 60%, #020e18 80%, #000000 100%)',
          borderRadius: 'clamp(20px, 5vw, 60px) clamp(20px, 5vw, 60px) 0 0',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 10,
          padding: 'clamp(80px, 14vw, 120px) 0',
          border: '1px solid rgba(255,255,255,0.18)',
          borderBottom: 'none',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.12)',
        }}
      >
        {/* 배경 컬러 오브 */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {/* 로열 블루 — 좌상 */}
          <div style={{ position: 'absolute', top: '5%', left: '5%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,91,224,0.85) 0%, rgba(43,91,224,0.35) 40%, transparent 70%)', filter: 'blur(20px)' }} />
          {/* 스카이 블루 — 우상 */}
          <div style={{ position: 'absolute', top: '8%', right: '5%', width: '48vw', height: '48vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(90,170,216,0.8) 0%, rgba(90,170,216,0.25) 40%, transparent 70%)', filter: 'blur(20px)' }} />
          {/* 틸/시안 — 우하 */}
          <div style={{ position: 'absolute', bottom: '30%', right: '5%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,192,0.85) 0%, rgba(0,200,192,0.3) 40%, transparent 70%)', filter: 'blur(40px)' }} />
          {/* 올리브 그린 — 좌하 */}
          <div style={{ position: 'absolute', bottom: '28%', left: '5%', width: '44vw', height: '44vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(136,200,64,0.8) 0%, rgba(136,200,64,0.25) 40%, transparent 70%)', filter: 'blur(40px)' }} />
          {/* 라이트 시안 — 중앙 */}
          <div style={{ position: 'absolute', top: '35%', left: '30%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,210,0.6) 0%, transparent 65%)', filter: 'blur(30px)' }} />
          {/* 상단 반사선 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 70%, transparent 100%)' }} />
        </div>
        <div className="container" style={{ maxWidth: 'none' }}>
          <CurriculumFlow />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          INSTRUCTOR
      ═══════════════════════════════════════════════ */}
      <section id="instructor" style={{ background: '#000000', padding: 'clamp(80px, 14vw, 120px) 0', position: 'relative', overflow: 'hidden' }}>
        {/* 배경 — 파티클 네트워크 */}
        <InstructorCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{ marginBottom: 'clamp(40px, 6vw, 72px)' }}
          >
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif", marginBottom: '16px' }}>
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
                style={{
                  position: 'relative', borderRadius: '28px', overflow: 'hidden',
                  background: idx === 0
                    ? 'linear-gradient(160deg, #1a0545 0%, #0d1a4f 60%, #0a0a1a 100%)'
                    : 'linear-gradient(160deg, #0a1a3f 0%, #1a053a 60%, #0a0a1a 100%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                {/* 카드 내부 컬러 오브 */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                  <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '70%', height: '70%', borderRadius: '50%', background: idx === 0 ? 'radial-gradient(circle, rgba(147,51,234,0.55) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(79,70,229,0.55) 0%, transparent 65%)', filter: 'blur(20px)' }} />
                  <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: idx === 0 ? 'radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(219,39,119,0.35) 0%, transparent 65%)', filter: 'blur(20px)' }} />
                </div>

                <img
                  src={person.photo}
                  alt={person.name}
                  style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 1 }}
                />

                {/* 이름/직함 영역 — 유리 패널 */}
                <div style={{
                  position: 'relative', zIndex: 1,
                  padding: 'clamp(24px, 3vw, 36px)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1, margin: 0 }}>
                    {person.name}
                  </h3>
                  <p style={{ marginTop: '10px', fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
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
      <section id="works" style={{ background: '#000000', paddingBottom: 'clamp(140px, 20vw, 320px)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ paddingTop: 'clamp(80px, 14vw, 200px)', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
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

/* ── 강사소개 파티클 네트워크 ── */
function InstructorCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w = 0, h = 0

    const COLORS = ['147,51,234', '79,70,229', '219,39,119', '124,58,237', '109,40,217']

    const isMobile = () => window.innerWidth < 768
    const COUNT    = () => isMobile() ? 30 : 60
    const MAX_DIST = () => isMobile() ? 110 : 160

    // ResizeObserver로 실제 레이아웃 크기 정확히 감지
    const setSize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width || canvas.parentElement?.offsetWidth || window.innerWidth
      h = rect.height || canvas.parentElement?.offsetHeight || 600
      canvas.width  = w
      canvas.height = h
    }

    let pts = []
    const initPts = () => {
      pts = Array.from({ length: COUNT() }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 2.2 + 0.6,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.4 + 0.6,
      }))
    }

    setSize()
    initPts()

    const ro = new ResizeObserver(() => {
      const prevW = w
      setSize()
      // 크기가 크게 바뀌면 전체 재초기화, 아니면 범위 밖 파티클만 재배치
      if (Math.abs(w - prevW) > 100) {
        initPts()
      } else {
        pts.forEach(p => {
          if (p.x > w) p.x = Math.random() * w
          if (p.y > h) p.y = Math.random() * h
        })
      }
    })
    ro.observe(canvas.parentElement || canvas)

    // 마우스/터치 좌표
    const mouse = { x: -9999, y: -9999 }
    const getPos = e => {
      const rect = canvas.getBoundingClientRect()
      const src = e.touches ? e.touches[0] : e
      mouse.x = src.clientX - rect.left
      mouse.y = src.clientY - rect.top
    }
    const clearMouse = () => { mouse.x = -9999; mouse.y = -9999 }
    canvas.addEventListener('mousemove', getPos)
    canvas.addEventListener('mouseleave', clearMouse)
    canvas.addEventListener('touchmove', getPos, { passive: true })
    canvas.addEventListener('touchend', clearMouse)

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      const md = MAX_DIST()

      pts.forEach(p => {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < 110 && d > 0) {
          const force = (110 - d) / 110
          p.vx += (dx / d) * force * 0.6
          p.vy += (dy / d) * force * 0.6
        }

        p.vx *= 0.97
        p.vy *= 0.97
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 1.8) { p.vx = (p.vx / spd) * 1.8; p.vy = (p.vy / spd) * 1.8 }

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.shadowBlur = 18
        ctx.shadowColor = `rgba(${p.c},1)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},${p.alpha})`
        ctx.fill()
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx   = pts[i].x - pts[j].x
          const dy   = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < md) {
            const alpha = (1 - dist / md) * 0.45
            const grad  = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y)
            grad.addColorStop(0, `rgba(${pts[i].c},${alpha})`)
            grad.addColorStop(1, `rgba(${pts[j].c},${alpha})`)
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1.0
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('mousemove', getPos)
      canvas.removeEventListener('mouseleave', clearMouse)
      canvas.removeEventListener('touchmove', getPos)
      canvas.removeEventListener('touchend', clearMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
    />
  )
}

