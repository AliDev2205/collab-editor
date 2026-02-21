import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// StrictMode retiré — il cause des doubles montages qui crashent
// la SimulationEngine (timers dupliqués + conflits DOM)
createRoot(document.getElementById('root')!).render(
  <App />
)