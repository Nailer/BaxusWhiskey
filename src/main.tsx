import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import DrinkSearch from './Integration'
// import DrinkSearchh from './APIntegration.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DrinkSearch />
  </StrictMode>,
)
