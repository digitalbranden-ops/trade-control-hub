import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getGlobalStatus,
  startBot,
  stopBot,
  startAllBots,
  stopAllBots,
  wsManager,
  type GlobalStatus,
  type WebSocketMessage,
} from '@/services/botApi';

interface BotContextType {
  globalStatus: GlobalStatus | null;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  toggleBot: (symbol: string, running: boolean) => Promise<void>;
  toggleAllBots: (running: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export function BotProvider({ children }: { children: ReactNode }) {
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getGlobalStatus();
      setGlobalStatus(data);
      setIsConnected(data.connected);
      setError(null);
    } catch (e) {
      setError('Falha ao conectar com o bot. Verifique se o server.py está rodando.');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    // Connect WebSocket
    wsManager.connect();
    
    const unsubscribe = wsManager.subscribe((message: WebSocketMessage) => {
      if (message.type === 'status') {
        const data = message.data as GlobalStatus;
        setGlobalStatus(data);
        setIsConnected(data.connected);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchStatus]);

  const toggleBot = useCallback(async (symbol: string, running: boolean) => {
    try {
      if (running) {
        await stopBot(symbol);
      } else {
        await startBot(symbol);
      }
      await fetchStatus();
    } catch (e) {
      console.error('Failed to toggle bot:', e);
    }
  }, [fetchStatus]);

  const toggleAllBots = useCallback(async (running: boolean) => {
    try {
      if (running) {
        await stopAllBots();
      } else {
        await startAllBots();
      }
      await fetchStatus();
    } catch (e) {
      console.error('Failed to toggle all bots:', e);
    }
  }, [fetchStatus]);

  return (
    <BotContext.Provider
      value={{
        globalStatus,
        selectedSymbol,
        setSelectedSymbol,
        isConnected,
        isLoading,
        error,
        toggleBot,
        toggleAllBots,
        refetch: fetchStatus,
      }}
    >
      {children}
    </BotContext.Provider>
  );
}

export function useBotContext() {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBotContext must be used within a BotProvider');
  }
  return context;
}
