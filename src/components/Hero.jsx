import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export default function Hero() {
  const heroRef  = useRef(null)
  const maskGRef = useRef(null)   // SVG <g> 를 직접 조작해 HTML 텍스트와 동기화

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const textY    = useTransform(scrollYProgress, [0, 0.6], ['62vh', '0vh'])
  const textYVh  = useTransform(scrollYProgress, [0, 0.6], [62, 0])

  // SVG 마스크 텍스트를 HTML 텍스트와 동기화
  useMotionValueEvent(textYVh, 'change', (v) => {
    if (maskGRef.current) {
      maskGRef.current.style.transform = `translateY(${v}vh)`
    }
  })

  // SVG 텍스트 공통 스타일 (HTML 텍스트와 동일)
  const svgTextStyle = {
    fontFamily: 'Inter, Pretendard, sans-serif',
    fontSize: '12vw',
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
                style={{ transform: 'translateY(62vh)' }}
              >
                <text
                  x="50%" y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  style={{ ...svgTextStyle, transform: 'translateY(-10.8vw)' }}
                >We are</text>

                <text
                  x="50%" y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  style={svgTextStyle}
                >Creative</text>

                <text
                  x="50%" y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  style={{ ...svgTextStyle, transform: 'translateY(10.8vw)' }}
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
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 3,
            y: textY,
          }}
        >
          <span className="hero-text">We are</span>
          <span className="hero-text">Creative</span>
          <span className="hero-text">Designers</span>
        </motion.div>

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
