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
import { TrendingUp, TrendingDown } from "lucide-react";

interface Position {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
}

const mockPositions: Position[] = [
  { id: "1", symbol: "BTC/USDT", side: "LONG", entryPrice: 43250.50, currentPrice: 44120.30, size: 0.5, pnl: 434.90, pnlPercent: 2.01 },
  { id: "2", symbol: "ETH/USDT", side: "SHORT", entryPrice: 2280.00, currentPrice: 2310.50, size: 2.5, pnl: -76.25, pnlPercent: -1.34 },
  { id: "3", symbol: "SOL/USDT", side: "LONG", entryPrice: 98.45, currentPrice: 102.80, size: 25, pnl: 108.75, pnlPercent: 4.42 },
];

export function PositionsTable() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Posições Abertas</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Par</TableHead>
            <TableHead className="text-muted-foreground">Lado</TableHead>
            <TableHead className="text-muted-foreground text-right">Entrada</TableHead>
            <TableHead className="text-muted-foreground text-right">Atual</TableHead>
            <TableHead className="text-muted-foreground text-right">Tamanho</TableHead>
            <TableHead className="text-muted-foreground text-right">PNL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPositions.map((position) => (
            <TableRow key={position.id} className="border-border hover:bg-secondary/50">
              <TableCell className="font-medium text-foreground">{position.symbol}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-semibold",
                    position.side === "LONG"
                      ? "border-success text-success bg-success/10"
                      : "border-destructive text-destructive bg-destructive/10"
                  )}
                >
                  {position.side === "LONG" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {position.side}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-foreground">
                ${position.entryPrice.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-foreground">
                ${position.currentPrice.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-foreground">{position.size}</TableCell>
              <TableCell className="text-right">
                <div
                  className={cn(
                    "font-semibold",
                    position.pnl >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                  <span className="text-xs ml-1 text-muted-foreground">
                    ({position.pnlPercent >= 0 ? "+" : ""}{position.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
