// Bot API Service - Connects to Python backend at localhost:5000

const API_BASE_URL = 'http://localhost:5000';
const WS_BASE_URL = 'ws://localhost:5000';

// Types
export interface BotStatus {
  symbol: string;
  running: boolean;
  connected: boolean;
  uptime: string;
  current_price: number;
  position: string;
  pnl: number;
  signal: string;
}

export interface GlobalStatus {
  active_pairs: number;
  total_pairs: number;
  running_bots: number;
  connected: boolean;
  pairs: Record<string, BotStatus>;
}

export interface Position {
  symbol: string;
  side: 'LONG' | 'SHORT';
  entry_price: number;
  current_price: number;
  size: number;
  pnl: number;
  pnl_percent: number;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  sl: number;
  tp1_hit: boolean;
  tp2_hit: boolean;
  tp3_hit: boolean;
  tp4_hit: boolean;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  time: string;
  pnl?: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Balance {
  total: number;
  available: number;
  in_positions: number;
  daily_pnl: number;
  daily_pnl_percent: number;
}

export interface Signal {
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number;
  indicators: {
    ema_trend: string;
    magnetic_line: number;
    ha_color: string;
  };
}

export interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  time: string;
}

export interface Metrics {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  average_pnl: number;
  best_trade: number;
  worst_trade: number;
  daily_trades: number;
  open_positions: number;
}

export interface BotConfig {
  tp1_percent: number;
  tp2_percent: number;
  tp3_percent: number;
  tp4_percent: number;
  sl_percent: number;
  trailing_enabled: boolean;
  trailing_percent: number;
  leverage: number;
  position_size: number;
}

// API Functions
export async function getGlobalStatus(): Promise<GlobalStatus> {
  const response = await fetch(`${API_BASE_URL}/api/status`);
  if (!response.ok) throw new Error('Failed to fetch status');
  return response.json();
}

export async function getSymbolStatus(symbol: string): Promise<BotStatus> {
  const response = await fetch(`${API_BASE_URL}/api/status/${encodeURIComponent(symbol)}`);
  if (!response.ok) throw new Error('Failed to fetch symbol status');
  return response.json();
}

export async function getPrice(symbol: string): Promise<{ symbol: string; price: number; change_24h: number }> {
  const response = await fetch(`${API_BASE_URL}/api/price/${encodeURIComponent(symbol)}`);
  if (!response.ok) throw new Error('Failed to fetch price');
  return response.json();
}

export async function getCandles(symbol: string, timeframe = '15m', limit = 100, heikinAshi = false): Promise<Candle[]> {
  const params = new URLSearchParams({ timeframe, limit: String(limit), heikin_ashi: String(heikinAshi) });
  const response = await fetch(`${API_BASE_URL}/api/candles/${encodeURIComponent(symbol)}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch candles');
  return response.json();
}

export async function getSignal(symbol: string): Promise<Signal> {
  const response = await fetch(`${API_BASE_URL}/api/signal/${encodeURIComponent(symbol)}`);
  if (!response.ok) throw new Error('Failed to fetch signal');
  return response.json();
}

export async function getPositions(): Promise<Position[]> {
  const response = await fetch(`${API_BASE_URL}/api/positions`);
  if (!response.ok) throw new Error('Failed to fetch positions');
  return response.json();
}

export async function getPosition(symbol: string): Promise<Position | null> {
  const response = await fetch(`${API_BASE_URL}/api/positions/${encodeURIComponent(symbol)}`);
  if (!response.ok) throw new Error('Failed to fetch position');
  return response.json();
}

export async function getBalance(): Promise<Balance> {
  const response = await fetch(`${API_BASE_URL}/api/balance`);
  if (!response.ok) throw new Error('Failed to fetch balance');
  return response.json();
}

export async function getHistory(limit = 50): Promise<Trade[]> {
  const response = await fetch(`${API_BASE_URL}/api/history?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

export async function getSymbolHistory(symbol: string, limit = 50): Promise<Trade[]> {
  const response = await fetch(`${API_BASE_URL}/api/history/${encodeURIComponent(symbol)}?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch symbol history');
  return response.json();
}

export async function startBot(symbol: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/bot/start/${encodeURIComponent(symbol)}`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to start bot');
  return response.json();
}

export async function stopBot(symbol: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/bot/stop/${encodeURIComponent(symbol)}`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to stop bot');
  return response.json();
}

export async function startAllBots(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/bot/start-all`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to start all bots');
  return response.json();
}

export async function stopAllBots(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/bot/stop-all`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to stop all bots');
  return response.json();
}

export async function getConfig(symbol: string): Promise<BotConfig> {
  const response = await fetch(`${API_BASE_URL}/api/config/${encodeURIComponent(symbol)}`);
  if (!response.ok) throw new Error('Failed to fetch config');
  return response.json();
}

export async function updateConfig(symbol: string, config: Partial<BotConfig>): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/config/${encodeURIComponent(symbol)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to update config');
  return response.json();
}

export async function getLogs(limit = 100): Promise<LogEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/logs?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch logs');
  return response.json();
}

export async function getMetrics(): Promise<Metrics> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
}

// WebSocket Manager
export type WebSocketMessage = {
  type: 'price' | 'signal' | 'position' | 'trade' | 'log' | 'status';
  data: unknown;
};

export type WebSocketCallback = (message: WebSocketMessage) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private callbacks: Set<WebSocketCallback> = new Set();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;
    
    this.isConnecting = true;
    
    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/stream`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.callbacks.forEach(cb => cb(message));
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.scheduleReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 3000);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(callback: WebSocketCallback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();
