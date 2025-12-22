import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BotProvider } from "@/contexts/BotContext";
import Index from "./pages/Index";
import Historico from "./pages/Historico";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import PairDetails from "./pages/PairDetails";
import TradePanelMockup from "./pages/TradePanelMockup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/par/:symbol" element={<PairDetails />} />
            <Route path="/mockup" element={<TradePanelMockup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
