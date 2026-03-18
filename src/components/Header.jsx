import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: '학과소개', href: '#about' },
  { label: '커리큘럼', href: '#curriculum' },
  { label: '강사소개', href: '#instructor' },
  { label: '작업물', href: '#works' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 50)
      // 80px 이상 내려갔을 때만 숨김 처리 (맨 위에서는 항상 표시)
      if (currentY > 80) {
        setHidden(currentY > lastY.current)
      } else {
        setHidden(false)
      }
      lastY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleNavClick = (href) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'transform 0.35s ease, background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        background: scrolled ? 'rgba(0,0,0,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}>
        <div className="header-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 48px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* 로고 */}
          <button
            onClick={scrollToTop}
            style={{
              color: '#fff',
              fontWeight: 900,
              fontSize: '15px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              opacity: 1,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            WEB_UIUX
          </button>

          {/* 데스크탑 네비 */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  padding: '4px 0',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* 모바일 드로어 */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 40,
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              style={{
                position: 'fixed', top: 0, right: 0,
                height: '100%', width: '280px',
                background: '#111',
                zIndex: 50,
                display: 'flex', flexDirection: 'column',
                paddingTop: '80px', paddingLeft: '36px', paddingRight: '36px',
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  position: 'absolute', top: '20px', right: '24px',
                  color: 'rgba(255,255,255,0.45)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <X size={22} />
              </button>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    style={{
                      color: '#fff',
                      fontSize: '26px',
                      fontWeight: 800,
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: 1,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
