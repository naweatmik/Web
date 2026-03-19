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
    <div className="curriculumRoot">

      <div className="curriculumHeader">
        <p className="curriculumLabel">CURRICULUM</p>
        <div className="curriculumTitleRow">
          <h2 className="curriculumH2">커리큘럼</h2>
          <span className="curriculumSubtitleText">과정</span>
        </div>
      </div>

      <div className="curriculumGroups">
        {groups.map((group, gIdx) => (
          <div key={group.label}>

            <div className="curriculumGroupLabelRow">
              <span
                className="curriculumGroupDot"
                style={{ background: group.color, boxShadow: `0 0 8px ${group.color}` }}
              />
              <span className="curriculumGroupName" style={{ color: group.color }}>
                {group.label}
              </span>
            </div>

            <div className="curriculumCards">
              {group.steps.map((step, sIdx) => {
                const item = curriculum.find((c) => c.step === step)
                if (!item) return null
                return (
                  <motion.div
                    key={step}
                    className="curriculumCard"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0 }}
                    transition={{ duration: 0.5, delay: sIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="curriculumCardShine" />
                    <div className="curriculumCardTopLine" />

                    <div className="curriculumCardAccent" style={{ background: item.color }} />
                    <span className="curriculumStepNum">
                      {String(item.step).padStart(2, '0')}
                    </span>
                    <span className="curriculumTitle">{item.title}</span>
                    <span className="curriculumEn">{item.titleEn}</span>
                    <span
                      className="curriculumTag"
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
