import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  Power,
  Loader2,
  ExternalLink,
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
import { Button } from "@/components/ui/button";
import { useBotContext } from "@/contexts/BotContext";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Histórico", icon: History, path: "/historico" },
  { title: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { title: "Configurações", icon: Settings, path: "/configuracoes" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pairsOpen, setPairsOpen] = useState(true);
  const { globalStatus, selectedSymbol, setSelectedSymbol, isConnected, isLoading, toggleBot } = useBotContext();

  const pairs = globalStatus?.pairs ? Object.values(globalStatus.pairs) : [];
  const activePairsCount = pairs.filter((p) => p.running).length;

  const handleToggleBot = (e: React.MouseEvent, symbol: string, running: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBot(symbol, running);
  };

  const handleOpenPair = (symbol: string) => {
    const encodedSymbol = symbol.replace('/', '-');
    navigate(`/par/${encodedSymbol}`);
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            isConnected ? "bg-success/10" : "bg-destructive/10"
          )}>
            <Bot className={cn(
              "h-6 w-6",
              isConnected ? "text-success" : "text-destructive"
            )} />
          </div>
          <div className="flex-1">
            <h1 className="text-base font-bold text-sidebar-foreground">Trading Bot</h1>
            <p className={cn(
              "text-xs",
              isConnected ? "text-success" : "text-destructive"
            )}>
              {isConnected ? "Conectado" : "Desconectado"}
            </p>
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
                    Pares
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-xs bg-primary/10 text-primary border-0"
                  >
                    {activePairsCount}/{pairs.length}
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
                {isLoading ? (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : pairs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Aguardando conexão...
                  </div>
                ) : (
                  <SidebarMenu className="mt-2">
                    {pairs.map((pair) => (
                      <SidebarMenuItem key={pair.symbol}>
                        <SidebarMenuButton
                          asChild
                          isActive={selectedSymbol === pair.symbol || location.pathname === `/par/${pair.symbol.replace('/', '-')}`}
                          className="h-auto py-2.5"
                          tooltip={pair.symbol}
                        >
                          <button
                            onClick={() => {
                              setSelectedSymbol(pair.symbol);
                              handleOpenPair(pair.symbol);
                            }}
                            className="flex items-center justify-between w-full"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  pair.running ? "bg-success animate-pulse" : "bg-muted-foreground"
                                )}
                              />
                              <div className="text-left">
                                <p className="font-medium text-sm text-sidebar-foreground flex items-center gap-1">
                                  {pair.symbol}
                                  <ExternalLink className="h-3 w-3 opacity-50" />
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ${pair.current_price?.toLocaleString() ?? "--"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex items-center gap-1 text-xs font-medium",
                                  pair.pnl >= 0 ? "text-success" : "text-destructive"
                                )}
                              >
                                {pair.pnl >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {pair.pnl >= 0 ? "+" : ""}{pair.pnl?.toFixed(2) ?? "0.00"}%
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-6 w-6 rounded-full",
                                  pair.running ? "text-success hover:text-destructive" : "text-muted-foreground hover:text-success"
                                )}
                                onClick={(e) => handleToggleBot(e, pair.symbol, pair.running)}
                              >
                                <Power className="h-3 w-3" />
                              </Button>
                            </div>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
