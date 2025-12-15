import { useState } from "react";
import { DollarSign, TrendingUp, Activity, Wallet } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BotStatus } from "@/components/dashboard/BotStatus";
import { PositionsTable } from "@/components/dashboard/PositionsTable";
import { TradeHistory } from "@/components/dashboard/TradeHistory";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { LogsPanel } from "@/components/dashboard/LogsPanel";
import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  const [isBotRunning, setIsBotRunning] = useState(true);

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Balanço Total"
            value="$48,532.80"
            change="+$2,450.20 hoje"
            changeType="positive"
            icon={Wallet}
          />
          <StatsCard
            title="Lucro/Prejuízo"
            value="+$5,842.30"
            change="+13.67% este mês"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatsCard
            title="Trades Hoje"
            value="24"
            change="18 ganhos, 6 perdas"
            changeType="neutral"
            icon={Activity}
          />
          <StatsCard
            title="Posições Abertas"
            value="3"
            change="$467.40 PNL aberto"
            changeType="positive"
            icon={DollarSign}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PriceChart />
          </div>
          <div>
            <BotStatus
              isRunning={isBotRunning}
              isConnected={true}
              uptime="4h 32m 18s"
              onToggle={() => setIsBotRunning(!isBotRunning)}
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
