import { MainLayout } from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryTrade {
  id: string;
  date: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
}

const mockHistory: HistoryTrade[] = [
  { id: "1", date: "2024-01-15 14:32", symbol: "BTC/USDT", side: "BUY", entryPrice: 42500, exitPrice: 43200, size: 0.5, pnl: 350, pnlPercent: 1.65 },
  { id: "2", date: "2024-01-15 12:18", symbol: "ETH/USDT", side: "SELL", entryPrice: 2350, exitPrice: 2280, size: 3, pnl: 210, pnlPercent: 2.98 },
  { id: "3", date: "2024-01-15 10:45", symbol: "SOL/USDT", side: "BUY", entryPrice: 95, exitPrice: 92, size: 20, pnl: -60, pnlPercent: -3.16 },
  { id: "4", date: "2024-01-14 22:10", symbol: "BTC/USDT", side: "SELL", entryPrice: 43100, exitPrice: 42800, size: 0.3, pnl: 90, pnlPercent: 0.70 },
  { id: "5", date: "2024-01-14 18:33", symbol: "DOGE/USDT", side: "BUY", entryPrice: 0.082, exitPrice: 0.089, size: 5000, pnl: 35, pnlPercent: 8.54 },
  { id: "6", date: "2024-01-14 15:20", symbol: "BNB/USDT", side: "BUY", entryPrice: 305, exitPrice: 298, size: 2, pnl: -14, pnlPercent: -2.30 },
];

const Historico = () => {
  return (
    <MainLayout>
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico de Trades</h1>
            <p className="text-muted-foreground">Visualize todas as operações realizadas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground">Par</TableHead>
                <TableHead className="text-muted-foreground">Lado</TableHead>
                <TableHead className="text-muted-foreground text-right">Entrada</TableHead>
                <TableHead className="text-muted-foreground text-right">Saída</TableHead>
                <TableHead className="text-muted-foreground text-right">Tamanho</TableHead>
                <TableHead className="text-muted-foreground text-right">PNL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistory.map((trade) => (
                <TableRow key={trade.id} className="border-border hover:bg-secondary/50">
                  <TableCell className="text-muted-foreground text-sm">{trade.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-semibold",
                        trade.side === "BUY"
                          ? "border-success text-success bg-success/10"
                          : "border-destructive text-destructive bg-destructive/10"
                      )}
                    >
                      {trade.side === "BUY" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {trade.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    ${trade.entryPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    ${trade.exitPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-foreground">{trade.size}</TableCell>
                  <TableCell className="text-right">
                    <div
                      className={cn(
                        "font-semibold",
                        trade.pnl >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                      <span className="text-xs ml-1 text-muted-foreground">
                        ({trade.pnlPercent >= 0 ? "+" : ""}{trade.pnlPercent.toFixed(2)}%)
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Historico;
