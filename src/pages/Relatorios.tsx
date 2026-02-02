import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon,
  Download,
  FileSpreadsheet,
  FileText,
  Truck,
  TrendingUp,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  Fuel,
  Wrench,
  Coffee,
  Zap,
} from "lucide-react";

interface Viagem {
  freteId: string;
  rota: string;
  motorista: string;
  dataInicio: string;
  dataFim: string;
  receita: number;
  resultado: number;
  mercadoria: string;
  quantidade: number;
  unidade: string;
}

interface Gasto {
  tipo: string;
  valor: number;
  quantidade: number;
}

interface RelatorioMotorista {
  motorista: string;
  periodo: string;
  viagens: Viagem[];
  gastos: Record<string, number>;
  totalGastos: number;
  totalReceita: number;
  totalMercadoria: number;
  totalViagens: number;
  resultado: number;
}

interface PagamentoRelatorio {
  id: string;
  motorista: string;
  dataPagamento: string;
  toneladas: number;
  valorTotal: number;
  metodo: "pix" | "transferencia_bancaria";
  status: "pendente" | "processando" | "pago" | "cancelado";
  fretes: string[];
}

const viagensData: Viagem[] = [
  {
    freteId: "#1250",
    rota: "São Paulo → Rio de Janeiro",
    motorista: "Carlos Silva",
    dataInicio: "20/01/2025",
    dataFim: "21/01/2025",
    receita: 15000,
    resultado: 4000,
    mercadoria: "Amendoim",
    quantidade: 500,
    unidade: "sacas",
  },
  {
    freteId: "#1249",
    rota: "Curitiba → Florianópolis",
    motorista: "João Oliveira",
    dataInicio: "18/01/2025",
    dataFim: "18/01/2025",
    receita: 8500,
    resultado: 2300,
    mercadoria: "Soja",
    quantidade: 300,
    unidade: "sacas",
  },
  {
    freteId: "#1248",
    rota: "Belo Horizonte → Brasília",
    motorista: "Carlos Silva",
    dataInicio: "15/01/2025",
    dataFim: "16/01/2025",
    receita: 12000,
    resultado: 3200,
    mercadoria: "Amendoim",
    quantidade: 400,
    unidade: "sacas",
  },
  {
    freteId: "#1247",
    rota: "São Paulo → Rio de Janeiro",
    motorista: "André Costa",
    dataInicio: "12/01/2025",
    dataFim: "13/01/2025",
    receita: 14000,
    resultado: -1680,
    mercadoria: "Milho",
    quantidade: 450,
    unidade: "sacas",
  },
  {
    freteId: "#1251",
    rota: "Santos → Campinas",
    motorista: "Carlos Silva",
    dataInicio: "22/01/2025",
    dataFim: "22/01/2025",
    receita: 6500,
    resultado: 1800,
    mercadoria: "Amendoim",
    quantidade: 250,
    unidade: "sacas",
  },
];

const gastosData: Record<string, Record<string, number>> = {
  "Carlos Silva": {
    combustivel: 3200,
    pedagio: 800,
    manutencao: 500,
    alimentacao: 300,
  },
  "João Oliveira": {
    combustivel: 2100,
    pedagio: 600,
    manutencao: 0,
    alimentacao: 200,
  },
  "André Costa": {
    combustivel: 2800,
    pedagio: 900,
    manutencao: 2200,
    alimentacao: 350,
  },
};

const pagamentosData: PagamentoRelatorio[] = [
  {
    id: "P001",
    motorista: "Carlos Silva",
    dataPagamento: "22/01/2025",
    toneladas: 85,
    valorTotal: 12750,
    metodo: "pix",
    status: "pago",
    fretes: ["#1250", "#1248"],
  },
  {
    id: "P002",
    motorista: "João Oliveira",
    dataPagamento: "25/01/2025",
    toneladas: 45,
    valorTotal: 6750,
    metodo: "transferencia_bancaria",
    status: "processando",
    fretes: ["#1249"],
  },
  {
    id: "P003",
    motorista: "André Costa",
    dataPagamento: "28/01/2025",
    toneladas: 55,
    valorTotal: 8250,
    metodo: "pix",
    status: "pendente",
    fretes: ["#1247"],
  },
];

