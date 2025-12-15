import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  price: number;
  amount: number;
  total: number;
  time: string;
}

const mockTrades: Trade[] = [
  { id: "1", symbol: "BTC/USDT", side: "BUY", price: 43250.50, amount: 0.25, total: 10812.63, time: "14:32:05" },
  { id: "2", symbol: "ETH/USDT", side: "SELL", price: 2295.80, amount: 1.5, total: 3443.70, time: "14:28:12" },
  { id: "3", symbol: "SOL/USDT", side: "BUY", price: 98.45, amount: 15, total: 1476.75, time: "14:15:33" },
  { id: "4", symbol: "BTC/USDT", side: "SELL", price: 43180.20, amount: 0.1, total: 4318.02, time: "13:58:41" },
  { id: "5", symbol: "ETH/USDT", side: "BUY", price: 2280.00, amount: 2.5, total: 5700.00, time: "13:45:18" },
];

export function TradeHistory() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Histórico de Trades</h3>
      </div>
      <div className="max-h-[320px] overflow-y-auto">
        {mockTrades.map((trade) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
