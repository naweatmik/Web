import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { supabase, isSupabaseReady } from '../lib/supabase'

const CARD_W = 400
const CARD_H = 540
const GAP    = 24
const PAD_L  = 80   // 트랙 왼쪽 여백

const placeholders = [
  { id: 1, label: 'UIUX',      title: 'App Redesign',     grad: 'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 60%,#93c5fd 100%)' },
  { id: 2, label: 'Graphic',   title: 'Brand Identity',   grad: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#f0abfc 100%)' },
  { id: 3, label: 'Editorial', title: 'Magazine Layout',  grad: 'linear-gradient(135deg,#064e3b 0%,#10b981 60%,#6ee7b7 100%)' },
  { id: 4, label: 'Motion',    title: 'Scroll Animation', grad: 'linear-gradient(135deg,#7f1d1d 0%,#ef4444 55%,#fca5a5 100%)' },
  { id: 5, label: 'UIUX',      title: 'Dashboard UI',     grad: 'linear-gradient(135deg,#0c4a6e 0%,#0ea5e9 55%,#7dd3fc 100%)' },
  { id: 6, label: 'Graphic',   title: 'Poster Series',    grad: 'linear-gradient(135deg,#78350f 0%,#f59e0b 55%,#fde68a 100%)' },
]

function Card({ item, index, isWork }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px -200px 0px 0px' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => isWork && item.link && window.open(item.link, '_blank')}
      style={{
        flexShrink: 0,
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        cursor: isWork && item.link ? 'pointer' : 'default',
        background: isWork ? '#111' : item.grad,
      }}
    >
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
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* 대형 번호 */}
      <div style={{
        position: 'absolute', top: '-12px', right: '16px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '140px', fontWeight: 900, lineHeight: 1,
        letterSpacing: '-0.06em',
        color: 'rgba(255,255,255,0.06)',
        userSelect: 'none', pointerEvents: 'none',
      }}>{num}</div>

      {/* 라벨 */}
      {!isWork && (
        <div style={{
          position: 'absolute', top: '22px', left: '22px',
          fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.8)',
          background: 'rgba(0,0,0,0.22)',
          padding: '5px 12px', borderRadius: '999px',
          backdropFilter: 'blur(6px)',
          fontFamily: "'Inter', sans-serif",
        }}>{item.label}</div>
      )}

      {/* 제목 */}
      <div style={{
        position: 'absolute', bottom: '28px', left: '26px', right: '26px',
        fontFamily: "'Inter', 'Pretendard', sans-serif",
        fontSize: '30px', fontWeight: 900,
        lineHeight: 1.1, letterSpacing: '-0.03em',
        color: '#ffffff',
      }}>
        {isWork ? (item.title || '') : item.title}
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [works, setWorks]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [xRange, setXRange]       = useState([0, -1000])
  const [sectionH, setSectionH]   = useState('200vh')
  const containerRef = useRef(null)

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

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const trackW  = PAD_L + items.length * (CARD_W + GAP) - GAP + PAD_L
      const maxX    = -(trackW - vw)
      const scrollH = Math.abs(maxX) + vh
      setXRange([0, maxX])
      setSectionH(`${scrollH}px`)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [items.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], xRange)

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', paddingLeft: `${PAD_L}px`, gap: `${GAP}px`, overflow: 'hidden' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flexShrink: 0, width: `${CARD_W}px`, height: `${CARD_H}px`,
            borderRadius: '24px', background: 'rgba(255,255,255,0.04)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ height: sectionH, position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* 스크롤 힌트 */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
          fontFamily: "'Inter', sans-serif",
        }}>
          <span>scroll</span>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
        </div>

        {/* 카드 트랙 */}
        <motion.div style={{
          display: 'flex', gap: `${GAP}px`,
          paddingLeft: `${PAD_L}px`,
          x,
        }}>
          {items.map((item, i) => (
            <Card key={item.id ?? i} item={item} index={i} isWork={isWork} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
