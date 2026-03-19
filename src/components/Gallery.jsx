import './Gallery.css'
import { useEffect, useRef, useState } from 'react'
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

const TILTS   = [-2.4, 1.7, -1.2, 2.6, -1.8, 1.3]
// 5카드 주기: wide 2개 → standard 3개
const ASPECTS = ['16/9', '16/9', '4/3', '4/3', '4/3']

function FilterTabs({ active, onChange }) {
  return (
    <div className="filterTabsWrap">
      <div className="filterTabsInner">
        <div className="filterTabsShimmer" />
        <div className="filterTabsTopBorder" />
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className="filterBtn"
            onClick={() => onChange(cat.key)}
            style={{ color: active === cat.key ? '#0a0a0a' : 'rgba(255,255,255,0.5)' }}
          >
            {active === cat.key && (
              <motion.div
                layoutId="filter-pill"
                className="filterBtnPill"
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
  const tilt        = TILTS[index % TILTS.length]
  const aspectRatio = ASPECTS[index % 5]
  const num  = String(index + 1).padStart(2, '0')
  const catLabel = CATEGORIES.find(c => c.key === item.category)?.label || item.category || ''
  const glowColor = {
    web:    'rgba(59,130,246,0.22)',
    app:    'rgba(168,85,247,0.22)',
    detail: 'rgba(16,185,129,0.2)',
  }[item.category] || 'rgba(255,255,255,0.1)'

  const badgeStyle = {
    web:    { background: '#2D3FE7', color: '#fff', borderColor: '#2D3FE7' },
    app:    { background: '#a855f7', color: '#fff', borderColor: '#a855f7' },
    detail: { background: '#ec4899', color: '#fff', borderColor: '#ec4899' },
  }[item.category] || { background: '#1A1A1A', color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.15)' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, rotate: tilt, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{
        rotate: 0, y: -12, scale: 1.03,
        boxShadow: `0 0 40px ${glowColor}, 0 24px 40px rgba(0,0,0,0.5)`,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      onClick={() => isWork && onCardClick(item)}
      style={{
        cursor: isWork ? 'pointer' : 'default',
        borderRadius: '12px',
        overflow: 'visible',
        position: 'relative',
        aspectRatio,
        background: isWork ? '#111' : item.grad,
        transformOrigin: 'center bottom',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: '12px', overflow: 'hidden' }}>
        {isWork && (
          <img
            src={item.image_url}
            alt={item.title || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        )}
        <span className="galleryCardNum">{num}</span>
        <div className="galleryCardBadge" style={badgeStyle}>{catLabel}</div>
        <div className="galleryCardTitle">
          {isWork ? (item.title || '') : item.title}
        </div>
      </div>
    </motion.div>
  )
}

function Lightbox({ src, scrollable, onClose }) {
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
      className={`lightbox${scrollable ? ' scrollable' : ''}`}
    >
      <button className="lightboxClose" onClick={onClose}>×</button>

      {scrollable ? (
        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          src={src}
          alt=""
          onClick={e => e.stopPropagation()}
          className="lightboxImgScroll"
        />
      ) : (
        <motion.img
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          src={src}
          alt=""
          onClick={e => e.stopPropagation()}
          className="lightboxImg"
        />
      )}
    </motion.div>
  )
}

const PER_PAGE = 10  // 5카드 주기 × 2 = 행 완성

export default function Gallery() {
  const [works, setWorks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive]   = useState('all')
  const [page, setPage]       = useState(1)
  const [lightbox, setLightbox] = useState(null)
  const topRef = useRef(null)

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
    if (item.category === 'detail') {
      setLightbox({ src: item.link || item.image_url, scrollable: true })
      return
    }
    if (item.link) {
      window.open(item.link, '_blank')
      return
    }
    setLightbox({ src: item.image_url, scrollable: false })
  }

  const scrollToTop = () => {
    if (topRef.current) {
      const top = topRef.current.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleCategory = (key) => { setActive(key); setPage(1); scrollToTop() }
  const handlePage = (n) => { setPage(n); scrollToTop() }

  const source   = works.length > 0 ? works : placeholders
  const isWork   = works.length > 0
  const filtered = active === 'all' ? source : source.filter(item => item.category === active)
  const total    = Math.ceil(filtered.length / PER_PAGE)
  const paged    = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) {
    return (
      <div style={{ padding: '0 24px' }}>
        <div className="galleryTiltGrid">
          {[0,1,2,3,4,5].map(i => <div key={i} className="gallerySkeleton" />)}
        </div>
      </div>
    )
  }

  return (
    <div ref={topRef}>
      <div style={{ padding: '0 clamp(24px, 5vw, 80px)' }}>
        <FilterTabs active={active} onChange={handleCategory} />
      </div>

      <div className="galleryTiltGrid">
        <AnimatePresence mode="wait">
          {paged.map((item, i) => (
            <Card key={item.id} item={item} index={i} isWork={isWork} onCardClick={handleCardClick} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="galleryEmpty">
          아직 등록된 작품이 없습니다
        </motion.div>
      )}

      {total >= 1 && (
        <div className="galleryPagination">
          <button
            onClick={() => handlePage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="galleryPageBtn"
          >‹</button>

          {Array.from({ length: total }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => handlePage(n)}
              className={`galleryPageNum${page === n ? ' active' : ''}`}
            >{n}</button>
          ))}

          <button
            onClick={() => handlePage(Math.min(total, page + 1))}
            disabled={page === total}
            className="galleryPageBtn"
          >›</button>
        </div>
      )}

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox.src} scrollable={lightbox.scrollable} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  )
}
