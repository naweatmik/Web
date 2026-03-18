import './Footer.css'
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* 상단 CTA 카드 */}
        <div className="footer-cta" style={{ marginBottom: '16px', cursor: 'pointer' }}>
          <h2 className="footer-cta-heading">수강이 궁금하신가요?</h2>
          <ArrowUpRight color="#0A0A0A" strokeWidth={1.8} className="footer-cta-icon" />
        </div>

        {/* 메인 그리드 */}
        <div className="footer-grid" style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>

          {/* Contact (Blue) */}
          <div className="footer-card footer-card-contact footer-card-min">
            <h3 className="footer-card-heading">Contact</h3>
            <div>
              <p className="footer-card-text">WEB_UIUX와 함께 하시겠어요?</p>
              <a
                href="https://daegu.sbsart.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                수강 문의
              </a>
            </div>
          </div>

          {/* Info (Gradient) */}
          <div className="footer-card footer-card-info footer-card-min">
            <div className="footer-card-highlight" />
            <h3 className="footer-card-info-heading">Info</h3>
            <div className="footer-address-block">
              <span className="footer-address-label">Address</span>
              <p className="footer-address-text">대구광역시 중구 동성로3가 동성로1길 15 5층</p>
            </div>
          </div>

          {/* 메뉴 + 소셜 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="footer-card footer-card-menu">
              <div className="footer-menu-grid">
                {['HOME', 'CURRICULUM', 'INSTRUCTOR', 'WORKS'].map((item) => (
                  <span key={item} className="footer-menu-item">{item}</span>
                ))}
              </div>
            </div>

            <div className="footer-social-grid">
              <SocialButton label="YouTube" bg="#CD201F" />
              <SocialButton label="Instagram" bg="linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)" />
              <SocialButton label="KakaoTalk" bg="#FEE500" labelColor="#000" />
            </div>
          </div>

        </div>

        {/* 카피라이트 */}
        <p className="footer-copyright">© SBS UIUX. ALL RIGHTS RESERVED.</p>

      </div>

      {/* 하단 대형 텍스트 */}
      <div className="footer-wordmark">
        <h1 className="footer-wordmark-text">Let's Get Connected</h1>
      </div>

    </footer>
  )
}

function SocialButton({ label, bg, labelColor = '#fff' }) {
  return (
    <a href="#" onClick={e => e.preventDefault()} className="social-btn" style={{ background: bg }}>
      <span className="social-btn-label" style={{ color: labelColor }}>
        {label} <ArrowUpRight size={9} />
      </span>
    </a>
  )
}
