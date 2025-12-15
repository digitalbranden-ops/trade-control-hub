import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Save, RotateCcw, Shield, Bell, Zap, Database } from "lucide-react";

const Configuracoes = () => {
  return (
    <MainLayout>
      <div className="px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Configure os parâmetros do seu bot de trading</p>
        </div>

        <div className="space-y-6">
          {/* API Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Conexão API</CardTitle>
                  <CardDescription>Configure a conexão com seu bot Python</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="api-url" className="text-foreground">URL da API</Label>
                  <Input id="api-url" placeholder="http://localhost:5000" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-foreground">Chave de API</Label>
                  <Input id="api-key" type="password" placeholder="••••••••" className="bg-secondary border-border" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Parameters */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Parâmetros de Trading</CardTitle>
                  <CardDescription>Ajuste os parâmetros de negociação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="max-position" className="text-foreground">Tamanho Máximo da Posição (%)</Label>
                  <Input id="max-position" type="number" defaultValue="5" className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-trades" className="text-foreground">Trades Simultâneos</Label>
                  <Input id="max-trades" type="number" defaultValue="3" className="bg-secondary border-border" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Stop Loss Padrão</Label>
                    <span className="text-sm text-muted-foreground">2.5%</span>
                  </div>
                  <Slider defaultValue={[2.5]} max={10} step={0.5} className="w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Take Profit Padrão</Label>
                    <span className="text-sm text-muted-foreground">5%</span>
                  </div>
                  <Slider defaultValue={[5]} max={20} step={0.5} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Management */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Gestão de Risco</CardTitle>
                  <CardDescription>Configure limites de risco</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Limite de Perda Diária</Label>
                  <p className="text-xs text-muted-foreground">Parar trading se perda diária atingir limite</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Trailing Stop</Label>
                  <p className="text-xs text-muted-foreground">Ajustar stop loss automaticamente</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Modo Conservador</Label>
                  <p className="text-xs text-muted-foreground">Reduzir tamanho das posições em alta volatilidade</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Notificações</CardTitle>
                  <CardDescription>Configure alertas e notificações</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Notificar em novo trade</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Notificar em stop loss</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Notificar em take profit</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Resumo diário</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Restaurar Padrões
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
