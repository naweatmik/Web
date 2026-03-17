import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function CurriculumCard({ step, tag, title, color, description }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.div
        onClick={() => setOpen(true)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '14px',
          padding: '18px',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeft: `4px solid ${color}`,
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.25)' }}>
            #{String(step).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600,
            padding: '2px 8px', borderRadius: '999px',
            background: `${color}22`, color: color,
          }}>
            {tag}
          </span>
        </div>

        <p style={{ color: 'white', fontWeight: 600, fontSize: '13px', lineHeight: 1.4, marginBottom: '8px' }}>
          {title}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>클릭하여 자세히 보기</p>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#111', borderRadius: '20px', padding: '36px',
                maxWidth: '440px', width: '100%', position: 'relative',
                borderTop: `3px solid ${color}`,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  color: 'rgba(255,255,255,0.4)', background: 'none',
                  border: 'none', cursor: 'pointer', padding: '4px',
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.25)' }}>
                  #{String(step).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '999px',
                  background: `${color}22`, color: color,
                }}>
                  {tag}
                </span>
              </div>

              <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
                {title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.7 }}>
                {description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
