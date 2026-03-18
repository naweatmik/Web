import './Hero.css'
import { useRef } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export default function Hero() {
  const heroRef    = useRef(null)
  const maskGRef   = useRef(null)
  const textDivRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const textYVh = useTransform(scrollYProgress, [0, 0.6], [56, 0])

  useMotionValueEvent(textYVh, 'change', (v) => {
    if (maskGRef.current)   maskGRef.current.style.transform   = `translateY(${v}vh)`
    if (textDivRef.current) textDivRef.current.style.transform = `translateY(${v}vh)`
  })

  const svgTextStyle = {
    fontFamily: 'Inter, Pretendard, sans-serif',
    fontWeight: 900,
    letterSpacing: '0.04em',
  }

  return (
    <div ref={heroRef} className="hero-wrapper">
      <div className="hero-sticky">

        {/* SVG 마스크 정의 */}
        <svg className="hero-svg">
          <defs>
            <mask id="hero-glass-mask">
              <g ref={maskGRef} style={{ transform: 'translateY(56vh)' }}>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                  fill="white" className="hero-text hero-svg-line-top" style={svgTextStyle}>We are</text>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                  fill="white" className="hero-text" style={svgTextStyle}>Creative</text>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                  fill="white" className="hero-text hero-svg-line-bottom" style={svgTextStyle}>Designers</text>
              </g>
            </mask>
          </defs>
        </svg>

        {/* Frosted glass 레이어 */}
        <div
          className="hero-mask-layer"
          style={{
            WebkitMask: 'url(#hero-glass-mask)',
            mask: 'url(#hero-glass-mask)',
          }}
        >
          <div className="hero-img-wrap hero-mask-center">
            <img
              src={`${import.meta.env.BASE_URL}kv.png`}
              alt=""
              className="hero-kv-blurred"
              draggable={false}
            />
          </div>
        </div>

        {/* HTML 텍스트 */}
        <div
          ref={textDivRef}
          className="hero-text-layer"
          style={{ transform: 'translateY(56vh)' }}
        >
          <span className="hero-text">We are</span>
          <span className="hero-text">Creative</span>
          <span className="hero-text">Designers</span>
        </div>

        {/* 원본 이미지 */}
        <div className="hero-img-wrap hero-kv-original-wrap">
          <img
            src={`${import.meta.env.BASE_URL}kv.png`}
            alt=""
            className="hero-kv-original"
            draggable={false}
          />
        </div>

      </div>
    </div>
  )
}
