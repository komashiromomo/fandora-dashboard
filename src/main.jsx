import React from 'react'
import ReactDOM from 'react-dom/client'
import FandoraDashboard from './FandoraDashboard.jsx'

// Global reset
const style = document.createElement('style')
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0f0a1e;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #1a1145; }
  ::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FandoraDashboard />
  </React.StrictMode>
)
