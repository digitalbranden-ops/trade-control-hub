import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  TrendingDown, 
  Power, 
  Settings, 
  Target,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  Zap,
  DollarSign,
  BarChart3,
  Clock,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Este é um MOCKUP/ESBOÇO do painel de trade ideal
export default function TradePanelMockup() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [botRunning, setBotRunning] = useState(true);
  const [tp1, setTp1] = useState([1.1]);
  const [tp2, setTp2] = useState([2.3]);
  const [tp3, setTp3] = useState([4.5]);
  const [tp4, setTp4] = useState([7.5]);
  const [sl, setSl] = useState([1.4]);
  const [trailing, setTrailing] = useState([3.0]);
  const [leverage, setLeverage] = useState([10]);
  const [positionSize, setPositionSize] = useState([5]);

  const pairs = [
    { symbol: "BTC/USDT", price: 104520.00, change: 2.34, signal: "LONG", running: true },
    { symbol: "ETH/USDT", price: 3892.50, change: -1.12, signal: null, running: true },
    { symbol: "SOL/USDT", price: 187.30, change: 5.67, signal: "LONG", running: false },
    { symbol: "XRP/USDT", price: 2.34, change: -0.45, signal: null, running: true },
    { symbol: "DOGE/USDT", price: 0.412, change: 3.21, signal: "SHORT", running: true },
  ];

  const currentPair = pairs.find(p => p.symbol === selectedPair) || pairs[0];

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Painel Esquerdo - Lista de Pares */}
        <div className="w-64 border-r border-border bg-card/50 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-foreground">Pares Ativos</h2>
            <Badge variant="outline" className="text-xs">5/5</Badge>
          </div>
          
          <div className="space-y-2 flex-1 overflow-auto">
            {pairs.map(pair => (
              <div
                key={pair.symbol}
                onClick={() => setSelectedPair(pair.symbol)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all border",
                  selectedPair === pair.symbol 
                    ? "bg-primary/10 border-primary" 
                    : "bg-secondary/50 border-transparent hover:bg-secondary"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      pair.running ? "bg-success animate-pulse" : "bg-muted-foreground"
                    )} />
                    <span className="font-medium text-sm">{pair.symbol}</span>
                  </div>
                  {pair.signal && (
                    <Badge 
                      variant={pair.signal === "LONG" ? "default" : "destructive"}
                      className="text-xs px-1.5 py-0"
                    >
                      {pair.signal}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">
                    ${pair.price.toLocaleString()}
                  </span>
                  <span className={cn(
                    "font-mono",
                    pair.change >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {pair.change >= 0 ? "+" : ""}{pair.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Controles Globais */}
          <div className="pt-4 border-t border-border space-y-3">
            <Button 
              className="w-full gap-2" 
              variant={botRunning ? "destructive" : "default"}
              onClick={() => setBotRunning(!botRunning)}
            >
              <Power className="h-4 w-4" />
              {botRunning ? "Parar Todos" : "Iniciar Todos"}
            </Button>
          </div>
        </div>

        {/* Centro - Gráfico Principal */}
        <div className="flex-1 flex flex-col">
          {/* Header do Gráfico */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  currentPair.running ? "bg-success animate-pulse" : "bg-muted-foreground"
                )} />
                <h1 className="text-2xl font-bold">{selectedPair}</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-bold">
                  ${currentPair.price.toLocaleString()}
                </span>
                <Badge 
                  className={cn(
                    "flex items-center gap-1",
                    currentPair.change >= 0 
                      ? "bg-success/20 text-success border-success/30" 
                      : "bg-destructive/20 text-destructive border-destructive/30"
                  )}
                >
                  {currentPair.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {currentPair.change >= 0 ? "+" : ""}{currentPair.change}%
                </Badge>
              </div>

              {currentPair.signal && (
                <Badge 
                  variant={currentPair.signal === "LONG" ? "default" : "destructive"}
                  className={cn(
                    "text-sm px-3 py-1 gap-1",
                    currentPair.signal === "LONG" 
                      ? "bg-success text-success-foreground" 
                      : "bg-destructive text-destructive-foreground"
                  )}
                >
                  {currentPair.signal === "LONG" 
                    ? <ArrowUpCircle className="h-4 w-4" /> 
                    : <ArrowDownCircle className="h-4 w-4" />
                  }
                  SINAL {currentPair.signal}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Timeframes */}
              <div className="flex bg-secondary rounded-lg p-1 mr-4">
                {["5m", "15m", "1h", "4h", "1d"].map(tf => (
                  <Button
                    key={tf}
                    variant={tf === "15m" ? "default" : "ghost"}
                    size="sm"
                    className="px-3 py-1 text-xs h-7"
                  >
                    {tf}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="sm" className="gap-1">
                <Activity className="h-4 w-4" />
                Indicadores
              </Button>
              
              <Button 
                variant={currentPair.running ? "destructive" : "default"} 
                size="sm" 
                className="gap-1"
              >
                <Power className="h-4 w-4" />
                {currentPair.running ? "Parar" : "Iniciar"}
              </Button>
            </div>
          </div>

          {/* Área do Gráfico (Mockup) */}
          <div className="flex-1 relative bg-background p-4">
            {/* Simulação visual do gráfico */}
            <div className="h-full border border-border rounded-lg bg-card/20 relative overflow-hidden">
              {/* Grid do gráfico */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute w-full border-t border-border" style={{ top: `${i * 10}%` }} />
                ))}
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="absolute h-full border-l border-border" style={{ left: `${i * 7}%` }} />
                ))}
              </div>

              {/* Candlesticks mockup */}
              <div className="absolute bottom-[30%] left-[5%] right-[5%] h-[50%] flex items-end gap-1">
                {[40, 45, 42, 50, 55, 48, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80, 78, 85, 82, 88, 85, 90, 87, 92, 88, 95].map((h, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 rounded-sm",
                      i % 3 === 0 ? "bg-destructive" : "bg-success"
                    )}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              {/* EMA Line (verde) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path 
                  d="M 50 400 Q 150 380, 250 350 T 450 300 T 650 250 T 850 220 T 1050 180" 
                  fill="none" 
                  stroke="hsl(142, 76%, 55%)" 
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
              </svg>

              {/* Linha Magnética (roxa tracejada) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path 
                  d="M 50 420 Q 150 400, 250 380 T 450 340 T 650 300 T 850 270 T 1050 240" 
                  fill="none" 
                  stroke="hsl(280, 70%, 50%)" 
                  strokeWidth="2"
                  strokeDasharray="8,4"
                />
              </svg>

              {/* Linhas de TP e SL */}
              <div className="absolute right-4 top-[15%] text-xs font-mono text-success flex items-center gap-2">
                <div className="w-20 h-px bg-success" style={{ boxShadow: '0 0 10px hsl(142, 76%, 55%)' }} />
                TP4 (7.5%)
              </div>
              <div className="absolute right-4 top-[22%] text-xs font-mono text-success flex items-center gap-2">
                <div className="w-20 h-px bg-success/70" />
                TP3 (4.5%)
              </div>
              <div className="absolute right-4 top-[29%] text-xs font-mono text-success flex items-center gap-2">
                <div className="w-20 h-px bg-success/50" />
                TP2 (2.3%)
              </div>
              <div className="absolute right-4 top-[36%] text-xs font-mono text-success flex items-center gap-2">
                <div className="w-20 h-px bg-success/30" />
                TP1 (1.1%)
              </div>
              <div className="absolute right-4 top-[45%] text-xs font-mono text-primary flex items-center gap-2">
                <div className="w-20 h-px bg-primary" style={{ boxShadow: '0 0 10px hsl(var(--primary))' }} />
                ENTRADA
              </div>
              <div className="absolute right-4 top-[55%] text-xs font-mono text-destructive flex items-center gap-2">
                <div className="w-20 h-px bg-destructive" />
                SL (1.4%)
              </div>

              {/* Marcadores de sinal */}
              <div className="absolute left-[60%] top-[40%] transform -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <ArrowUpCircle className="h-8 w-8 text-success drop-shadow-lg animate-bounce" />
                  <span className="text-xs text-success font-bold mt-1">LONG</span>
                </div>
              </div>

              {/* Legenda no canto */}
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-[hsl(142,76%,55%)]" />
                  <span className="text-muted-foreground">EMA Escadinha</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-[hsl(280,70%,50%)]" style={{ borderStyle: 'dashed' }} />
                  <span className="text-muted-foreground">Linha Magnética</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito - Controles */}
        <div className="w-80 border-l border-border bg-card/50 p-4 flex flex-col gap-4 overflow-auto">
          {/* Posição Atual */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Posição Aberta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lado</span>
                <Badge className="bg-success/20 text-success">LONG</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Entrada</span>
                <span className="font-mono text-sm">$102,340.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tamanho</span>
                <span className="font-mono text-sm">0.05 BTC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">PNL</span>
                <span className="font-mono text-sm text-success font-bold">
                  +$218.00 (+2.13%)
                </span>
              </div>

              {/* TPs Status */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Take Profits Atingidos</p>
                <div className="grid grid-cols-4 gap-1">
                  <div className="text-center p-1.5 rounded text-xs bg-success/20 text-success">TP1 ✓</div>
                  <div className="text-center p-1.5 rounded text-xs bg-success/20 text-success">TP2 ✓</div>
                  <div className="text-center p-1.5 rounded text-xs bg-secondary text-muted-foreground">TP3</div>
                  <div className="text-center p-1.5 rounded text-xs bg-secondary text-muted-foreground">TP4</div>
                </div>
              </div>

              <Button variant="destructive" size="sm" className="w-full gap-2 mt-2">
                <XCircle className="h-4 w-4" />
                Fechar Posição
              </Button>
            </CardContent>
          </Card>

          {/* Configurações de TP/SL */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Take Profit & Stop Loss
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TP1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-success">TP1</Label>
                  <span className="text-xs font-mono text-success">{tp1[0]}%</span>
                </div>
                <Slider value={tp1} onValueChange={setTp1} max={5} step={0.1} className="[&>span]:bg-success" />
              </div>

              {/* TP2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-success">TP2</Label>
                  <span className="text-xs font-mono text-success">{tp2[0]}%</span>
                </div>
                <Slider value={tp2} onValueChange={setTp2} max={10} step={0.1} className="[&>span]:bg-success" />
              </div>

              {/* TP3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-success">TP3</Label>
                  <span className="text-xs font-mono text-success">{tp3[0]}%</span>
                </div>
                <Slider value={tp3} onValueChange={setTp3} max={15} step={0.1} className="[&>span]:bg-success" />
              </div>

              {/* TP4 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-success">TP4</Label>
                  <span className="text-xs font-mono text-success">{tp4[0]}%</span>
                </div>
                <Slider value={tp4} onValueChange={setTp4} max={20} step={0.1} className="[&>span]:bg-success" />
              </div>

              <div className="border-t border-border pt-4">
                {/* Stop Loss */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Stop Loss
                    </Label>
                    <span className="text-xs font-mono text-destructive">{sl[0]}%</span>
                  </div>
                  <Slider value={sl} onValueChange={setSl} max={10} step={0.1} className="[&>span]:bg-destructive" />
                </div>

                {/* Trailing Stop */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-warning flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Trailing Stop
                    </Label>
                    <span className="text-xs font-mono text-warning">{trailing[0]}%</span>
                  </div>
                  <Slider value={trailing} onValueChange={setTrailing} max={10} step={0.1} className="[&>span]:bg-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Posição */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Tamanho da Posição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Tamanho (%)</Label>
                  <span className="text-xs font-mono">{positionSize[0]}%</span>
                </div>
                <Slider value={positionSize} onValueChange={setPositionSize} max={100} step={1} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Alavancagem
                  </Label>
                  <span className="text-xs font-mono">{leverage[0]}x</span>
                </div>
                <Slider value={leverage} onValueChange={setLeverage} max={50} step={1} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-xs">Modo Automático</Label>
                  <p className="text-xs text-muted-foreground">Entrar automaticamente</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Estatísticas do Par
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trades Hoje</span>
                <span className="font-mono">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-mono text-success">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PNL Diário</span>
                <span className="font-mono text-success">+$542.30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Melhor Trade</span>
                <span className="font-mono text-success">+$180.00</span>
              </div>
            </CardContent>
          </Card>

          {/* Logs Recentes */}
          <Card className="bg-card border-border flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Logs Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-success">
                  <span className="text-muted-foreground shrink-0">14:32:15</span>
                  <span>TP2 atingido - Fechando 25%</span>
                </div>
                <div className="flex items-start gap-2 text-success">
                  <span className="text-muted-foreground shrink-0">14:28:44</span>
                  <span>TP1 atingido - Fechando 25%</span>
                </div>
                <div className="flex items-start gap-2 text-primary">
                  <span className="text-muted-foreground shrink-0">14:25:10</span>
                  <span>Posição aberta - LONG $102,340</span>
                </div>
                <div className="flex items-start gap-2 text-warning">
                  <span className="text-muted-foreground shrink-0">14:25:08</span>
                  <span>Sinal LONG detectado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
