import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Clock, Loader2 } from "lucide-react";
import { useTradeHistory } from "@/hooks/useBotData";

export function TradeHistory() {
  const { trades, loading, error } = useTradeHistory(10);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Histórico de Trades</h3>
      </div>

      {loading && trades.length === 0 ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error && trades.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Aguardando conexão...
        </div>
      ) : trades.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Nenhum trade realizado
        </div>
      ) : (
        <div className="max-h-[320px] overflow-y-auto">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    trade.side === "BUY" ? "bg-success/10" : "bg-destructive/10"
                  )}
                >
                  {trade.side === "BUY" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{trade.symbol}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {trade.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">${trade.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {trade.amount} @ ${trade.price.toLocaleString()}
                </p>
                {trade.pnl !== undefined && (
                  <p className={cn(
                    "text-xs font-medium",
                    trade.pnl >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
