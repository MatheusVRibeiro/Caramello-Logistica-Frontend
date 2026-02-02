import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/shared/DataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Upload, Fuel, Wrench, FileText, DollarSign, Truck, User, MapPin, Calendar as CalendarIcon, FileCheck, Eye, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Custo {
  id: string;
  freteId: string;
  tipo: "combustivel" | "manutencao" | "pedagio" | "outros";
  descricao: string;
  valor: number;
  data: string;
  comprovante: boolean;
  motorista: string;
  caminhao: string;
  rota: string;
  observacoes?: string;
}

const custosData: Custo[] = [
  {
    id: "1",
    freteId: "#1250",
    tipo: "combustivel",
    descricao: "Abastecimento completo",
    valor: 2500,
    data: "20/01/2025",
    comprovante: true,
    motorista: "Carlos Silva",
    caminhao: "ABC-1234",
    rota: "São Paulo → Rio de Janeiro",
    observacoes: "Posto Shell - Rodovia Presidente Dutra KM 180",
  },
  {
    id: "2",
    freteId: "#1250",
    tipo: "pedagio",
    descricao: "Via Dutra - trecho completo",
    valor: 850,
    data: "20/01/2025",
    comprovante: true,
    motorista: "Carlos Silva",
    caminhao: "ABC-1234",
    rota: "São Paulo → Rio de Janeiro",
    observacoes: "9 praças de pedágio no trajeto",
  },
  {
    id: "3",
    freteId: "#1249",
    tipo: "manutencao",
    descricao: "Troca de pneus dianteiros",
    valor: 3200,
    data: "18/01/2025",
    comprovante: true,
    motorista: "João Oliveira",
    caminhao: "XYZ-5678",
    rota: "Curitiba → Florianópolis",
    observacoes: "Borracharia São José - 2 pneus Pirelli novos",
  },
  {
    id: "4",
    freteId: "#1249",
    tipo: "combustivel",
    descricao: "Abastecimento parcial",
    valor: 1800,
    data: "17/01/2025",
    comprovante: false,
    motorista: "João Oliveira",
    caminhao: "XYZ-5678",
    rota: "Curitiba → Florianópolis",
  },
  {
    id: "5",
    freteId: "#1247",
    tipo: "outros",
    descricao: "Estacionamento",
    valor: 150,
    data: "15/01/2025",
    comprovante: true,
    motorista: "André Costa",
    caminhao: "DEF-9012",
    rota: "São Paulo → Rio de Janeiro",
    observacoes: "Estacionamento durante pernoite - 24h",
  },
];

const tipoConfig = {
  combustivel: { label: "Combustível", icon: Fuel, color: "text-warning" },
  manutencao: { label: "Manutenção", icon: Wrench, color: "text-loss" },
  pedagio: { label: "Pedágio", icon: Truck, color: "text-primary" },
  outros: { label: "Outros", icon: FileText, color: "text-muted-foreground" },
};

