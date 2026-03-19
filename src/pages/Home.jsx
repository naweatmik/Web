import './Home.css'
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
import InstructorModel, { MALE_URL, FEMALE_URL } from '../components/InstructorModel'

// GLB 파일 교체: public 폴더에 파일 넣고 아래 경로 수정
// const MALE_URL   = '/models/instructor_male.glb'
// const FEMALE_URL = '/models/instructor_female.glb'
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
    ScrollTrigger.config({ ignoreMobileResize: true })
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: 'bottom bottom',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })
    })
    return () => ctx.revert()
  }, [])

  const [instructors, setInstructors] = useState([defaultInstructor, defaultInstructor2])
  const [aboutSections, setAboutSections] = useState(aboutCourse.cards)
  const compMeta = aboutCourse.comparison
  const compRows = aboutCourse.comparison.rows

  useEffect(() => {
    if (!isSupabaseReady) return

    supabase.from('page_views').insert({})

    supabase.from('instructors').select('*').order('slot', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0)
          setInstructors(data.map((d) => ({ name: d.name, title: d.title, photo: d.photo })))
      })

    supabase.from('site_content').select('value').eq('key', 'about_sections').maybeSingle()
      .then(({ data }) => { if (data?.value) setAboutSections(data.value) })

  }, [])

  return (
    <div className="pageBg">
      <Header />

      {/* HERO */}
      <Hero />

      {/* ABOUT */}
      <section ref={aboutRef} id="about" className="aboutSection">
        <div className="aboutBg">
          <div className="aboutOrbRight" />
          <div className="aboutOrbLeft" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.p
            variants={fadeUp(0)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
            className="aboutLabel"
          >
            {aboutCourse.label}
          </motion.p>
          <motion.h2
            variants={fadeUp(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
            className="aboutH2"
          >
            학과소개
          </motion.h2>

          {/* 에디토리얼 카드 목록 */}
          <div className="aboutDivider">
            {aboutSections.map((card, idx) => {
              const accent       = idx === 0 ? '#60a5fa' : '#a78bfa'
              const accentBg     = idx === 0 ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.1)'
              const accentBorder = idx === 0 ? 'rgba(96,165,250,0.25)' : 'rgba(167,139,250,0.25)'
              const tagLabel     = card.tag.split(' — ')[1] ?? card.tag
              return (
                <motion.div
                  key={card.tag}
                  variants={fadeUp(idx * 0.12)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0 }}
                  className="aboutCard"
                >
                  {/* 번호 + 태그 */}
                  <div className="aboutCardMeta">
                    <span className="aboutCardNum">0{idx + 1}</span>
                    <div className="aboutCardDividerLine" />
                    <span
                      className="aboutCardTag"
                      style={{ color: accent, background: accentBg, border: `1px solid ${accentBorder}` }}
                    >
                      {tagLabel}
                    </span>
                  </div>

                  {/* 제목 + 본문 2컬럼 */}
                  <div className="aboutEditorialRow">
                    <h3 className="aboutCardTitle">{card.title}</h3>
                    <div className="aboutCardBody">
                      {card.body.split('\n\n').map((para, i) => (
                        <p key={i} className="aboutCardP">{para}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* 비교 섹션 */}
          <motion.div
            variants={fadeUp(0.24)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            className="aboutComp"
          >
            <div className="aboutCompHeader">
              <span className="aboutCompNum">03</span>
              <div className="aboutCardDividerLine" />
              <h3 className="aboutCompH3">{compMeta.title}</h3>
              <span className="aboutCompSubtitle">{compMeta.subtitle}</span>
            </div>

            <div className="aboutCompPanels">
              {/* 웹디자인 패널 */}
              <div className="compPanel compPanelWeb">
                <div className="compPanelHeader">
                  <span className="compPanelDot" />
                  <span className="compPanelLabel">웹디자인</span>
                </div>
                {compRows.map((row, i) => (
                  <div
                    key={i}
                    className="compPanelRow"
                    style={{ borderBottom: i < compRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  >
                    <span className="compPanelAspect">{row.aspect}</span>
                    <span className="compPanelValue">{row.web}</span>
                  </div>
                ))}
              </div>

              {/* 편집디자인 패널 */}
              <div className="compPanel compPanelPrint">
                <div className="compPanelHeader">
                  <span className="compPanelDot" />
                  <span className="compPanelLabel">편집디자인</span>
                </div>
                {compRows.map((row, i) => (
                  <div
                    key={i}
                    className="compPanelRow"
                    style={{ borderBottom: i < compRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  >
                    <span className="compPanelAspect">{row.aspect}</span>
                    <span className="compPanelValue">{row.print}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 컬러 오브 구분선 */}
      <div className="orbDivider">
        <div className="orbDivider1" />
        <div className="orbDivider2" />
        <div className="orbDivider3" />
      </div>

      {/* CURRICULUM */}
      <section id="curriculum" className="curriculumSection">
        <div className="curriculumSectionBg">
          <div className="csOrb1" />
          <div className="csOrb2" />
          <div className="csOrb3" />
          <div className="csOrb4" />
          <div className="csOrb5" />
          <div className="csTopLine" />
        </div>
        <div className="container" style={{ maxWidth: '1600px' }}>
          <CurriculumFlow />
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section id="instructor" className="instructorSection">
        <InstructorCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="instructorHeader"
          >
            <p className="instructorLabel">Instructors</p>
            <h2 className="instructorH2">강사 소개</h2>
          </motion.div>

          <div className="instructorGrid">
            {instructors.map((person, idx) => (
              <motion.div
                key={person.name}
                variants={fadeUp(idx * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="instructorCard3d"
              >
                <span className="instructorCard3dNum">0{idx + 1}</span>
                <div className="instructorCard3dModel">
                  <InstructorModel
                  modelUrl={person.model_url || (idx === 0 ? MALE_URL : FEMALE_URL)}
                  accent={idx === 0 ? '#9333ea' : '#ec4899'}
                  baseRotation={0}
                />
                </div>
                <div className="instructorCard3dInfo">
                  <h3 className="instructorCard3dName">{person.name}</h3>
                  <p className="instructorCard3dRole">{person.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKS */}
      <section id="works" className="worksSection">
        <div className="container worksHeader">
          <motion.div
            variants={inView}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="worksLabel">Student Works</p>
            <h2 className="worksH2">Portfolio</h2>
            <p className="worksDesc">수강생들이 직접 만든 포트폴리오 작업물입니다</p>
          </motion.div>
        </div>
        <Gallery />
      </section>

      <Footer />
    </div>
  )
}

/* 강사소개 파티클 네트워크 */
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

  return <canvas ref={canvasRef} className="instructorCanvas" />
}
