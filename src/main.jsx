import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { pwaManager } from './utils/pwa.js'

// Initialize PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    pwaManager.init();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)