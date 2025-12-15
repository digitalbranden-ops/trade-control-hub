import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Percent } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { month: "Jan", lucro: 2400 },
  { month: "Fev", lucro: 1398 },
  { month: "Mar", lucro: 3800 },
  { month: "Abr", lucro: 3908 },
  { month: "Mai", lucro: 4800 },
  { month: "Jun", lucro: 3800 },
];

const weeklyData = [
  { day: "Seg", trades: 12, lucro: 450 },
  { day: "Ter", trades: 19, lucro: 720 },
  { day: "Qua", trades: 8, lucro: -180 },
  { day: "Qui", trades: 15, lucro: 560 },
  { day: "Sex", trades: 22, lucro: 890 },
  { day: "Sáb", trades: 5, lucro: 120 },
  { day: "Dom", trades: 3, lucro: 80 },
];

const pairDistribution = [
  { name: "BTC/USDT", value: 35, color: "hsl(45 93% 58%)" },
  { name: "ETH/USDT", value: 25, color: "hsl(217 91% 60%)" },
  { name: "SOL/USDT", value: 20, color: "hsl(142 76% 45%)" },
  { name: "Outros", value: 20, color: "hsl(215 20% 55%)" },
];

const statsCards = [
  { title: "Lucro Total", value: "$18,640", change: "+23.5%", positive: true, icon: DollarSign },
  { title: "Taxa de Acerto", value: "72.4%", change: "+5.2%", positive: true, icon: Target },
  { title: "Total de Trades", value: "342", change: "Este mês", positive: true, icon: Activity },
  { title: "Drawdown Máx", value: "-8.2%", change: "Controlado", positive: false, icon: Percent },
];

const Relatorios = () => {
  return (
    <MainLayout>
      <div className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análise de performance e estatísticas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
                      {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(142 76% 45%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(142 76% 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222 47% 10%)",
                        border: "1px solid hsl(217 33% 17%)",
                        borderRadius: "8px",
                        color: "hsl(210 40% 98%)",
                      }}
                    />
                    <Area type="monotone" dataKey="lucro" stroke="hsl(142 76% 45%)" strokeWidth={2} fill="url(#perfGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trades */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Trades por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(222 47% 10%)",
                        border: "1px solid hsl(217 33% 17%)",
                        borderRadius: "8px",
                        color: "hsl(210 40% 98%)",
                      }}
                    />
                    <Bar dataKey="trades" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pair Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Distribuição por Par</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pairDistribution}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pairDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {pairDistribution.map((pair) => (
                  <div key={pair.name} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: pair.color }} />
                    <span className="text-foreground font-medium">{pair.name}</span>
                    <span className="text-muted-foreground">{pair.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Relatorios;
