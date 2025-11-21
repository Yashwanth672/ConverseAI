// ...existing code...
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'remixicon/fonts/remixicon.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('No #root element in index.html')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
)