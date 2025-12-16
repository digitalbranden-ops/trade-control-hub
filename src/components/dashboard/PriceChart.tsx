import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useCandleData, useRealtimePrice } from "@/hooks/useBotData";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  symbol: string;
}

const timeframes = ["15m", "1h", "4h", "1d"] as const;

export function PriceChart({ symbol }: PriceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("15m");
  const { candles, loading, error } = useCandleData(symbol, selectedTimeframe);
  const { price: realtimePrice, change24h } = useRealtimePrice(symbol);

  // Transform candles to chart data
  const chartData = candles.map((c) => ({
    time: c.time,
    price: c.close,
  }));

  const currentPrice = realtimePrice || (candles.length > 0 ? candles[candles.length - 1].close : 0);
  const firstPrice = candles.length > 0 ? candles[0].close : currentPrice;
  const priceChange = firstPrice > 0 ? ((currentPrice - firstPrice) / firstPrice) * 100 : change24h;
  const isPositive = priceChange >= 0;

  if (loading && candles.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 h-[340px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && candles.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 h-[340px] flex items-center justify-center">
        <p className="text-muted-foreground">Aguardando conexão com o bot...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{symbol}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-foreground">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                selectedTimeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "hsl(142 76% 45%)" : "hsl(0 84% 60%)"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isPositive ? "hsl(142 76% 45%)" : "hsl(0 84% 60%)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={["dataMin - 50", "dataMax + 50"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 10%)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "8px",
                color: "hsl(210 40% 98%)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Preço"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "hsl(142 76% 45%)" : "hsl(0 84% 60%)"}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
