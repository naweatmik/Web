import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { curriculum as defaultCurriculum } from '../data/content'
import { supabase, isSupabaseReady } from '../lib/supabase'

const groups = [
  { label: '선수과목',   color: '#EF4444', steps: [1] },
  { label: '디자인',     color: '#3B82F6', steps: [2, 3, 4] },
  { label: '웹개발',     color: '#8B5CF6', steps: [5, 6, 7] },
  { label: '포트폴리오', color: '#22C55E', steps: [8, 9, 10] },
]

export default function CurriculumFlow() {
  const sectionRef = useRef(null)
  const [curriculum, setCurriculum] = useState(defaultCurriculum)

  useEffect(() => {
    if (!isSupabaseReady) return
    supabase
      .from('curriculum')
      .select('*')
      .order('step', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setCurriculum(data)
      })
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-20px', '60px'])

  return (
    <div ref={sectionRef} style={{ position: 'relative' }}>


      {/* 섹션 헤더 */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '80px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)',
          fontFamily: "'Inter', sans-serif", marginBottom: '20px',
        }}>CURRICULUM</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
          <h2 style={{
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 6rem)',
            fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em',
            color: '#0A0A0A', margin: 0,
          }}>커리큘럼</h2>
          <span style={{
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
            fontWeight: 300, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.01em',
          }}>과정</span>
        </div>
      </div>

      {/* 그룹 리스트 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {groups.map((group, gIdx) => (
          <div key={group.label} style={{ marginTop: gIdx > 0 ? '64px' : 0 }}>

            {/* 그룹 라벨 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: group.color, flexShrink: 0, display: 'inline-block',
              }} />
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.18em', color: group.color, fontFamily: "'Inter', sans-serif",
              }}>{group.label}</span>
            </div>

            {/* 행 */}
            {group.steps.map((step, sIdx) => {
              const item = curriculum.find((c) => c.step === step)
              if (!item) return null
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-50px' }}
                  transition={{ duration: 0.55, delay: sIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingTop: '24px',
                    paddingBottom: '24px',
                    paddingLeft: 'clamp(36px, 6vw, 52px)',
                    paddingRight: 'clamp(12px, 3vw, 19px)',
                    borderBottom: '1px solid rgba(0,0,0,0.18)',
                  }}
                >
                  {/* 번호 — absolute, 항상 표시 */}
                  <span
                    className="curriculum-step-num"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(1.2rem, 3.5vw, 2.8rem)',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'rgba(0,0,0,0.25)',
                      width: 'clamp(24px, 4vw, 36px)',
                      textAlign: 'right',
                    }}
                  >{String(item.step).padStart(2, '0')}</span>

                  {/* 과목명 */}
                  <span
                    className="curriculum-title"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontFamily: "'Inter', 'Pretendard', sans-serif",
                      fontSize: 'clamp(1.2rem, 4vw, 3.5rem)',
                      fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em',
                      color: '#0A0A0A',
                      wordBreak: 'keep-all',
                      paddingLeft: 'clamp(12px, 2.5vw, 24px)',
                    }}
                  >{item.title}</span>

                  {/* 태그 */}
                  <span
                    className="curriculum-tag"
                    style={{
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: item.color,
                      background: item.color + '18', border: '1px solid ' + item.color + '55',
                      padding: '4px 12px', borderRadius: '4px',
                      fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >{item.tag}</span>
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
