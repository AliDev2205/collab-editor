export class NetworkSimulator {
    // Simule l'envoi d'un paquet avec latence aléatoire + perte 1%
    static async send<T>(payload: T): Promise<{ data: T | null; latency: number }> {
      const latency = Math.round(100 + Math.random() * 1400) // 100ms à 1500ms
  
      await new Promise((r) => setTimeout(r, latency))
  
      const dropped = Math.random() < 0.01 // 1% de perte
  
      return {
        data: dropped ? null : payload,
        latency,
      }
    }
  
    static randomLatency(): number {
      return Math.round(100 + Math.random() * 1400)
    }
  }