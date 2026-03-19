import './Footer.css'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const sway = (from, to, duration = 7, delay = 0) => ({
  animate: { rotate: [from, to, from] },
  style: { transformOrigin: 'bottom center' },
  transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
})

export default function Footer() {
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <footer className="siteFooter">
      <div className="footerInner">

        <motion.div
          className="footerCta"
          style={{ marginBottom: '16px', cursor: 'pointer' }}
          whileHover={{ scale: 1.015, boxShadow: '0 16px 56px rgba(0,0,0,0.14)' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onHoverStart={() => setCtaHover(true)}
          onHoverEnd={() => setCtaHover(false)}
        >
          <div className="footerCtaShimmer" />
          <h2 className="footerCtaHeading">수강이 궁금하신가요?</h2>
          <motion.div
            animate={ctaHover ? { x: 5, y: -5 } : { x: 0, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArrowUpRight color="#0A0A0A" strokeWidth={1.8} className="footerCtaIcon" />
          </motion.div>
        </motion.div>

        <div className="footerGrid" style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>

          <motion.div className="footerCard footerCardContact footerCardMin" {...sway(-1.2, 1.2, 7, 0)}>
            <h3 className="footerCardHeading">Contact</h3>
            <div>
              <p className="footerCardText">WEB_UIUX와 함께 하시겠어요?</p>
              <a
                href="https://daegu.sbsart.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footerContactLink"
              >
                수강 문의
              </a>
            </div>
          </motion.div>

          <motion.div className="footerCard footerCardInfo footerCardMin" {...sway(1.0, -1.0, 8, 1.2)}>
            <div className="footerCardHighlight" />
            <h3 className="footerCardInfoHeading">Info</h3>
            <div className="footerAddressBlock">
              <span className="footerAddressLabel">Address</span>
              <p className="footerAddressText">대구광역시 중구 동성로3가 동성로1길 15 5층</p>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <motion.div className="footerCard footerCardMenu" {...sway(-0.8, 0.8, 6, 0.5)}>
              <div className="footerMenuGrid">
                {['HOME', 'CURRICULUM', 'INSTRUCTOR', 'WORKS'].map((item) => (
                  <span key={item} className="footerMenuItem">{item}</span>
                ))}
              </div>
            </motion.div>

            <div className="footerSocialGrid">
              <SocialButton label="YouTube"   bg="linear-gradient(135deg, #FF0000 0%, #CC0000 60%, #8B0000 100%)"  delay={0}   />
              <SocialButton label="Instagram" bg="linear-gradient(135deg, #405DE6 0%, #C13584 40%, #E1306C 65%, #F77737 85%, #FFDC80 100%)" delay={0.4} />
              <SocialButton label="KakaoTalk" bg="linear-gradient(135deg, #FEE500 0%, #F5D100 50%, #E6C200 100%)"  labelColor="#000" delay={0.8} />
            </div>
          </div>

        </div>

        <p className="footerCopyright">© SBS UIUX. ALL RIGHTS RESERVED.</p>

      </div>

      <div className="footerWordmark">
        <div className="footerWordmarkTrack">
          {[0, 1].map(i => (
            <span key={i} className="footerWordmarkText" aria-hidden={i === 1}>
              Let's Get Connected&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

    </footer>
  )
}

function SocialButton({ label, bg, labelColor = '#fff', delay = 0 }) {
  return (
    <motion.a
      href="#"
      onClick={e => e.preventDefault()}
      className="socialBtn"
      style={{ background: bg, transformOrigin: 'bottom center' }}
      animate={{ rotate: [delay % 2 === 0 ? -2 : 2, delay % 2 === 0 ? 2 : -2, delay % 2 === 0 ? -2 : 2] }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.07, transition: { duration: 0.22 } }}
    >
      <span className="socialBtnLabel" style={{ color: labelColor }}>
        {label} <ArrowUpRight size={9} />
      </span>
    </motion.a>
  )
}
