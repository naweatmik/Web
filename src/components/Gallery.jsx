import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, isSupabaseReady } from '../lib/supabase'

const CATEGORIES = [
  { key: 'all',    label: '전체' },
  { key: 'web',   label: '웹디자인' },
  { key: 'app',   label: '앱디자인' },
  { key: 'detail', label: '상세페이지' },
]

const placeholders = [
  { id: 1, category: 'web',    title: 'Landing Page',    grad: 'linear-gradient(160deg,#1e3a8a 0%,#3b82f6 55%,#93c5fd 100%)' },
  { id: 2, category: 'app',    title: 'App Redesign',    grad: 'linear-gradient(160deg,#581c87 0%,#a855f7 55%,#e9d5ff 100%)' },
  { id: 3, category: 'detail', title: 'Product Detail',  grad: 'linear-gradient(160deg,#064e3b 0%,#10b981 55%,#a7f3d0 100%)' },
  { id: 4, category: 'web',    title: 'Portfolio Site',  grad: 'linear-gradient(160deg,#7f1d1d 0%,#ef4444 55%,#fecaca 100%)' },
  { id: 5, category: 'app',    title: 'Dashboard UI',    grad: 'linear-gradient(160deg,#0c4a6e 0%,#0ea5e9 55%,#bae6fd 100%)' },
  { id: 6, category: 'detail', title: 'Shopping Page',   grad: 'linear-gradient(160deg,#78350f 0%,#f59e0b 55%,#fde68a 100%)' },
]

const TILTS = [-2.4, 1.7, -1.2, 2.6, -1.8, 1.3]

function FilterTabs({ active, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '100px',
        padding: '4px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            style={{
              position: 'relative',
              padding: 'clamp(7px, 1vw, 10px) clamp(14px, 2vw, 24px)',
              borderRadius: '100px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 'clamp(12px, 1.1vw, 14px)',
              fontWeight: 600,
              fontFamily: "'Pretendard', 'Inter', sans-serif",
              letterSpacing: '0.02em',
              color: active === cat.key ? '#0a0a0a' : 'rgba(255,255,255,0.45)',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap',
              zIndex: 1,
            }}
          >
            {active === cat.key && (
              <motion.div
                layoutId="filter-pill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#ffffff',
                  borderRadius: '100px',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Card({ item, index, isWork, onCardClick }) {
  const tilt = TILTS[index % TILTS.length]
  const num  = String(index + 1).padStart(2, '0')
  const catLabel = CATEGORIES.find(c => c.key === item.category)?.label || item.category || ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, rotate: tilt }}
      animate={{ opacity: 1, y: 0,  rotate: tilt }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        rotate: 0, y: -16, scale: 1.03,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      onClick={() => isWork && onCardClick(item)}
      style={{
        cursor: isWork ? 'pointer' : 'default',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '4 / 3',
        background: isWork ? '#111' : item.grad,
        boxShadow: 'none',
        transformOrigin: 'center bottom',
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

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', top: '20px', left: '20px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.18em',
        color: 'rgba(255,255,255,0.45)',
      }}>{num}</div>

      {/* 카테고리 뱃지 */}
      <div style={{
        position: 'absolute', top: '18px', right: '18px',
        fontSize: '9px', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        padding: '4px 10px',
        borderRadius: '100px',
        fontFamily: "'Inter', sans-serif",
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        {catLabel}
      </div>

      <div style={{
        position: 'absolute', bottom: '22px', left: '20px', right: '20px',
        fontFamily: "'Inter', 'Pretendard', sans-serif",
        fontSize: 'clamp(16px, 1.6vw, 22px)',
        fontWeight: 800, lineHeight: 1.15,
        letterSpacing: '-0.02em',
        color: '#ffffff',
      }}>
        {isWork ? (item.title || '') : item.title}
      </div>
    </motion.div>
  )
}

function Lightbox({ src, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, cursor: 'zoom-out', padding: '24px',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: 20, right: 24,
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', width: 40, height: 40,
          borderRadius: '50%', cursor: 'pointer', fontSize: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >×</button>
      <motion.img
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        src={src}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw', maxHeight: '90vh',
          objectFit: 'contain', borderRadius: '8px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          cursor: 'default',
        }}
      />
    </motion.div>
  )
}

const PER_PAGE = 9

export default function Gallery() {
  const [works, setWorks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive]   = useState('all')
  const [page, setPage]       = useState(1)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!isSupabaseReady) { setLoading(false); return }
    supabase
      .from('works').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setWorks(data || [])
        setLoading(false)
      })
  }, [])

  function handleCardClick(item) {
    // 상세페이지: 원본 이미지(link) 있으면 원본으로, 없으면 썸네일로 라이트박스
    if (item.category === 'detail') {
      setLightbox(item.link || item.image_url)
      return
    }
    // 웹·앱: 링크(PDF 포함) 있으면 열기, 없으면 라이트박스
    if (item.link) {
      window.open(item.link, '_blank')
      return
    }
    setLightbox(item.image_url)
  }

  const handleCategory = (key) => { setActive(key); setPage(1) }

  const source   = works.length > 0 ? works : placeholders
  const isWork   = works.length > 0
  const filtered = active === 'all' ? source : source.filter(item => item.category === active)
  const total    = Math.ceil(filtered.length / PER_PAGE)
  const paged    = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) {
    return (
      <div style={{ padding: '0 24px' }}>
        <div className="gallery-tilt-grid">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              aspectRatio: '4/3', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: '0 clamp(24px, 5vw, 80px)' }}>
        <FilterTabs active={active} onChange={handleCategory} />
      </div>

      <div className="gallery-tilt-grid">
        <AnimatePresence mode="popLayout">
          {paged.map((item, i) => (
            <Card key={item.id} item={item} index={i} isWork={isWork} onCardClick={handleCardClick} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '80px 24px',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: "'Pretendard', sans-serif",
            fontSize: '14px',
          }}
        >
          아직 등록된 작품이 없습니다
        </motion.div>
      )}

      {total >= 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '60px', paddingBottom: '20px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'none', cursor: page === 1 ? 'default' : 'pointer',
              color: page === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >‹</button>

          {Array.from({ length: total }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '1px solid ' + (page === n ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.15)'),
                background: page === n ? '#ffffff' : 'none',
                cursor: 'pointer',
                color: page === n ? '#0a0a0a' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >{n}</button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(total, p + 1))}
            disabled={page === total}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'none', cursor: page === total ? 'default' : 'pointer',
              color: page === total ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >›</button>
        </div>
      )}

      {/* 라이트박스 */}
      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}
