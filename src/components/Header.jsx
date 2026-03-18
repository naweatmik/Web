import './Header.css'
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
      <header
        className="site-header"
        style={{
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          background: scrolled ? 'linear-gradient(to bottom, rgba(0,0,0,0.88) 55%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="header-inner">
          <button className="header-logo" onClick={scrollToTop}>
            WEB_UIUX
          </button>

          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.href}
                className="nav-btn"
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-drawer-overlay"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="mobile-drawer"
            >
              <button className="mobile-drawer-close" onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
              <nav className="mobile-nav">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    className="mobile-nav-btn"
                    onClick={() => handleNavClick(link.href)}
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
