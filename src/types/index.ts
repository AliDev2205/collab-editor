// ============ USERS ============
export interface User {
    id: string
    name: string
    color: string
    isTyping: boolean
    operationCount: number
    cursorPosition: number
  }
  
  // ============ OPERATIONS ============
  export type OperationType = 'insert' | 'delete'
  
  export interface InsertOperation {
    type: 'insert'
    position: number
    text: string
    userId: string
  }
  
  export interface DeleteOperation {
    type: 'delete'
    position: number
    length: number
    userId: string
  }
  
  export type Operation = InsertOperation | DeleteOperation
  
  // ============ LOGS ============
  export interface LogEntry {
    id: string
    timestamp: number
    userId: string
    userName: string
    color: string
    action: string
  }
  
  // ============ CHAT ============
  export interface ChatMessage {
    id: string
    userId: string
    userName: string
    color: string
    text: string
    timestamp: number
  }
  
  // ============ SYNC ============
  export type SyncStatus = 'connected' | 'syncing' | 'disconnected'
  
  // ============ STATS ============
  export interface SystemStats {
    charCount: number
    lineCount: number
    latency: number
    status: SyncStatus
  }