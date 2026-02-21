import { useEffect, useRef } from 'react'
import { SimulationEngine } from '../simulation/SimulationEngine'
import { useUsersStore } from '../store/slices/usersSlice'

export function useSimulation() {
  const engineRef = useRef<SimulationEngine | null>(null)
  const startedRef = useRef(false)
  const users = useUsersStore((s) => s.users)

  useEffect(() => {
    // Garde contre double montage (StrictMode ou HMR)
    if (startedRef.current) return
    startedRef.current = true

    const engine = new SimulationEngine()
    engineRef.current = engine
    engine.start(users)

    return () => {
      engine.stop()
      startedRef.current = false
    }
  }, [])

  return {
    stop: () => engineRef.current?.stop(),
    start: () => {
      if (engineRef.current && !engineRef.current.isRunning()) {
        engineRef.current.start(users)
      }
    },
  }
}