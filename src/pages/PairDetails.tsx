import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Power, Settings, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MainLayout } from '@/components/layout/MainLayout';
import { TradingChart } from '@/components/charts/TradingChart';
import { useCandleData, useSymbolStatus, useRealtimePrice } from '@/hooks/useBotData';
import { useBotContext } from '@/contexts/BotContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getPosition, type Position } from '@/services/botApi';

const timeframes = ['5m', '15m', '1h', '4h', '1d'];

export default function PairDetails() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [position, setPosition] = useState<Position | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  
  // Strategy settings state
  const [emaPeriod, setEmaPeriod] = useState(9);
  const [smoothing, setSmoothing] = useState(46);
  const [deviationPeriod, setDeviationPeriod] = useState(80);
  const [magneticStrength, setMagneticStrength] = useState(155);
  const [tp1, setTp1] = useState(1.1);
  const [tp2, setTp2] = useState(2.3);
  const [tp3, setTp3] = useState(4.5);
  const [tp4, setTp4] = useState(7.5);
  const [stopLoss, setStopLoss] = useState(1.4);
  const [trailingStop, setTrailingStop] = useState(3.0);
  
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
      <div className="flex flex-col h-full">
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-2.5 w-2.5 rounded-full",
                status?.running ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
              <h1 className="text-lg font-bold text-foreground">{decodedSymbol}</h1>
              
              <span className="text-lg font-mono text-foreground">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Badge 
                variant={change24h >= 0 ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1 text-xs",
                  change24h >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                )}
              >
                {change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timeframe selector */}
            <div className="flex bg-secondary rounded-lg p-0.5">
              {timeframes.map(tf => (
                <Button
                  key={tf}
                  variant={selectedTimeframe === tf ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "px-2.5 py-1 h-7 text-xs",
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
              variant={showIndicators ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowIndicators(!showIndicators)}
            >
              Indicadores
            </Button>

            {/* Settings gear */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 bg-card border-border overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Configurações da Estratégia</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Indicator Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Indicadores</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">EMA Período</Label>
                          <span className="text-xs font-mono text-foreground">{emaPeriod}</span>
                        </div>
                        <Slider
                          value={[emaPeriod]}
                          onValueChange={([v]) => setEmaPeriod(v)}
                          min={3}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">Suavização</Label>
                          <span className="text-xs font-mono text-foreground">{smoothing}</span>
                        </div>
                        <Slider
                          value={[smoothing]}
                          onValueChange={([v]) => setSmoothing(v)}
                          min={10}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">Desvio Período</Label>
                          <span className="text-xs font-mono text-foreground">{deviationPeriod}</span>
                        </div>
                        <Slider
                          value={[deviationPeriod]}
                          onValueChange={([v]) => setDeviationPeriod(v)}
                          min={20}
                          max={200}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">Força Magnética</Label>
                          <span className="text-xs font-mono text-foreground">{magneticStrength}</span>
                        </div>
                        <Slider
                          value={[magneticStrength]}
                          onValueChange={([v]) => setMagneticStrength(v)}
                          min={50}
                          max={300}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Take Profit Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-success">Take Profits</h3>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'TP1', value: tp1, setter: setTp1 },
                        { label: 'TP2', value: tp2, setter: setTp2 },
                        { label: 'TP3', value: tp3, setter: setTp3 },
                        { label: 'TP4', value: tp4, setter: setTp4 },
                      ].map(({ label, value, setter }) => (
                        <div key={label} className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-xs text-muted-foreground">{label}</Label>
                            <span className="text-xs font-mono text-success">{value.toFixed(1)}%</span>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={([v]) => setter(v)}
                            min={0.5}
                            max={15}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Stop Loss Settings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-destructive">Stop Loss</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">Stop Loss</Label>
                          <span className="text-xs font-mono text-destructive">{stopLoss.toFixed(1)}%</span>
                        </div>
                        <Slider
                          value={[stopLoss]}
                          onValueChange={([v]) => setStopLoss(v)}
                          min={0.5}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-xs text-muted-foreground">Trailing Stop</Label>
                          <span className="text-xs font-mono text-warning">{trailingStop.toFixed(1)}%</span>
                        </div>
                        <Slider
                          value={[trailingStop]}
                          onValueChange={([v]) => setTrailingStop(v)}
                          min={1}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Legend */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Legenda do Gráfico</h3>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-0.5 bg-[hsl(142,76%,55%)]" />
                        <span className="text-muted-foreground">EMA Escadinha</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-0.5 bg-[hsl(280,70%,50%)] border-dashed" style={{ borderTopStyle: 'dashed', borderTopWidth: 2 }} />
                        <span className="text-muted-foreground">Linha Magnética</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-success" />
                        <span className="text-muted-foreground">Sinal LONG</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-destructive" />
                        <span className="text-muted-foreground">Sinal SHORT</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Save button */}
                  <Button className="w-full" onClick={() => {}}>
                    Salvar Configurações
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Bot control - Main action */}
            <Button
              variant={status?.running ? "destructive" : "default"}
              size="default"
              onClick={handleToggleBot}
              className={cn(
                "gap-2 px-6 font-medium",
                !status?.running && "bg-success hover:bg-success/90"
              )}
            >
              <Power className="h-4 w-4" />
              {status?.running ? 'Parar Bot' : 'Iniciar Bot'}
            </Button>
          </div>
        </div>

        {/* Chart - Full remaining height */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TradingChart 
              candles={candles} 
              position={position}
              showIndicators={showIndicators}
              className="absolute inset-0"
            />
          )}
          
          {/* Position overlay - Bottom left */}
          {position && (
            <Card className="absolute bottom-4 left-4 bg-card/95 backdrop-blur border-border w-64">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Posição Ativa</span>
                  <Badge 
                    variant={position.side === 'LONG' ? 'default' : 'destructive'}
                    className={cn(
                      "text-xs",
                      position.side === 'LONG' ? "bg-success/20 text-success" : ""
                    )}
                  >
                    {position.side}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Entrada</span>
                    <p className="font-mono">${position.entry_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">PNL</span>
                    <p className={cn(
                      "font-mono font-medium",
                      position.pnl >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {position.pnl >= 0 ? '+' : ''}{position.pnl_percent.toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                {/* TP indicators */}
                <div className="flex gap-1 mt-2">
                  {[
                    { hit: position.tp1_hit, label: 'TP1' },
                    { hit: position.tp2_hit, label: 'TP2' },
                    { hit: position.tp3_hit, label: 'TP3' },
                    { hit: position.tp4_hit, label: 'TP4' },
                  ].map(tp => (
                    <div 
                      key={tp.label}
                      className={cn(
                        "flex-1 text-center py-1 rounded text-[10px] font-medium",
                        tp.hit ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {tp.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
