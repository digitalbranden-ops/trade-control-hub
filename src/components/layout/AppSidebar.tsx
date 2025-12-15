import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Settings,
  BarChart3,
  Bot,
  ChevronDown,
  Coins,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TradingPair {
  symbol: string;
  name: string;
  change: number;
  isActive: boolean;
}

const mockPairs: TradingPair[] = [
  { symbol: "BTC/USDT", name: "Bitcoin", change: 2.45, isActive: true },
  { symbol: "ETH/USDT", name: "Ethereum", change: -1.32, isActive: true },
  { symbol: "SOL/USDT", name: "Solana", change: 5.67, isActive: true },
  { symbol: "BNB/USDT", name: "Binance Coin", change: 0.89, isActive: true },
  { symbol: "XRP/USDT", name: "Ripple", change: -0.45, isActive: false },
  { symbol: "ADA/USDT", name: "Cardano", change: 1.23, isActive: false },
  { symbol: "DOGE/USDT", name: "Dogecoin", change: 3.21, isActive: true },
  { symbol: "DOT/USDT", name: "Polkadot", change: -2.11, isActive: false },
];

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Histórico", icon: History, path: "/historico" },
  { title: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { title: "Configurações", icon: Settings, path: "/configuracoes" },
];

export function AppSidebar() {
  const location = useLocation();
  const [pairsOpen, setPairsOpen] = useState(true);
  const activePairsCount = mockPairs.filter((p) => p.isActive).length;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold text-sidebar-foreground">Trading Bot</h1>
            <p className="text-xs text-muted-foreground">Painel de Controle</p>
          </div>
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Active Pairs */}
        <SidebarGroup className="mt-4">
          <Collapsible open={pairsOpen} onOpenChange={setPairsOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pares Ativos
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-xs bg-primary/10 text-primary border-0"
                  >
                    {activePairsCount}
                  </Badge>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    pairsOpen && "rotate-180"
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {mockPairs.map((pair) => (
                    <SidebarMenuItem key={pair.symbol}>
                      <SidebarMenuButton
                        asChild
                        className="h-auto py-2.5"
                        tooltip={`${pair.name} (${pair.symbol})`}
                      >
                        <Link
                          to={`/par/${pair.symbol.replace("/", "-").toLowerCase()}`}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                pair.isActive ? "bg-success animate-pulse" : "bg-muted-foreground"
                              )}
                            />
                            <div>
                              <p className="font-medium text-sm text-sidebar-foreground">
                                {pair.symbol}
                              </p>
                              <p className="text-xs text-muted-foreground">{pair.name}</p>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1 text-xs font-medium",
                              pair.change >= 0 ? "text-success" : "text-destructive"
                            )}
                          >
                            {pair.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {pair.change >= 0 ? "+" : ""}
                            {pair.change.toFixed(2)}%
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
