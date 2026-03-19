import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const _warn = console.warn.bind(console)
console.warn = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (msg.includes('THREE.Clock') || msg.includes('THREE.Timer')) return
  if (msg.includes('non-static position')) return
  if (msg.includes('PropertyBinding') || msg.includes('No target node found')) return
  if (msg.includes('ShininessExponent')) return
  if (msg.includes('skinning weights')) return
  if (msg.includes('AnimatePresence')) return
  _warn(...args)
}

const _log = console.log.bind(console)
console.log = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (msg.includes('[vite]')) return
  _log(...args)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
