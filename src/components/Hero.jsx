import './Hero.css'
import { useRef, useEffect } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export default function Hero() {
  const heroRef    = useRef(null)
  const maskGRef   = useRef(null)
  const textDivRef = useRef(null)
  const imgWrapRef = useRef(null)
  const mouseRef   = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const rafRef     = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const textYVh  = useTransform(scrollYProgress, [0, 0.6], [56, 0])
  const imgScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.18])

  useMotionValueEvent(textYVh, 'change', (v) => {
    if (maskGRef.current)   maskGRef.current.style.transform   = `translateY(${v}vh)`
    if (textDivRef.current) textDivRef.current.style.transform = `translateY(${v}vh)`
  })

  // RAF 하나로 패럴랙스 + 스케일 통합 — 충돌 없음
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const animate = () => {
      const m = mouseRef.current
      m.tx += (m.x * 10 - m.tx) * 0.04
      m.ty += (m.y * 7  - m.ty) * 0.04

      if (imgWrapRef.current) {
        const scale = imgScale.get()
        imgWrapRef.current.style.transform =
          `translate3d(calc(-50% + ${m.tx}px), calc(-50% + ${m.ty}px), 0) scale(${scale})`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [imgScale])

  const svgTextStyle = {
    fontFamily: 'Inter, Pretendard, sans-serif',
    fontWeight: 900,
    letterSpacing: '0.04em',
  }

  return (
    <div ref={heroRef} className="heroWrapper" style={{ position: 'relative' }}>
      <div className="heroSticky">

        <svg className="heroSvg">
          <defs>
            <mask id="hero-glass-mask">
              <g ref={maskGRef} style={{ transform: 'translateY(56vh)' }}>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                  fill="white" className="heroText heroSvgLineTop" style={svgTextStyle}>We are</text>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                  fill="white" className="heroText" style={svgTextStyle}>Creative</text>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                  fill="white" className="heroText heroSvgLineBottom" style={svgTextStyle}>Designers</text>
              </g>
            </mask>
          </defs>
        </svg>

        <div
          className="heroMaskLayer"
          style={{
            WebkitMask: 'url(#hero-glass-mask)',
            mask: 'url(#hero-glass-mask)',
          }}
        >
          <div className="heroImgWrap heroMaskCenter">
            <img
              src={`${import.meta.env.BASE_URL}kv.png`}
              alt=""
              className="heroKvBlurred"
              draggable={false}
            />
          </div>
        </div>

        <div
          ref={textDivRef}
          className="heroTextLayer"
          style={{ transform: 'translateY(56vh)' }}
        >
          <span className="heroText">We are</span>
          <span className="heroText">Creative</span>
          <span className="heroText">Designers</span>
        </div>

        <div ref={imgWrapRef} className="heroImgWrap heroKvOriginalWrap">
          <img
            src={`${import.meta.env.BASE_URL}kv.png`}
            alt=""
            className="heroKvOriginal"
            draggable={false}
          />
        </div>


      </div>
    </div>
  )
}
