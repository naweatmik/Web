import './CurriculumFlow.css'
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
    <div className="curriculum-root">

      {/* 섹션 헤더 */}
      <div className="curriculum-header">
        <p className="curriculum-label">CURRICULUM</p>
        <div className="curriculum-title-row">
          <h2 className="curriculum-h2">커리큘럼</h2>
          <span className="curriculum-subtitle-text">과정</span>
        </div>
      </div>

      {/* 그룹 리스트 */}
      <div className="curriculum-groups">
        {groups.map((group, gIdx) => (
          <div key={group.label}>

            {/* 그룹 라벨 */}
            <div className="curriculum-group-label-row">
              <span
                className="curriculum-group-dot"
                style={{ background: group.color, boxShadow: `0 0 8px ${group.color}` }}
              />
              <span className="curriculum-group-name" style={{ color: group.color }}>
                {group.label}
              </span>
            </div>

            {/* 카드 목록 */}
            <div className="curriculum-cards">
              {group.steps.map((step, sIdx) => {
                const item = curriculum.find((c) => c.step === step)
                if (!item) return null
                return (
                  <motion.div
                    key={step}
                    className="curriculum-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0 }}
                    transition={{ duration: 0.5, delay: sIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="curriculum-card-shine" />
                    <div className="curriculum-card-top-line" />

                    {/* 왼쪽 컬러 라인 */}
                    <div className="curriculum-card-accent" style={{ background: item.color }} />

                    {/* 스텝 번호 */}
                    <span className="curriculum-step-num">
                      {String(item.step).padStart(2, '0')}
                    </span>

                    {/* 과목명 */}
                    <span className="curriculum-title">{item.title}</span>

                    {/* 영문 부제 */}
                    <span className="curriculum-en">{item.titleEn}</span>

                    {/* 태그 */}
                    <span
                      className="curriculum-tag"
                      style={{
                        color: item.color,
                        background: item.color + '20',
                        border: '1px solid ' + item.color + '50',
                        boxShadow: `0 0 12px ${item.color}30`,
                      }}
                    >
                      {item.tag}
                    </span>
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
