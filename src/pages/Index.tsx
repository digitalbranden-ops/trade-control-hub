import { DollarSign, TrendingUp, Activity, Wallet, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BotStatus } from "@/components/dashboard/BotStatus";
import { PositionsTable } from "@/components/dashboard/PositionsTable";
import { TradeHistory } from "@/components/dashboard/TradeHistory";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { LogsPanel } from "@/components/dashboard/LogsPanel";
import { MainLayout } from "@/components/layout/MainLayout";
import { useBotContext } from "@/contexts/BotContext";
import { useBalance, useMetrics, usePositions } from "@/hooks/useBotData";

const Index = () => {
  const { globalStatus, selectedSymbol, isConnected, isLoading, error, toggleBot } = useBotContext();
  const { balance } = useBalance();
  const { metrics } = useMetrics();
  const { positions } = usePositions();

  const currentPairStatus = globalStatus?.pairs?.[selectedSymbol];
  const isBotRunning = currentPairStatus?.running ?? false;

  const handleToggleBot = () => {
    toggleBot(selectedSymbol, isBotRunning);
  };

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Connection Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Balanço Total"
            value={balance ? `$${balance.total.toLocaleString()}` : "$--"}
            change={balance ? `${balance.daily_pnl >= 0 ? '+' : ''}$${balance.daily_pnl.toLocaleString()} hoje` : "--"}
            changeType={balance?.daily_pnl && balance.daily_pnl >= 0 ? "positive" : "negative"}
            icon={Wallet}
          />
          <StatsCard
            title="Lucro/Prejuízo"
            value={metrics ? `${metrics.total_pnl >= 0 ? '+' : ''}$${metrics.total_pnl.toLocaleString()}` : "$--"}
            change={metrics ? `${metrics.win_rate.toFixed(1)}% win rate` : "--"}
            changeType={metrics?.total_pnl && metrics.total_pnl >= 0 ? "positive" : "negative"}
            icon={TrendingUp}
          />
          <StatsCard
            title="Trades Hoje"
            value={metrics?.daily_trades?.toString() ?? "--"}
            change={metrics ? `${metrics.winning_trades} ganhos, ${metrics.losing_trades} perdas` : "--"}
            changeType="neutral"
            icon={Activity}
          />
          <StatsCard
            title="Posições Abertas"
            value={positions?.length?.toString() ?? "--"}
            change={positions?.length ? `${positions.reduce((acc, p) => acc + p.pnl, 0).toLocaleString()} PNL` : "Sem posições"}
            changeType={positions?.reduce((acc, p) => acc + p.pnl, 0) >= 0 ? "positive" : "negative"}
            icon={DollarSign}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PriceChart symbol={selectedSymbol} />
          </div>
          <div>
            <BotStatus
              symbol={selectedSymbol}
              isRunning={isBotRunning}
              isConnected={isConnected}
              uptime={currentPairStatus?.uptime ?? "--"}
              onToggle={handleToggleBot}
            />
          </div>
        </div>

        {/* Positions & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PositionsTable />
          <TradeHistory />
        </div>

        {/* Logs */}
        <LogsPanel />
      </div>
    </MainLayout>
  );
};

export default Index;
