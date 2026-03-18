import { useRef } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export default function Hero() {
  const heroRef    = useRef(null)
  const maskGRef   = useRef(null)  // SVG <g>
  const textDivRef = useRef(null)  // HTML 텍스트 div

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const textYVh = useTransform(scrollYProgress, [0, 0.6], [56, 0])

  // SVG 마스크 + HTML 텍스트 동시에 직접 DOM 조작 (motion.div 경고 제거)
  useMotionValueEvent(textYVh, 'change', (v) => {
    if (maskGRef.current)   maskGRef.current.style.transform   = `translateY(${v}vh)`
    if (textDivRef.current) textDivRef.current.style.transform = `translateY(${v}vh)`
  })

  // SVG 텍스트 공통 스타일 (HTML 텍스트와 동일 — fontSize는 CSS .hero-text로 제어)
  const svgTextStyle = {
    fontFamily: 'Inter, Pretendard, sans-serif',
    fontWeight: 900,
    letterSpacing: '0.04em',
  }

  return (
    <div ref={heroRef} style={{ height: '350vh', position: 'relative', zIndex: 1 }}>

      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        background: '#000000',
      }}>

        {/* ── SVG 마스크 정의 (시각적으로는 아무것도 렌더링 안 됨) ── */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        >
          <defs>
            <mask id="hero-glass-mask">
              {/*
                검정 = 투명(숨김), 흰색 = 불투명(표시)
                글자 모양(흰색)만 frosted 레이어가 보이게 됨
              */}
              <g
                ref={maskGRef}
                style={{ transform: 'translateY(56vh)' }}
              >
                <text
                  x="50%" y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  className="hero-text hero-svg-line-top"
                  style={svgTextStyle}
                >We are</text>

                <text
                  x="50%" y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  className="hero-text"
                  style={svgTextStyle}
                >Creative</text>

                <text
                  x="50%" y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  className="hero-text hero-svg-line-bottom"
                  style={svgTextStyle}
                >Designers</text>
              </g>
            </mask>
          </defs>
        </svg>

        {/* ── Frosted glass 레이어 — 글자 모양 안에만 보임 ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          WebkitMask: 'url(#hero-glass-mask)',
          mask: 'url(#hero-glass-mask)',
        }}>
          <div
            className="hero-img-wrap"
            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}kv.png`}
              alt=""
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '8px',
                filter: 'blur(18px) brightness(1.4) saturate(1.8)',
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* ── HTML 텍스트 (흰색, z:3) ── */}
        <div
          ref={textDivRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 3,
            transform: 'translateY(56vh)',
          }}
        >
          <span className="hero-text">We are</span>
          <span className="hero-text">Creative</span>
          <span className="hero-text">Designers</span>
        </div>

        {/* ── 원본 이미지 (z:2) ── */}
        <div
          className="hero-img-wrap"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}kv.png`}
            alt=""
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
            draggable={false}
          />
        </div>

      </div>
    </div>
  )
}
