import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './PageLoader.css'

const LOGO = 'WEB_UIUX'

export default function PageLoader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <>
          {/* 위 패널 */}
          <motion.div
            className="loaderPanelTop"
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* 아래 패널 */}
          <motion.div
            className="loaderPanelBottom"
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* 중앙 로고 */}
          <motion.div
            className="loaderCenter"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="loaderLogoWrap">
              {LOGO.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="loaderChar"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.045, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="loaderLine"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, ease: 'easeInOut', delay: 0.1 }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
