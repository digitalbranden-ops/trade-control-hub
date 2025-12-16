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
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { usePositions } from "@/hooks/useBotData";

export function PositionsTable() {
  const { positions, loading, error } = usePositions();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Posições Abertas</h3>
      </div>

      {loading && positions.length === 0 ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error && positions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Aguardando conexão...
        </div>
      ) : positions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Nenhuma posição aberta
        </div>
      ) : (
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
            {positions.map((position) => (
              <TableRow key={position.symbol} className="border-border hover:bg-secondary/50">
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
                  ${position.entry_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-foreground">
                  ${position.current_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-foreground">${position.size.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={cn(
                      "font-semibold",
                      position.pnl >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                    <span className="text-xs ml-1 text-muted-foreground">
                      ({position.pnl_percent >= 0 ? "+" : ""}{position.pnl_percent.toFixed(2)}%)
                    </span>
                  </div>
                  {/* TP indicators */}
                  <div className="flex gap-1 mt-1 justify-end">
                    <span className={cn("text-xs px-1 rounded", position.tp1_hit ? "bg-success/20 text-success" : "bg-muted text-muted-foreground")}>TP1</span>
                    <span className={cn("text-xs px-1 rounded", position.tp2_hit ? "bg-success/20 text-success" : "bg-muted text-muted-foreground")}>TP2</span>
                    <span className={cn("text-xs px-1 rounded", position.tp3_hit ? "bg-success/20 text-success" : "bg-muted text-muted-foreground")}>TP3</span>
                    <span className={cn("text-xs px-1 rounded", position.tp4_hit ? "bg-success/20 text-success" : "bg-muted text-muted-foreground")}>TP4</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
