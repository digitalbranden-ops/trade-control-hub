import { useState, useEffect, useCallback } from 'react';
import {
  getGlobalStatus,
  getSymbolStatus,
  getCandles,
  getPositions,
  getBalance,
  getHistory,
  getLogs,
  getMetrics,
  startBot,
  stopBot,
  wsManager,
  type GlobalStatus,
  type BotStatus,
  type Candle,
  type Position,
  type Balance,
  type Trade,
  type LogEntry,
  type Metrics,
  type WebSocketMessage,
} from '@/services/botApi';

// Hook for global bot status
export function useBotStatus() {
  const [status, setStatus] = useState<GlobalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getGlobalStatus();
      setStatus(data);
      setError(null);
    } catch (e) {
      setError('Falha ao conectar com o bot');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}

// Hook for single symbol status
export function useSymbolStatus(symbol: string) {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!symbol) return;
    try {
      const data = await getSymbolStatus(symbol);
      setStatus(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar status');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}

// Hook for real-time price via WebSocket
export function useRealtimePrice(symbol: string) {
  const [price, setPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);

  useEffect(() => {
    wsManager.connect();
    
    const unsubscribe = wsManager.subscribe((message: WebSocketMessage) => {
      if (message.type === 'price') {
        const data = message.data as { symbol: string; price: number; change_24h: number };
        if (data.symbol === symbol) {
          setPrice(data.price);
          setChange24h(data.change_24h);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [symbol]);

  return { price, change24h };
}

// Hook for candle data
export function useCandleData(symbol: string, timeframe = '15m', heikinAshi = false) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandles = useCallback(async () => {
    if (!symbol) return;
    try {
      const data = await getCandles(symbol, timeframe, 100, heikinAshi);
      setCandles(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar candles');
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe, heikinAshi]);

  useEffect(() => {
    fetchCandles();
    const interval = setInterval(fetchCandles, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [fetchCandles]);

  return { candles, loading, error, refetch: fetchCandles };
}

// Hook for positions
export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    try {
      const data = await getPositions();
      setPositions(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar posições');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 3000);
    
    // Also listen for WebSocket updates
    wsManager.connect();
    const unsubscribe = wsManager.subscribe((message: WebSocketMessage) => {
      if (message.type === 'position') {
        fetchPositions();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchPositions]);

  return { positions, loading, error, refetch: fetchPositions };
}

// Hook for balance
export function useBalance() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await getBalance();
      setBalance(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar saldo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

// Hook for trade history
export function useTradeHistory(limit = 50) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = useCallback(async () => {
    try {
      const data = await getHistory(limit);
      setTrades(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar histórico');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTrades();
    
    // Listen for new trades via WebSocket
    wsManager.connect();
    const unsubscribe = wsManager.subscribe((message: WebSocketMessage) => {
      if (message.type === 'trade') {
        fetchTrades();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchTrades]);

  return { trades, loading, error, refetch: fetchTrades };
}

// Hook for logs
export function useLogs(limit = 100) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const data = await getLogs(limit);
      setLogs(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar logs');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
    
    // Listen for new logs via WebSocket
    wsManager.connect();
    const unsubscribe = wsManager.subscribe((message: WebSocketMessage) => {
      if (message.type === 'log') {
        const newLog = message.data as LogEntry;
        setLogs(prev => [newLog, ...prev].slice(0, limit));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchLogs, limit]);

  return { logs, loading, error, refetch: fetchLogs };
}

// Hook for metrics
export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
      setError(null);
    } catch (e) {
      setError('Falha ao buscar métricas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

// Hook for bot control
export function useBotControl(symbol: string) {
  const [isToggling, setIsToggling] = useState(false);

  const toggle = useCallback(async (running: boolean) => {
    setIsToggling(true);
    try {
      if (running) {
        await stopBot(symbol);
      } else {
        await startBot(symbol);
      }
    } catch (e) {
      console.error('Failed to toggle bot:', e);
    } finally {
      setIsToggling(false);
    }
  }, [symbol]);

  return { toggle, isToggling };
}

// Hook for WebSocket connection status
export function useWebSocketStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    wsManager.connect();
    
    const checkConnection = () => {
      setIsConnected(wsManager.isConnected);
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return isConnected;
}
