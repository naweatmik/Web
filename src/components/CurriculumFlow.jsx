import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { curriculum as defaultCurriculum } from '../data/content'
import { supabase, isSupabaseReady } from '../lib/supabase'

const groups = [
  { label: '선수과목',   color: '#EF4444', steps: [1] },
  { label: '디자인',     color: '#3B82F6', steps: [2, 3, 4] },
  { label: '웹개발',     color: '#8B5CF6', steps: [5, 6, 7] },
  { label: '포트폴리오', color: '#22C55E', steps: [8, 9, 10] },
  { label: '그외',       color: '#F59E0B', steps: [11, 12] },
]

export default function CurriculumFlow() {
  const [curriculum, setCurriculum] = useState(defaultCurriculum)

  useEffect(() => {
    if (!isSupabaseReady) return
    supabase
      .from('curriculum')
      .select('*')
      .order('step', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const dbSteps = data.map((d) => d.step)
          const missing = defaultCurriculum.filter((c) => !dbSteps.includes(c.step))
          setCurriculum([...data, ...missing].sort((a, b) => a.step - b.step))
        }
      })
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── 섹션 헤더 ── */}
      <div style={{ marginBottom: 'clamp(48px, 8vw, 96px)' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
          fontFamily: "'Inter', sans-serif", marginBottom: '16px', margin: '0 0 16px',
        }}>CURRICULUM</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <h2 style={{
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            fontSize: 'clamp(2.4rem, 5vw, 6rem)',
            fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.04em',
            color: '#ffffff', margin: 0,
          }}>커리큘럼</h2>
          <span style={{
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            fontWeight: 300, color: 'rgba(255,255,255,0.35)', letterSpacing: '-0.01em',
          }}>과정</span>
        </div>
      </div>

      {/* ── 그룹 리스트 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 6vw, 56px)' }}>
        {groups.map((group, gIdx) => (
          <div key={group.label}>

            {/* 그룹 라벨 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingLeft: '4px' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: group.color, flexShrink: 0, display: 'inline-block',
                boxShadow: `0 0 8px ${group.color}`,
              }} />
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.2em', color: group.color, fontFamily: "'Inter', sans-serif",
              }}>{group.label}</span>
            </div>

            {/* 카드 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {group.steps.map((step, sIdx) => {
                const item = curriculum.find((c) => c.step === step)
                if (!item) return null
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0 }}
                    transition={{ duration: 0.5, delay: sIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0',
                      padding: 'clamp(16px, 2.2vw, 24px) clamp(16px, 2.5vw, 28px)',
                      paddingLeft: 'clamp(48px, 7vw, 72px)',
                      /* 유리 카드 */
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(18px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.2), inset 1px 0 0 rgba(255,255,255,0.15), inset -1px 0 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* 유리 표면 반사 레이어 */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', background: 'linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 35%, transparent 60%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', borderRadius: '16px 16px 0 0', background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.9) 55%, rgba(255,255,255,0.6) 75%, transparent 95%)', pointerEvents: 'none' }} />
                    {/* 왼쪽 컬러 라인 */}
                    <div style={{
                      position: 'absolute', left: 0, top: '12px', bottom: '12px',
                      width: '3px', borderRadius: '0 3px 3px 0',
                      background: item.color,
                      opacity: 0.7,
                    }} />

                    {/* 스텝 번호 */}
                    <span style={{
                      position: 'absolute',
                      left: 'clamp(12px, 2vw, 20px)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(11px, 1.2vw, 13px)',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: 'rgba(255,255,255,0.22)',
                    }}>{String(item.step).padStart(2, '0')}</span>

                    {/* 과목명 */}
                    <span style={{
                      flex: 1,
                      minWidth: 0,
                      fontFamily: "'Inter', 'Pretendard', sans-serif",
                      fontSize: 'clamp(1.05rem, 3.2vw, 2.8rem)',
                      fontWeight: 800,
                      lineHeight: 1.1,
                      letterSpacing: '-0.025em',
                      color: '#ffffff',
                      wordBreak: 'keep-all',
                    }}>{item.title}</span>

                    {/* 영문 부제 */}
                    <span style={{
                      display: 'none',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 'clamp(11px, 1vw, 13px)',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.25)',
                      letterSpacing: '0.01em',
                      marginRight: '16px',
                      whiteSpace: 'nowrap',
                    }} className="curriculum-en">{item.titleEn}</span>

                    {/* 태그 */}
                    <span style={{
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: item.color,
                      background: item.color + '20',
                      border: '1px solid ' + item.color + '50',
                      padding: '5px 12px', borderRadius: '6px',
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: 'nowrap', flexShrink: 0,
                      boxShadow: `0 0 12px ${item.color}30`,
                    }}>{item.tag}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
