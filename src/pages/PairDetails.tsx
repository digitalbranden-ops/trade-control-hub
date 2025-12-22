import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Power, TrendingUp, TrendingDown, Target, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MainLayout } from '@/components/layout/MainLayout';
import { TradingChart } from '@/components/charts/TradingChart';
import { useCandleData, useSymbolStatus, useRealtimePrice } from '@/hooks/useBotData';
import { useBotContext } from '@/contexts/BotContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { getPosition, type Position } from '@/services/botApi';
import { useEffect } from 'react';

const timeframes = ['5m', '15m', '1h', '4h', '1d'];

export default function PairDetails() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [position, setPosition] = useState<Position | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  
  const decodedSymbol = symbol ? decodeURIComponent(symbol).replace('-', '/') : '';
  
  const { candles, loading: candlesLoading } = useCandleData(decodedSymbol, selectedTimeframe);
  const { status, loading: statusLoading } = useSymbolStatus(decodedSymbol);
  const { price, change24h } = useRealtimePrice(decodedSymbol);
  const { toggleBot } = useBotContext();

  // Fetch position
  useEffect(() => {
    async function fetchPosition() {
      if (!decodedSymbol) return;
      try {
        const pos = await getPosition(decodedSymbol);
        setPosition(pos);
      } catch {
        setPosition(null);
      }
    }
    fetchPosition();
    const interval = setInterval(fetchPosition, 3000);
    return () => clearInterval(interval);
  }, [decodedSymbol]);

  const currentPrice = price || status?.current_price || 0;
  const isLoading = candlesLoading || statusLoading;

  const handleToggleBot = () => {
    if (status) {
      toggleBot(decodedSymbol, status.running);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-3 w-3 rounded-full",
                status?.running ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
              <h1 className="text-2xl font-bold text-foreground">{decodedSymbol}</h1>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-xl font-mono text-foreground">
                  ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <Badge 
                  variant={change24h >= 0 ? "default" : "destructive"}
                  className={cn(
                    "flex items-center gap-1",
                    change24h >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  )}
                >
                  {change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timeframe selector */}
            <div className="flex bg-secondary rounded-lg p-1">
              {timeframes.map(tf => (
                <Button
                  key={tf}
                  variant={selectedTimeframe === tf ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "px-3 py-1 text-xs",
                    selectedTimeframe === tf && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setSelectedTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>

            {/* Toggle indicators */}
            <Button
              variant={showIndicators ? "default" : "outline"}
              size="sm"
              onClick={() => setShowIndicators(!showIndicators)}
            >
              Indicadores
            </Button>

            {/* Bot control */}
            <Button
              variant={status?.running ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleBot}
              className="gap-2"
            >
              <Power className="h-4 w-4" />
              {status?.running ? 'Parar Bot' : 'Iniciar Bot'}
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 gap-4 min-h-0">
          {/* Chart */}
          <Card className="flex-1 bg-card border-border overflow-hidden">
            <CardContent className="p-0 h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <TradingChart 
                  candles={candles} 
                  position={position}
                  showIndicators={showIndicators}
                  className="h-full"
                />
              )}
            </CardContent>
          </Card>

          {/* Side panel */}
          <div className="w-80 flex flex-col gap-4">
            {/* Position Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Posição Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                {position ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Lado</span>
                      <Badge variant={position.side === 'LONG' ? 'default' : 'destructive'}>
                        {position.side}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Entrada</span>
                      <span className="font-mono text-sm">${position.entry_price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tamanho</span>
                      <span className="font-mono text-sm">{position.size}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">PNL</span>
                      <span className={cn(
                        "font-mono text-sm font-medium",
                        position.pnl >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)} ({position.pnl_percent.toFixed(2)}%)
                      </span>
                    </div>

                    {/* TPs status */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Take Profits</p>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: 'TP1', hit: position.tp1_hit, value: position.tp1 },
                          { label: 'TP2', hit: position.tp2_hit, value: position.tp2 },
                          { label: 'TP3', hit: position.tp3_hit, value: position.tp3 },
                          { label: 'TP4', hit: position.tp4_hit, value: position.tp4 },
                        ].map(tp => (
                          <div 
                            key={tp.label}
                            className={cn(
                              "text-center p-1.5 rounded text-xs",
                              tp.hit ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"
                            )}
                          >
                            {tp.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SL */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Stop Loss
                      </span>
                      <span className="font-mono">${position.sl.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma posição aberta
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Strategy Info */}
            <Card className="bg-card border-border flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Estratégia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">EMA Período</span>
                  <span className="font-mono">9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Suavização</span>
                  <span className="font-mono">46</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Desvio Período</span>
                  <span className="font-mono">80</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Força Magnética</span>
                  <span className="font-mono">155</span>
                </div>
                
                <div className="pt-2 border-t border-border mt-2">
                  <p className="text-muted-foreground mb-2">Take Profits</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-success">TP1</span>
                      <span className="font-mono">1.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-success">TP2</span>
                      <span className="font-mono">2.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-success">TP3</span>
                      <span className="font-mono">4.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-success">TP4</span>
                      <span className="font-mono">7.5%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-destructive">Stop Loss</span>
                    <span className="font-mono">1.4%</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-warning">Trailing</span>
                    <span className="font-mono">3.0%</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="pt-2 border-t border-border mt-2">
                  <p className="text-muted-foreground mb-2">Legenda</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-[hsl(142,76%,55%)]" />
                      <span>EMA Escadinha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-[hsl(280,70%,50%)] border-dashed border-t" style={{ borderStyle: 'dashed' }} />
                      <span>Linha Magnética</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-success" />
                      <span>Sinal LONG</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-destructive" />
                      <span>Sinal SHORT</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
