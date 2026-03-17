import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#000', color: '#fff', width: '100%', overflow: 'hidden', paddingTop: '0' }}>
      <div style={{ paddingTop: '40px', paddingBottom: '0', paddingLeft: '24px', paddingRight: '24px' }}>

        {/* ── 상단 CTA 카드 ── */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(0,0,0,0.1)',
          padding: '36px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          cursor: 'pointer',
        }}>
          <h2 style={{
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
            fontWeight: 800,
            color: '#0A0A0A',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            수강이 궁금하신가요?
          </h2>
          <ArrowUpRight size={32} color="#0A0A0A" strokeWidth={2} />
        </div>

        {/* ── 메인 그리드 ── */}
        <div className="footer-grid" style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>

          {/* Contact (Blue) */}
          <div style={{
            background: '#2D3FE7',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Contact</h3>
            <div>
              <p style={{ fontSize: '15px', lineHeight: 1.4, marginBottom: '20px' }}>
                WEB_UIUX와 함께 하시겠어요?
              </p>
              <a href="https://daegu.sbsart.com/" target="_blank" rel="noopener noreferrer" style={{
                display: 'block',
                width: '100%',
                background: '#fff',
                color: '#2D3FE7',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textAlign: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}>
                수강 문의
              </a>
            </div>
          </div>

          {/* Info (Dark Gray) */}
          <div style={{
            background: '#1A1A1A',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '260px',
            gap: '20px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 'auto', marginTop: 0 }}>Info</h3>
            <div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Address</span>
              <p style={{ fontSize: '14px', lineHeight: 1.5, margin: 0 }}>대구광역시 중구 동성로3가 동성로1길 15 5층</p>
            </div>
            <div>
            
            </div>
          </div>

          {/* 메뉴 + 소셜 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 메뉴 */}
            <div style={{
              background: '#1A1A1A',
              borderRadius: '20px',
              padding: '28px',
              flex: 1,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em' }}>
                {['HOME', 'CURRICULUM', 'INSTRUCTOR', 'WORKS'].map((item) => (
                  <span key={item} style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >{item}</span>
                ))}
              </div>
            </div>

            {/* 소셜 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <SocialButton label="YouTube" bg="#CD201F" />
              <SocialButton label="Instagram" bg="linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)" />
              <SocialButton label="KakaoTalk" bg="#FEE500" labelColor="#000" />
            </div>
          </div>

        </div>

        {/* 카피라이트 */}
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
          © SBS UIUX. ALL RIGHTS RESERVED.
        </p>

      </div>

      {/* 하단 대형 텍스트 */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0.85 }}>
        <h1 style={{
          fontFamily: "'Inter', 'Pretendard', sans-serif",
          fontSize: '14vw',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: '#fff',
          whiteSpace: 'nowrap',
          margin: 0,
          paddingLeft: '2vw',
          lineHeight: 0.9,
        }}>
          Let's Get Connected
        </h1>
      </div>

    </footer>
  )
}

function SocialButton({ label, bg, labelColor = '#fff' }) {
  return (
    <a href="#" style={{
      background: bg,
      borderRadius: '14px',
      aspectRatio: '1',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      textDecoration: 'none',
    }}>
      <span style={{
        fontSize: '10px',
        fontWeight: 700,
        color: labelColor,
        background: 'rgba(255,255,255,0.25)',
        padding: '3px 8px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        width: 'fit-content',
      }}>
        {label} <ArrowUpRight size={9} />
      </span>
    </a>
  )
}