export default function Custos() {
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [motoristaFilter, setMotoristaFilter] = useState<string>("all");
  const [comprovanteFilter, setComprovanteFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCusto, setSelectedCusto] = useState<Custo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleRowClick = (custo: Custo) => {
    setSelectedCusto(custo);
    setIsDetailsOpen(true);
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearch("");
    setTipoFilter("all");
    setMotoristaFilter("all");
    setComprovanteFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = 
    search !== "" || 
    tipoFilter !== "all" || 
    motoristaFilter !== "all" || 
    comprovanteFilter !== "all" ||
    dateFrom !== undefined || 
    dateTo !== undefined;

  // Lista única de motoristas
  const motoristas = Array.from(new Set(custosData.map(c => c.motorista)));

  const filteredData = custosData.filter((custo) => {
    // Filtro de busca
    const matchesSearch =
      custo.freteId.toLowerCase().includes(search.toLowerCase()) ||
      custo.descricao.toLowerCase().includes(search.toLowerCase()) ||
      custo.motorista.toLowerCase().includes(search.toLowerCase());
    
    // Filtro de tipo
    const matchesTipo = tipoFilter === "all" || custo.tipo === tipoFilter;
    
    // Filtro de motorista
    const matchesMotorista = motoristaFilter === "all" || custo.motorista === motoristaFilter;
    
    // Filtro de comprovante
    const matchesComprovante = 
      comprovanteFilter === "all" || 
      (comprovanteFilter === "com" && custo.comprovante) ||
      (comprovanteFilter === "sem" && !custo.comprovante);
    
    // Filtro de data
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const [dia, mes, ano] = custo.data.split("/");
      const custoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      
      if (dateFrom && custoDate < dateFrom) matchesDate = false;
      if (dateTo && custoDate > dateTo) matchesDate = false;
    }
    
    return matchesSearch && matchesTipo && matchesMotorista && matchesComprovante && matchesDate;
  });

  const totalCustos = custosData.reduce((acc, c) => acc + c.valor, 0);
  const totalCombustivel = custosData
    .filter((c) => c.tipo === "combustivel")
    .reduce((acc, c) => acc + c.valor, 0);
  const totalManutencao = custosData
    .filter((c) => c.tipo === "manutencao")
    .reduce((acc, c) => acc + c.valor, 0);
  const totalPedagio = custosData
    .filter((c) => c.tipo === "pedagio")
    .reduce((acc, c) => acc + c.valor, 0);

  const columns = [
    {
      key: "tipo",
      header: "Tipo",
      render: (item: Custo) => {
        const config = tipoConfig[item.tipo];
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg bg-muted", config.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{config.label}</span>
          </div>
        );
      },
    },
    {
      key: "freteId",
      header: "Frete",
      render: (item: Custo) => (
        <span className="font-mono font-bold text-primary">{item.freteId}</span>
      ),
    },
    { 
      key: "descricao", 
      header: "Descrição",
      render: (item: Custo) => (
        <div>
          <p className="font-medium">{item.descricao}</p>
          <p className="text-xs text-muted-foreground">{item.motorista}</p>
        </div>
      ),
    },
    {
      key: "valor",
      header: "Valor",
      render: (item: Custo) => (
        <span className="font-bold text-lg text-loss">
          R$ {item.valor.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "data",
      header: "Data",
      render: (item: Custo) => (
        <span className="text-muted-foreground">{item.data}</span>
      ),
    },
    {
      key: "comprovante",
      header: "Comprovante",
      render: (item: Custo) => (
        <Badge variant={item.comprovante ? "success" : "neutral"}>
          {item.comprovante ? "✓ Anexado" : "Pendente"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: Custo) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(item);
          }}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver
        </Button>
      ),
    },
  ];

  return (
    <MainLayout title="Custos" subtitle="Gestão de custos operacionais">
      <PageHeader
        title="Custos"
        description="Controle de custos por frete e tipo"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Custo
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total de Custos"
          value={`R$ ${totalCustos.toLocaleString("pt-BR")}`}
          variant="loss"
          icon={<DollarSign className="h-5 w-5 text-loss" />}
        />
        <StatCard
          label="Combustível"
          value={`R$ ${totalCombustivel.toLocaleString("pt-BR")}`}
          variant="warning"
          icon={<Fuel className="h-5 w-5 text-warning" />}
        />
        <StatCard
          label="Manutenção"
          value={`R$ ${totalManutencao.toLocaleString("pt-BR")}`}
          variant="loss"
          icon={<Wrench className="h-5 w-5 text-loss" />}
        />
        <StatCard
          label="Pedágios"
          value={`R$ ${totalPedagio.toLocaleString("pt-BR")}`}
          variant="primary"
          icon={<Truck className="h-5 w-5 text-primary" />}
        />
      </div>

      {/* Filters Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtros</h3>
            {hasActiveFilters && (
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
                {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
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
              <X className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Busca */}
          <div className="lg:col-span-2">
            <Label className="text-xs text-muted-foreground mb-2 block">Buscar</Label>
            <Input
              placeholder="Frete, descrição ou motorista..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tipo */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Tipo</Label>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="combustivel">🛢️ Combustível</SelectItem>
                <SelectItem value="manutencao">🔧 Manutenção</SelectItem>
                <SelectItem value="pedagio">🛣️ Pedágio</SelectItem>
                <SelectItem value="outros">📄 Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Motorista */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Motorista</Label>
            <Select value={motoristaFilter} onValueChange={setMotoristaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos motoristas</SelectItem>
                {motoristas.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comprovante */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Comprovante</Label>
            <Select value={comprovanteFilter} onValueChange={setComprovanteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="com">✓ Com comprovante</SelectItem>
                <SelectItem value="sem">✗ Sem comprovante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Período */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom || dateTo
                    ? `${dateFrom ? format(dateFrom, "dd/MM") : "..."} - ${dateTo ? format(dateTo, "dd/MM") : "..."}`
                    : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 space-y-3">
                  <div>
                    <Label className="text-xs mb-1 block">De</Label>
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      className="pointer-events-auto"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Até</Label>
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      className="pointer-events-auto"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      <DataTable<Custo>
        columns={columns}
        data={filteredData}
        onRowClick={handleRowClick}
        emptyMessage="Nenhum custo encontrado"
      />

      {/* Details Modal */}
      {selectedCusto && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {(() => {
                  const config = tipoConfig[selectedCusto.tipo];
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={cn("p-2 rounded-lg bg-muted", config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      Detalhes do Custo
                    </>
                  );
                })()}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Header Info */}
              <Card className="p-4 bg-gradient-to-br from-muted/50 to-transparent">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {tipoConfig[selectedCusto.tipo].label}
                    </p>
                    <p className="text-3xl font-bold text-loss">
                      R$ {selectedCusto.valor.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Badge 
                    variant={selectedCusto.comprovante ? "success" : "neutral"}
                    className="text-sm px-3 py-1"
                  >
                    {selectedCusto.comprovante ? (
                      <><FileCheck className="h-4 w-4 mr-1 inline" /> Comprovante Anexado</>
                    ) : (
                      "Sem Comprovante"
                    )}
                  </Badge>
                </div>
              </Card>

              <Separator />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Frete */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>Frete</span>
                  </div>
                  <p className="font-mono font-bold text-primary text-lg">
                    {selectedCusto.freteId}
                  </p>
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Data</span>
                  </div>
                  <p className="font-semibold text-lg">{selectedCusto.data}</p>
                </div>

                {/* Motorista */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Motorista</span>
                  </div>
                  <p className="font-semibold text-lg">{selectedCusto.motorista}</p>
                </div>

                {/* Caminhão */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Caminhão</span>
                  </div>
                  <p className="font-mono font-bold text-lg">{selectedCusto.caminhao}</p>
                </div>
              </div>

              <Separator />

              {/* Rota */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Rota</span>
                </div>
                <p className="font-semibold text-lg">{selectedCusto.rota}</p>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                <Card className="p-4 bg-muted/30">
                  <p className="text-foreground">{selectedCusto.descricao}</p>
                </Card>
              </div>

              {/* Observações */}
              {selectedCusto.observacoes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Observações</p>
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <p className="text-foreground">{selectedCusto.observacoes}</p>
                  </Card>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fechar
              </Button>
              <Button variant="default">
                <Upload className="h-4 w-4 mr-2" />
                Anexar Comprovante
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Cost Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Custo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frete">Frete</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o frete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1250">#1250 - SP → RJ</SelectItem>
                  <SelectItem value="1249">#1249 - PR → SC</SelectItem>
                  <SelectItem value="1248">#1248 - MG → DF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Custo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="combustivel">Combustível</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="pedagio">Pedágio</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descreva o custo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input id="valor" type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Comprovante</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clique ou arraste para anexar
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
