import { Power, Activity, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BotStatusProps {
  symbol: string;
  isRunning: boolean;
  isConnected: boolean;
  uptime: string;
  onToggle: () => void;
}

export function BotStatus({ symbol, isRunning, isConnected, uptime, onToggle }: BotStatusProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Status do Bot</h3>
          <p className="text-sm text-muted-foreground">{symbol}</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-success" />
          ) : (
            <WifiOff className="h-4 w-4 text-destructive" />
          )}
          <span className={cn(
            "text-xs font-medium",
            isConnected ? "text-success" : "text-destructive"
          )}>
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button
          onClick={onToggle}
          size="lg"
          disabled={!isConnected}
          className={cn(
            "h-20 w-20 rounded-full transition-all duration-300",
            isRunning
              ? "bg-success hover:bg-success/90 glow-green"
              : "bg-secondary hover:bg-secondary/90"
          )}
        >
          <Power className={cn("h-8 w-8", isRunning ? "text-white" : "text-muted-foreground")} />
        </Button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                isRunning ? "bg-success animate-pulse" : "bg-muted-foreground"
              )}
            />
            <span className="text-foreground font-medium">
              {isRunning ? "Bot Ativo" : "Bot Inativo"}
            </span>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Activity className="h-4 w-4" />
              <span>Uptime: {uptime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
