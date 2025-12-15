import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const mockData = [
  { time: "00:00", price: 42800 },
  { time: "02:00", price: 42650 },
  { time: "04:00", price: 43100 },
  { time: "06:00", price: 43400 },
  { time: "08:00", price: 43250 },
  { time: "10:00", price: 43800 },
  { time: "12:00", price: 44200 },
  { time: "14:00", price: 44050 },
  { time: "16:00", price: 44500 },
  { time: "18:00", price: 44300 },
  { time: "20:00", price: 44650 },
  { time: "22:00", price: 44120 },
];

const priceChange = ((mockData[mockData.length - 1].price - mockData[0].price) / mockData[0].price) * 100;
const isPositive = priceChange >= 0;

export function PriceChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">BTC/USDT</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-foreground">
              ${mockData[mockData.length - 1].price.toLocaleString()}
            </span>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-success" : "text-destructive"
              }`}
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
          {["1H", "4H", "1D", "1W"].map((tf) => (
            <button
              key={tf}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors first:bg-primary first:text-primary-foreground"
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 76% 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142 76% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
            />
            <YAxis
              domain={["dataMin - 200", "dataMax + 200"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
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
              stroke="hsl(142 76% 45%)"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