export default function Relatorios() {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [motorista, setMotorista] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("resumo");

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setMotorista("all");
  };

  // Verificar se algum filtro está ativo
  const hasActiveFilters = dateFrom || dateTo || motorista !== "all";

  // Filtrar dados com base nos filtros (se não houver filtros, mostra tudo)
  const filteredViagens = useMemo(() => {
    return viagensData.filter((viagem) => {
      // Filtro de motorista
      if (motorista !== "all" && viagem.motorista !== motorista) return false;
      
      // Filtro de data (opcional)
      if (dateFrom || dateTo) {
        const [dia, mes, ano] = viagem.dataInicio.split("/");
        const viagemDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        
        if (dateFrom && viagemDate < dateFrom) return false;
        if (dateTo && viagemDate > dateTo) return false;
      }
      
      return true;
    });
  }, [motorista, dateFrom, dateTo]);

  // Calcular resumo do motorista selecionado
  const relatorioMotorista = useMemo(() => {
    const motoristasSelecionados =
      motorista === "all" ? ["Carlos Silva", "João Oliveira", "André Costa"] : [motorista];
    
    const resumo: RelatorioMotorista = {
      motorista: motorista === "all" ? "Todos os motoristas" : motorista,
      periodo: dateFrom || dateTo 
        ? `${dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Início"} - ${dateTo ? format(dateTo, "dd/MM/yyyy") : "Fim"}`
        : "Todo o período",
      viagens: filteredViagens,
      gastos: {},
      totalGastos: 0,
      totalReceita: 0,
      totalMercadoria: 0,
      totalViagens: filteredViagens.length,
      resultado: 0,
    };

    // Agregar gastos
    motoristasSelecionados.forEach((m) => {
      const gastosMotorista = gastosData[m] || {};
      Object.entries(gastosMotorista).forEach(([tipo, valor]) => {
        resumo.gastos[tipo] = (resumo.gastos[tipo] || 0) + valor;
      });
    });

    // Calcular totais
    resumo.totalGastos = Object.values(resumo.gastos).reduce((a, b) => a + b, 0);
    resumo.totalReceita = filteredViagens.reduce((acc, v) => acc + v.receita, 0);
    resumo.totalMercadoria = filteredViagens.reduce((acc, v) => acc + v.quantidade, 0);
    resumo.resultado = resumo.totalReceita - resumo.totalGastos;

    return resumo;
  }, [motorista, dateFrom, dateTo, filteredViagens]);

  const filteredPagamentos = useMemo(() => {
    return pagamentosData.filter((pagamento) => {
      if (motorista !== "all" && pagamento.motorista !== motorista) return false;

      if (dateFrom || dateTo) {
        const [dia, mes, ano] = pagamento.dataPagamento.split("/");
        const pagamentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));

        if (dateFrom && pagamentoDate < dateFrom) return false;
        if (dateTo && pagamentoDate > dateTo) return false;
      }

      return true;
    });
  }, [motorista, dateFrom, dateTo]);

  const pagamentosResumo = useMemo(() => {
    const total = filteredPagamentos.reduce((acc, p) => acc + p.valorTotal, 0);
    const pago = filteredPagamentos
      .filter((p) => p.status === "pago")
      .reduce((acc, p) => acc + p.valorTotal, 0);
    const pendente = filteredPagamentos
      .filter((p) => p.status !== "pago")
      .reduce((acc, p) => acc + p.valorTotal, 0);
    return { total, pago, pendente };
  }, [filteredPagamentos]);

  const pagamentosColumns = [
    {
      key: "id",
      header: "ID Pagamento",
      render: (item: PagamentoRelatorio) => (
        <span className="font-mono font-bold text-primary">{item.id}</span>
      ),
    },
    { key: "motorista", header: "Motorista" },
    {
      key: "dataPagamento",
      header: "Data",
      render: (item: PagamentoRelatorio) => (
        <span className="text-sm text-muted-foreground">{item.dataPagamento}</span>
      ),
    },
    {
      key: "toneladas",
      header: "Toneladas",
      render: (item: PagamentoRelatorio) => (
        <span className="font-semibold">{item.toneladas}t</span>
      ),
    },
    {
      key: "valorTotal",
      header: "Valor",
      render: (item: PagamentoRelatorio) => (
        <span className="font-semibold text-profit">
          R$ {item.valorTotal.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: PagamentoRelatorio) => (
        <Badge
          variant={
            item.status === "pago"
              ? "completed"
              : item.status === "processando"
              ? "inTransit"
              : item.status === "pendente"
              ? "pending"
              : "cancelled"
          }
        >
          {item.status === "pago"
            ? "Pago"
            : item.status === "processando"
            ? "Processando"
            : item.status === "pendente"
            ? "Pendente"
            : "Cancelado"}
        </Badge>
      ),
    },
    {
      key: "fretes",
      header: "Fretes",
      render: (item: PagamentoRelatorio) => (
        <span className="text-xs text-muted-foreground">
          {item.fretes.join(", ")}
        </span>
      ),
    },
  ];

  const columns = [
    {
      key: "freteId",
      header: "ID Frete",
      render: (item: Viagem) => (
        <span className="font-mono font-bold">{item.freteId}</span>
      ),
    },
    { key: "rota", header: "Rota" },
    { key: "mercadoria", header: "Mercadoria" },
    {
      key: "quantidade",
      header: "Quantidade",
      render: (item: Viagem) => (
        <span>{item.quantidade} {item.unidade}</span>
      ),
    },
    { key: "dataInicio", header: "Saída" },
    { key: "dataFim", header: "Chegada" },
    {
      key: "receita",
      header: "Receita",
      render: (item: Viagem) => (
        <span className="font-medium text-profit">
          R$ {item.receita.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "resultado",
      header: "Resultado",
      render: (item: Viagem) => (
        <Badge variant={item.resultado >= 0 ? "profit" : "loss"}>
          {item.resultado >= 0 ? "+" : ""}R${" "}
          {(item.resultado / 1000).toFixed(1)}k
        </Badge>
      ),
    },
  ];

  return (
    <MainLayout title="Relatórios" subtitle="Análise detalhada por motorista">
      <PageHeader
        title="Relatórios Inteligentes"
        description="Acompanhe viagens, custos e desempenho com precisão"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </Button>
          </div>
        }
      />

      {/* Filters - Improved Design */}
      <div className="mb-8 p-6 bg-gradient-to-r from-card to-card/50 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-sm text-muted-foreground">FILTROS</h3>
            {hasActiveFilters ? (
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
                Filtros ativos
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Mostrando todos os dados
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <AlertCircle className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Data Início */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-foreground">Data Início</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal hover:bg-primary/5",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {dateFrom
                    ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Fim */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-foreground">Data Fim</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal hover:bg-primary/5",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {dateTo
                    ? format(dateTo, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Motorista */}
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-foreground">Motorista</label>
            <Select value={motorista} onValueChange={setMotorista}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os motoristas</SelectItem>
                <SelectItem value="Carlos Silva">Carlos Silva</SelectItem>
                <SelectItem value="João Oliveira">João Oliveira</SelectItem>
                <SelectItem value="André Costa">André Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Gerar */}
          <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow w-full lg:w-auto">
            <Zap className="h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Tabs - Improved */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-2 bg-muted/30 border rounded-xl">
          <TabsTrigger 
            value="resumo" 
            className={cn(
              "gap-2 py-4 px-4 rounded-lg transition-all duration-200",
              activeTab === "resumo" 
                ? "bg-blue-500 text-white shadow-lg scale-105" 
                : "hover:bg-blue-500/10 text-foreground"
            )}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Resumo</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="viagens"
            className={cn(
              "gap-2 py-4 px-4 rounded-lg transition-all duration-200",
              activeTab === "viagens" 
                ? "bg-purple-500 text-white shadow-lg scale-105" 
                : "hover:bg-purple-500/10 text-foreground"
            )}
          >
            <Truck className="h-5 w-5" />
            <span className="font-semibold">Viagens</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="gastos"
            className={cn(
              "gap-2 py-4 px-4 rounded-lg transition-all duration-200",
              activeTab === "gastos" 
                ? "bg-orange-500 text-white shadow-lg scale-105" 
                : "hover:bg-orange-500/10 text-foreground"
            )}
          >
            <DollarSign className="h-5 w-5" />
            <span className="font-semibold">Gastos</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="mercadorias"
            className={cn(
              "gap-2 py-4 px-4 rounded-lg transition-all duration-200",
              activeTab === "mercadorias" 
                ? "bg-green-500 text-white shadow-lg scale-105" 
                : "hover:bg-green-500/10 text-foreground"
            )}
          >
            <Package className="h-5 w-5" />
            <span className="font-semibold">Cargas</span>
          </TabsTrigger>

          <TabsTrigger 
            value="pagamentos"
            className={cn(
              "gap-2 py-4 px-4 rounded-lg transition-all duration-200",
              activeTab === "pagamentos" 
                ? "bg-emerald-500 text-white shadow-lg scale-105" 
                : "hover:bg-emerald-500/10 text-foreground"
            )}
          >
            <DollarSign className="h-5 w-5" />
            <span className="font-semibold">Pagamentos</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB: RESUMO GERAL */}
        <TabsContent value="resumo" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-semibold text-lg">Resumo Geral</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Viagens */}
            <Card 
              onClick={() => setActiveTab("viagens")}
              className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 cursor-pointer hover:scale-105 hover:bg-blue-100/50 dark:hover:bg-blue-950/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total de Viagens</p>
                  <p className="text-4xl font-bold text-blue-600">{relatorioMotorista.totalViagens}</p>
                  <p className="text-xs text-muted-foreground mt-2">Clique para ver detalhes</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Receita */}
            <Card 
              onClick={() => setActiveTab("viagens")}
              className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-profit bg-gradient-to-br from-profit/5 to-transparent cursor-pointer hover:scale-105 hover:bg-profit/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Receita Total</p>
                  <p className="text-4xl font-bold text-profit">
                    R$ {(relatorioMotorista.totalReceita / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Clique para ver detalhes</p>
                </div>
                <div className="bg-profit/10 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-profit" />
                </div>
              </div>
            </Card>

            {/* Gastos */}
            <Card 
              onClick={() => setActiveTab("gastos")}
              className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-loss bg-gradient-to-br from-loss/5 to-transparent cursor-pointer hover:scale-105 hover:bg-loss/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Gastos Totais</p>
                  <p className="text-4xl font-bold text-loss">
                    R$ {(relatorioMotorista.totalGastos / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Clique para ver detalhes</p>
                </div>
                <div className="bg-loss/10 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-loss" />
                </div>
              </div>
            </Card>

            {/* Resultado */}
            <Card
              onClick={() => setActiveTab("resumo")}
              className={cn(
                "p-6 hover:shadow-lg transition-all duration-300 border-l-4 cursor-pointer hover:scale-105",
                relatorioMotorista.resultado >= 0
                  ? "border-l-profit bg-gradient-to-br from-profit/5 to-transparent hover:bg-profit/10"
                  : "border-l-loss bg-gradient-to-br from-loss/5 to-transparent hover:bg-loss/10"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Resultado Líquido</p>
                  <p
                    className={cn(
                      "text-4xl font-bold",
                      relatorioMotorista.resultado >= 0 ? "text-profit" : "text-loss"
                    )}
                  >
                    {relatorioMotorista.resultado >= 0 ? "+" : ""}R${" "}
                    {(relatorioMotorista.resultado / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {relatorioMotorista.resultado >= 0 ? "✓ Lucro" : "✗ Prejuízo"}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    relatorioMotorista.resultado >= 0
                      ? "bg-profit/10"
                      : "bg-loss/10"
                  )}
                >
                  {relatorioMotorista.resultado >= 0 ? (
                    <CheckCircle2 className="h-6 w-6 text-profit" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-loss" />
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Período */}
            <Card className="p-6 border-dashed">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-2">Período do Relatório</h3>
                  <p className="text-lg font-mono text-foreground">{relatorioMotorista.periodo}</p>
                </div>
              </div>
            </Card>

            {/* Motorista */}
            <Card 
              onClick={() => setActiveTab("viagens")}
              className="p-6 border-dashed cursor-pointer hover:shadow-md hover:bg-muted/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-2">Motorista Selecionado</h3>
                  <p className="text-lg font-semibold text-foreground">
                    {relatorioMotorista.motorista}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Clique para ver viagens</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Indicador de Saúde */}
          <Card 
            onClick={() => setActiveTab("gastos")}
            className="p-6 cursor-pointer hover:shadow-lg hover:bg-muted/30 transition-all"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Eficiência Operacional</h3>
                  <Badge variant={relatorioMotorista.resultado >= 0 ? "profit" : "loss"}>
                    {(
                      ((relatorioMotorista.totalReceita - relatorioMotorista.totalGastos) /
                        relatorioMotorista.totalReceita) *
                      100
                    ).toFixed(1)}
                    % de margem
                  </Badge>
                </div>
                <Progress
                  value={Math.max(
                    0,
                    Math.min(
                      100,
                      ((relatorioMotorista.totalReceita - relatorioMotorista.totalGastos) /
                        relatorioMotorista.totalReceita) *
                        100
                    )
                  )}
                  className="h-3"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Proporção entre lucro e receita total - Clique para ver análise de gastos
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* TAB: VIAGENS */}
        <TabsContent value="viagens">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="font-semibold text-lg">Relatório de Viagens</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Todas as Viagens</h3>
              <p className="text-sm text-muted-foreground">
                Clique em qualquer viagem para ver mais detalhes
              </p>
            </div>
            <DataTable<Viagem>
              columns={columns}
              data={relatorioMotorista.viagens}
              emptyMessage="Nenhuma viagem encontrada no período"
            />
          </Card>
        </TabsContent>

        {/* TAB: GASTOS POR CATEGORIA */}
        <TabsContent value="gastos" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-semibold text-lg">Relatório de Gastos</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Combustível */}
            {relatorioMotorista.gastos["combustivel"] && (
              <Card className="p-4 hover:shadow-lg transition-all border-t-4 border-t-orange-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Combustível</p>
                    <p className="text-2xl font-bold text-orange-600">
                      R$ {relatorioMotorista.gastos["combustivel"].toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                    <Fuel className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((relatorioMotorista.gastos["combustivel"] / relatorioMotorista.totalGastos) * 100).toFixed(1)}% dos gastos
                </p>
              </Card>
            )}

            {/* Manutenção */}
            {relatorioMotorista.gastos["manutencao"] && (
              <Card className="p-4 hover:shadow-lg transition-all border-t-4 border-t-red-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Manutenção</p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {relatorioMotorista.gastos["manutencao"].toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <Wrench className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((relatorioMotorista.gastos["manutencao"] / relatorioMotorista.totalGastos) * 100).toFixed(1)}% dos gastos
                </p>
              </Card>
            )}

            {/* Pedágio */}
            {relatorioMotorista.gastos["pedagio"] && (
              <Card className="p-4 hover:shadow-lg transition-all border-t-4 border-t-purple-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedágio</p>
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {relatorioMotorista.gastos["pedagio"].toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((relatorioMotorista.gastos["pedagio"] / relatorioMotorista.totalGastos) * 100).toFixed(1)}% dos gastos
                </p>
              </Card>
            )}

            {/* Alimentação */}
            {relatorioMotorista.gastos["alimentacao"] && (
              <Card className="p-4 hover:shadow-lg transition-all border-t-4 border-t-green-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Alimentação</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {relatorioMotorista.gastos["alimentacao"].toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <Coffee className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((relatorioMotorista.gastos["alimentacao"] / relatorioMotorista.totalGastos) * 100).toFixed(1)}% dos gastos
                </p>
              </Card>
            )}
          </div>

          {/* Total e Média */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-loss/5 to-transparent border-2 border-loss/20">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Total de Gastos</h3>
                <p className="text-4xl font-bold text-loss">
                  R$ {relatorioMotorista.totalGastos.toLocaleString("pt-BR")}
                </p>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Média por viagem: <span className="font-semibold text-foreground">
                      R$ {(relatorioMotorista.totalGastos / relatorioMotorista.totalViagens).toLocaleString("pt-BR")}
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Distribuição de Gastos</h3>
                <div className="space-y-2">
                  {Object.entries(relatorioMotorista.gastos).map(([tipo, valor]) => (
                    <div key={tipo} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{tipo}</span>
                        <span className="font-semibold">
                          {((valor / relatorioMotorista.totalGastos) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={(valor / relatorioMotorista.totalGastos) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: MERCADORIAS */}
        <TabsContent value="mercadorias" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-semibold text-lg">Relatório de Cargas</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          {/* Resumo de Mercadoria */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Carregado</p>
                <p className="text-5xl font-bold text-primary mb-2">
                  {relatorioMotorista.totalMercadoria}
                </p>
                <p className="text-lg text-muted-foreground">sacas</p>
                <p className="text-sm text-muted-foreground mt-3">
                  ≈ <span className="font-semibold">{(relatorioMotorista.totalMercadoria * 60 / 1000).toFixed(2)} toneladas</span>
                </p>
              </div>
              <div className="bg-primary/10 p-4 rounded-xl">
                <Package className="h-10 w-10 text-primary" />
              </div>
            </div>
          </Card>

          {/* Média por viagem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <p className="text-sm text-muted-foreground mb-2">Média por Viagem</p>
              <p className="text-3xl font-bold text-blue-600">
                {relatorioMotorista.totalViagens > 0
                  ? (relatorioMotorista.totalMercadoria / relatorioMotorista.totalViagens).toFixed(0)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground mt-2">sacas/viagem</p>
            </Card>

            <Card className="p-4 border-l-4 border-l-green-500">
              <p className="text-sm text-muted-foreground mb-2">Maior Carregamento</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.max(...relatorioMotorista.viagens.map(v => v.quantidade))}
              </p>
              <p className="text-xs text-muted-foreground mt-2">sacas</p>
            </Card>

            <Card className="p-4 border-l-4 border-l-purple-500">
              <p className="text-sm text-muted-foreground mb-2">Menor Carregamento</p>
              <p className="text-3xl font-bold text-purple-600">
                {Math.min(...relatorioMotorista.viagens.map(v => v.quantidade))}
              </p>
              <p className="text-xs text-muted-foreground mt-2">sacas</p>
            </Card>
          </div>

          {/* Breakdown por Mercadoria */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Detalhamento por Frete</h3>
            <div className="space-y-2">
              {relatorioMotorista.viagens.length > 0 ? (
                relatorioMotorista.viagens.map((viagem, idx) => (
                  <div
                    key={viagem.freteId}
                    className="flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/60 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-primary/10 px-3 py-1 rounded text-sm font-mono font-semibold text-primary">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{viagem.mercadoria}</p>
                        <p className="text-xs text-muted-foreground">{viagem.rota}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{viagem.quantidade} sacas</p>
                      <p className="text-xs text-muted-foreground">
                        {(viagem.quantidade * 60 / 1000).toFixed(2)} ton
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Nenhuma viagem registrada</p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* TAB: PAGAMENTOS */}
        <TabsContent value="pagamentos" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="font-semibold text-lg">Relatório de Pagamentos</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          {/* Resumo de Pagamentos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Pago</p>
                  <p className="text-4xl font-bold text-profit">
                    R$ {pagamentosResumo.pago.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Período filtrado</p>
                </div>
                <div className="bg-profit/10 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-profit" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-50/60 to-transparent border-2 border-yellow-200/60 dark:border-yellow-900/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Pendente</p>
                  <p className="text-4xl font-bold text-yellow-600">
                    R$ {pagamentosResumo.pendente.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Processando + Pendente</p>
                </div>
                <div className="bg-yellow-100/70 dark:bg-yellow-900/30 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2 border-muted">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Geral</p>
                  <p className="text-4xl font-bold text-foreground">
                    R$ {pagamentosResumo.total.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Todos os status</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tabela de Pagamentos */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Pagamentos por Motorista</h3>
            <DataTable<PagamentoRelatorio>
              columns={pagamentosColumns}
              data={filteredPagamentos}
              emptyMessage="Nenhum pagamento encontrado para o período"
            />
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
