import { cn } from "@/lib/utils";
import { Terminal, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

interface LogEntry {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  time: string;
}

const mockLogs: LogEntry[] = [
  { id: "1", type: "success", message: "Ordem de compra executada: BTC/USDT @ $43,250.50", time: "14:32:05" },
  { id: "2", type: "info", message: "Sinal detectado: RSI oversold em ETH/USDT", time: "14:30:18" },
  { id: "3", type: "warning", message: "Stop loss ajustado para BTC/USDT: $42,800.00", time: "14:28:41" },
  { id: "4", type: "error", message: "Falha na conexão com exchange - reconectando...", time: "14:25:12" },
  { id: "5", type: "success", message: "Reconexão bem sucedida", time: "14:25:35" },
  { id: "6", type: "info", message: "Verificando oportunidades de arbitragem...", time: "14:20:00" },
];

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap = {
  info: "text-chart-blue",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

const bgMap = {
  info: "bg-chart-blue/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  error: "bg-destructive/10",
};

export function LogsPanel() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Terminal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Logs do Bot</h3>
      </div>
      <div className="max-h-[280px] overflow-y-auto font-mono text-sm">
        {mockLogs.map((log) => {
          const Icon = iconMap[log.type];
          return (
            <div
              key={log.id}
              className="flex items-start gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
            >
              <div className={cn("p-1.5 rounded-md mt-0.5", bgMap[log.type])}>
                <Icon className={cn("h-3.5 w-3.5", colorMap[log.type])} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground break-words">{log.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
