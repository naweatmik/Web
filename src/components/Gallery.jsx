import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, isSupabaseReady } from '../lib/supabase'

const placeholders = [
  { id: 1, label: 'UIUX',      title: 'App Redesign',     grad: 'linear-gradient(160deg,#1e3a8a 0%,#3b82f6 55%,#93c5fd 100%)' },
  { id: 2, label: 'Graphic',   title: 'Brand Identity',   grad: 'linear-gradient(160deg,#581c87 0%,#a855f7 55%,#e9d5ff 100%)' },
  { id: 3, label: 'Editorial', title: 'Magazine Layout',  grad: 'linear-gradient(160deg,#064e3b 0%,#10b981 55%,#a7f3d0 100%)' },
  { id: 4, label: 'Motion',    title: 'Scroll Animation', grad: 'linear-gradient(160deg,#7f1d1d 0%,#ef4444 55%,#fecaca 100%)' },
  { id: 5, label: 'UIUX',      title: 'Dashboard UI',     grad: 'linear-gradient(160deg,#0c4a6e 0%,#0ea5e9 55%,#bae6fd 100%)' },
  { id: 6, label: 'Graphic',   title: 'Poster Series',    grad: 'linear-gradient(160deg,#78350f 0%,#f59e0b 55%,#fde68a 100%)' },
]

/* 카드마다 다른 기울기 — 사진 산란 느낌 */
const TILTS = [-2.4, 1.7, -1.2, 2.6, -1.8, 1.3]

function Card({ item, index, isWork }) {
  const tilt  = TILTS[index % TILTS.length]
  const num   = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        rotate: 0,
        y: -16,
        scale: 1.03,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      onClick={() => isWork && item.link && window.open(item.link, '_blank')}
      style={{
        cursor: isWork && item.link ? 'pointer' : 'default',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '4 / 3',
        background: isWork ? '#111' : item.grad,
        boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35)',
        transformOrigin: 'center bottom',
      }}
    >
      {/* 실제 이미지 */}
      {isWork && (
        <img
          src={item.image_url}
          alt={item.title || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      )}

      {/* 하단 그라디언트 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 인덱스 번호 — 상단 좌측 */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.18em',
        color: 'rgba(255,255,255,0.45)',
      }}>{num}</div>

      {/* 라벨 */}
      {!isWork && (
        <div style={{
          position: 'absolute', top: '18px', right: '18px',
          fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          fontFamily: "'Inter', sans-serif",
        }}>{item.label}</div>
      )}

      {/* 제목 */}
      <div style={{
        position: 'absolute', bottom: '22px', left: '20px', right: '20px',
        fontFamily: "'Inter', 'Pretendard', sans-serif",
        fontSize: 'clamp(18px, 1.8vw, 24px)',
        fontWeight: 800, lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: '#ffffff',
      }}>
        {isWork ? (item.title || '') : item.title}
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [works, setWorks]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseReady) { setLoading(false); return }
    supabase
      .from('works').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setWorks(data || [])
        setLoading(false)
      })
  }, [])

  const items  = works.length > 0 ? works : placeholders
  const isWork = works.length > 0

  if (loading) {
    return (
      <div className="gallery-tilt-grid">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            aspectRatio: '4/3', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        ))}
      </div>
    )
  }

  return (
    <div className="gallery-tilt-grid">
      {items.map((item, i) => (
        <Card key={item.id ?? i} item={item} index={i} isWork={isWork} />
      ))}
    </div>
  )
}
