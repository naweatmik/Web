import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, isSupabaseReady } from '../lib/supabase'

/* Supabase 미연결 시 보여줄 플레이스홀더 */
const placeholders = [
  { id: 1, label: 'UIUX', title: 'App\nRedesign', grad: 'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 60%,#93c5fd 100%)', h: 320 },
  { id: 2, label: 'Graphic', title: 'Brand\nIdentity', grad: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#f0abfc 100%)', h: 240 },
  { id: 3, label: 'Editorial', title: 'Magazine\nLayout', grad: 'linear-gradient(135deg,#064e3b 0%,#10b981 60%,#6ee7b7 100%)', h: 280 },
  { id: 4, label: 'Motion', title: 'Scroll\nAnimation', grad: 'linear-gradient(135deg,#7f1d1d 0%,#ef4444 55%,#fca5a5 100%)', h: 260 },
  { id: 5, label: 'UIUX', title: 'Dashboard\nUI', grad: 'linear-gradient(135deg,#0c4a6e 0%,#0ea5e9 55%,#7dd3fc 100%)', h: 300 },
  { id: 6, label: 'Graphic', title: 'Poster\nSeries', grad: 'linear-gradient(135deg,#78350f 0%,#f59e0b 55%,#fde68a 100%)', h: 220 },
]

function PlaceholderCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: item.grad,
        borderRadius: '16px',
        height: `${item.h}px`,
        marginBottom: '16px',
        breakInside: 'avoid',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* 노이즈 텍스처 느낌 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
        opacity: 0.4,
      }} />

      {/* 라벨 */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px',
        fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.6)',
        fontFamily: "'Inter', sans-serif",
        background: 'rgba(0,0,0,0.2)',
        padding: '4px 10px',
        borderRadius: '999px',
        backdropFilter: 'blur(4px)',
      }}>
        {item.label}
      </div>

      {/* 제목 */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '20px', right: '20px',
        fontFamily: "'Inter', 'Pretendard', sans-serif",
        fontSize: 'clamp(22px, 2.5vw, 32px)',
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        color: '#ffffff',
        whiteSpace: 'pre-line',
      }}>
        {item.title}
      </div>

    </motion.div>
  )
}

export default function Gallery() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseReady) { setLoading(false); return }
    supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setWorks(data || [])
        setLoading(false)
      })
  }, [])

  /* 로딩 스켈레톤 */
  if (loading) {
    return (
      <div style={{ columns: '2', columnGap: '24px' }}>
        {[320, 240, 280, 260, 300, 220].map((h, i) => (
          <div key={i} style={{
            height: `${h}px`, borderRadius: '16px',
            background: 'rgba(255,255,255,0.04)',
            marginBottom: '16px', breakInside: 'avoid',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        ))}
      </div>
    )
  }

  /* Supabase 미연결 or 작업물 없음 → 플레이스홀더 */
  if (works.length === 0) {
    return (
      <div style={{ columns: '2', columnGap: '24px' }}>
        {placeholders.map((item, i) => (
          <PlaceholderCard key={item.id} item={item} index={i} />
        ))}
      </div>
    )
  }

  /* 실제 작업물 */
  return (
    <div style={{ columns: '2', columnGap: '24px' }}>
      {works.map((work, i) => (
        <motion.div
          key={work.id}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => work.link && window.open(work.link, '_blank')}
          style={{
            borderRadius: '16px',
            marginBottom: '16px',
            breakInside: 'avoid',
            overflow: 'hidden',
            cursor: work.link ? 'pointer' : 'default',
            position: 'relative',
          }}
          whileHover={work.link ? { scale: 1.02 } : {}}
        >
          <img
            src={work.image_url}
            alt={work.title || '학생 작업물'}
            style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            loading="lazy"
          />
          {work.link && (
            <div className="group-hover:opacity-100" style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}
            >
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>포트폴리오 보기 →</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
