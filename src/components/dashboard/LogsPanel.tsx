import { cn } from "@/lib/utils";
import { Terminal, AlertTriangle, CheckCircle2, Info, XCircle, Loader2 } from "lucide-react";
import { useLogs } from "@/hooks/useBotData";

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
  const { logs, loading, error } = useLogs(50);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Terminal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Logs do Bot</h3>
      </div>

      {loading && logs.length === 0 ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error && logs.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground font-mono text-sm">
          Aguardando conexão com o bot...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground font-mono text-sm">
          Nenhum log disponível
        </div>
      ) : (
        <div className="max-h-[280px] overflow-y-auto font-mono text-sm">
          {logs.map((log) => {
            const Icon = iconMap[log.type] || Info;
            const colorClass = colorMap[log.type] || "text-muted-foreground";
            const bgClass = bgMap[log.type] || "bg-muted/10";

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
              >
                <div className={cn("p-1.5 rounded-md mt-0.5", bgClass)}>
                  <Icon className={cn("h-3.5 w-3.5", colorClass)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground break-words">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
