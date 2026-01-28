import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusTimeline } from "@/components/shared/StatusTimeline";
import { Plus, MapPin, ArrowRight } from "lucide-react";

interface Frete {
  id: string;
  origem: string;
  destino: string;
  motorista: string;
  motoristaId: string;
  caminhao: string;
  caminhaoId: string;
  mercadoria: string;
  mercadoriaId: string;
  quantidadeSacas: number;
  status: "em_transito" | "concluido" | "pendente" | "cancelado";
  receita: number;
  custos: number;
  resultado: number;
}

interface Motorista {
  id: string;
  nome: string;
}

interface Caminhao {
  id: string;
  placa: string;
}

interface Mercadoria {
  id: string;
  nome: string;
  tarifaPorSaca: number; // Tarifa por saca de amendoim
  pesoMedioSaca: number; // Peso médio em kg
}

interface CustoAbastecimento {
  id: string;
  custoLitro: number;
}

interface CustoMotorista {
  motoristaId: string;
  diaria: number;
  adicionalPernoite: number;
}

const fretesData: Frete[] = [
  {
    id: "#1250",
    origem: "Fazenda Santa Rita",
    destino: "Secador Central - Filial 1",
    motorista: "Carlos Silva",
    motoristaId: "1",
    caminhao: "ABC-1234",
    caminhaoId: "1",
    mercadoria: "Amendoim em Casca",
    mercadoriaId: "1",
    quantidadeSacas: 450,
    status: "em_transito",
    receita: 6750, // 450 sacas × R$ 15/saca
    custos: 1720, // Combustível + Diária
    resultado: 5030,
  },
  {
    id: "#1249",
    origem: "Fazenda Boa Esperança",
    destino: "Secador Central - Filial 2",
    motorista: "João Oliveira",
    motoristaId: "2",
    caminhao: "DEF-5678",
    caminhaoId: "2",
    mercadoria: "Amendoim Descascado",
    mercadoriaId: "2",
    quantidadeSacas: 380,
    status: "concluido",
    receita: 7600, // 380 sacas × R$ 20/saca
    custos: 1690,
    resultado: 5910,
  },
  {
    id: "#1248",
    origem: "Fazenda Vale Verde",
    destino: "Secador Central - Filial 1",
    motorista: "Pedro Santos",
    motoristaId: "3",
    caminhao: "GHI-9012",
    caminhaoId: "3",
    mercadoria: "Amendoim em Casca",
    mercadoriaId: "1",
    quantidadeSacas: 500,
    status: "pendente",
    receita: 7500, // 500 sacas × R$ 15/saca
    custos: 0,
    resultado: 7500,
  },
  {
    id: "#1247",
    origem: "Fazenda São João",
    destino: "Secador Central - Filial 3",
    motorista: "André Costa",
    motoristaId: "4",
    caminhao: "JKL-3456",
    caminhaoId: "4",
    mercadoria: "Amendoim Premium",
    mercadoriaId: "3",
    quantidadeSacas: 300,
    status: "concluido",
    receita: 7500, // 300 sacas × R$ 25/saca
    custos: 1720,
    resultado: 5780,
  },
  {
    id: "#1246",
    origem: "Fazenda Recanto",
    destino: "Secador Central - Filial 2",
    motorista: "Lucas Ferreira",
    motoristaId: "5",
    caminhao: "MNO-7890",
    caminhaoId: "5",
    mercadoria: "Amendoim em Casca",
    mercadoriaId: "1",
    quantidadeSacas: 0,
    status: "cancelado",
    receita: 0,
    custos: 0,
    resultado: 0,
  },
];

// Data demo de motoristas
const motoristasData: Motorista[] = [
  { id: "1", nome: "Carlos Silva" },
  { id: "2", nome: "João Oliveira" },
  { id: "3", nome: "Pedro Santos" },
  { id: "4", nome: "André Costa" },
  { id: "5", nome: "Lucas Ferreira" },
];

// Data demo de caminhões
const caminhoesData: Caminhao[] = [
  { id: "1", placa: "ABC-1234" },
  { id: "2", placa: "DEF-5678" },
  { id: "3", placa: "GHI-9012" },
  { id: "4", placa: "JKL-3456" },
  { id: "5", placa: "MNO-7890" },
];

// Data demo de mercadorias com tarifas
const mercadoriasData: Mercadoria[] = [
  { id: "1", nome: "Amendoim em Casca", tarifaPorSaca: 15, pesoMedioSaca: 25 },
  { id: "2", nome: "Amendoim Descascado", tarifaPorSaca: 20, pesoMedioSaca: 25 },
  { id: "3", nome: "Amendoim Premium", tarifaPorSaca: 25, pesoMedioSaca: 25 },
  { id: "4", nome: "Amendoim Tipo 1", tarifaPorSaca: 18, pesoMedioSaca: 25 },
  { id: "5", nome: "Amendoim Tipo 2", tarifaPorSaca: 16, pesoMedioSaca: 25 },
];

// Custos de abastecimento por caminhão (litro)
const custosAbastecimentoPorCaminhao: CustoAbastecimento[] = [
  { id: "1", custoLitro: 5.50 }, // ABC-1234
  { id: "2", custoLitro: 5.30 }, // DEF-5678
  { id: "3", custoLitro: 5.80 }, // GHI-9012
  { id: "4", custoLitro: 5.40 }, // JKL-3456
  { id: "5", custoLitro: 5.60 }, // MNO-7890
];

// Custos de motorista (diária + adicional pernoite)
const custosPorMotorista: CustoMotorista[] = [
  { motoristaId: "1", diaria: 150, adicionalPernoite: 80 }, // Carlos Silva
  { motoristaId: "2", diaria: 140, adicionalPernoite: 75 }, // João Oliveira
  { motoristaId: "3", diaria: 160, adicionalPernoite: 85 }, // Pedro Santos
  { motoristaId: "4", diaria: 145, adicionalPernoite: 78 }, // André Costa
  { motoristaId: "5", diaria: 155, adicionalPernoite: 82 }, // Lucas Ferreira
];

const statusConfig = {
  em_transito: { label: "Em Trânsito", variant: "inTransit" as const },
  concluido: { label: "Concluído", variant: "completed" as const },
  pendente: { label: "Pendente", variant: "pending" as const },
  cancelado: { label: "Cancelado", variant: "cancelled" as const },
};

export default function Fretes() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFrete, setSelectedFrete] = useState<Frete | null>(null);
  const [isNewFreteOpen, setIsNewFreteOpen] = useState(false);
  const [fretesState, setFretesState] = useState<Frete[]>(fretesData);
  const [newFrete, setNewFrete] = useState({
    origem: "",
    destino: "",
    motoristaId: "",
    caminhaoId: "",
    mercadoriaId: "",
    quantidadeSacas: "",
  });

  const filteredData = fretesState.filter((frete) => {
    const matchesSearch =
      frete.origem.toLowerCase().includes(search.toLowerCase()) ||
      frete.destino.toLowerCase().includes(search.toLowerCase()) ||
      frete.motorista.toLowerCase().includes(search.toLowerCase()) ||
      frete.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || frete.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "id",
      header: "ID",
      render: (item: Frete) => (
        <span className="font-mono text-sm">{item.id}</span>
      ),
    },
    {
      key: "rota",
      header: "Rota",
      render: (item: Frete) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{item.origem}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span>{item.destino}</span>
        </div>
      ),
    },
    { key: "motorista", header: "Motorista" },
    { key: "caminhao", header: "Caminhão" },
    {
      key: "mercadoria",
      header: "Mercadoria",
      render: (item: Frete) => (
        <div>
          <p className="font-medium">{item.mercadoria}</p>
          <p className="text-xs text-muted-foreground">{item.quantidadeSacas} sacas</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Frete) => (
        <Badge variant={statusConfig[item.status].variant}>
          {statusConfig[item.status].label}
        </Badge>
      ),
    },
    {
      key: "receita",
      header: "Receita",
      render: (item: Frete) => (
        <span className="font-medium">
          R$ {item.receita.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "custos",
      header: "Custos",
      render: (item: Frete) => (
        <span className="text-muted-foreground">
          R$ {item.custos.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "resultado",
      header: "Resultado",
      render: (item: Frete) => (
        <Badge variant={item.resultado >= 0 ? "profit" : "loss"}>
          {item.resultado >= 0 ? "+" : ""}R${" "}
          {item.resultado.toLocaleString("pt-BR")}
        </Badge>
      ),
    },
  ];

  const timelineSteps = [
    { label: "Pedido criado", date: "15/01/2025 - 08:30", completed: true },
    { label: "Carregamento", date: "15/01/2025 - 10:00", completed: true },
    { label: "Em trânsito", date: "15/01/2025 - 11:30", completed: true, current: true },
    { label: "Entrega", completed: false },
    { label: "Conclusão", completed: false },
  ];

  return (
    <MainLayout title="Fretes" subtitle="Gestão de fretes e entregas">
      <PageHeader
        title="Fretes"
        description="Gerencie todos os fretes do sistema"
        actions={
          <Button onClick={() => setIsNewFreteOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Frete
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por ID, origem, destino ou motorista..."
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_transito">Em Trânsito</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable<Frete>
        columns={columns}
        data={filteredData}
        onRowClick={(item) => setSelectedFrete(item)}
        highlightNegative={(item) => item.resultado < 0}
        emptyMessage="Nenhum frete encontrado"
      />

      {/* Frete Detail Modal */}
      <Dialog open={!!selectedFrete} onOpenChange={() => setSelectedFrete(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Frete {selectedFrete?.id}</DialogTitle>
          </DialogHeader>
          {selectedFrete && (
            <div className="space-y-6">
              {/* Route Info */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{selectedFrete.origem}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{selectedFrete.destino}</span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Motorista</p>
                  <p className="font-medium">{selectedFrete.motorista}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Caminhão</p>
                  <p className="font-medium">{selectedFrete.caminhao}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mercadoria</p>
                  <p className="font-medium">{selectedFrete.mercadoria}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="font-medium">{selectedFrete.quantidadeSacas} sacas</p>
                  <p className="text-xs text-muted-foreground">
                    {((selectedFrete.quantidadeSacas * 25) / 1000).toFixed(2)} toneladas
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusConfig[selectedFrete.status].variant}>
                    {statusConfig[selectedFrete.status].label}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resultado</p>
                  <Badge variant={selectedFrete.resultado >= 0 ? "profit" : "loss"}>
                    {selectedFrete.resultado >= 0 ? "+" : ""}R${" "}
                    {selectedFrete.resultado.toLocaleString("pt-BR")}
                  </Badge>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">Receita</p>
                  <p className="text-xl font-bold text-primary">
                    R$ {selectedFrete.receita.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="p-4 bg-loss/5 rounded-lg border border-loss/20">
                  <p className="text-sm text-muted-foreground">Custos</p>
                  <p className="text-xl font-bold text-loss">
                    R$ {selectedFrete.custos.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    selectedFrete.resultado >= 0
                      ? "bg-profit/5 border-profit/20"
                      : "bg-loss/5 border-loss/20"
                  }`}
                >
                  <p className="text-sm text-muted-foreground">Resultado</p>
                  <p
                    className={`text-xl font-bold ${
                      selectedFrete.resultado >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    {selectedFrete.resultado >= 0 ? "+" : ""}R${" "}
                    {selectedFrete.resultado.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-4">Timeline do Frete</h4>
                <StatusTimeline steps={timelineSteps} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Frete Modal */}
      <Dialog open={isNewFreteOpen} onOpenChange={setIsNewFreteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Frete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Input
                id="origem"
                placeholder="Ex: São Paulo, SP"
                value={newFrete.origem}
                onChange={(e) =>
                  setNewFrete({ ...newFrete, origem: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Input
                id="destino"
                placeholder="Ex: Rio de Janeiro, RJ"
                value={newFrete.destino}
                onChange={(e) =>
                  setNewFrete({ ...newFrete, destino: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motorista">Motorista</Label>
              <Select 
                value={newFrete.motoristaId} 
                onValueChange={(v) => setNewFrete({ ...newFrete, motoristaId: v })}
              >
                <SelectTrigger id="motorista">
                  <SelectValue placeholder="Selecione um motorista" />
                </SelectTrigger>
                <SelectContent>
                  {motoristasData.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caminhao">Caminhão</Label>
              <Select 
                value={newFrete.caminhaoId} 
                onValueChange={(v) => setNewFrete({ ...newFrete, caminhaoId: v })}
              >
                <SelectTrigger id="caminhao">
                  <SelectValue placeholder="Selecione um caminhão" />
                </SelectTrigger>
                <SelectContent>
                  {caminhoesData.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mercadoria">Mercadoria</Label>
              <Select 
                value={newFrete.mercadoriaId} 
                onValueChange={(v) => setNewFrete({ ...newFrete, mercadoriaId: v })}
              >
                <SelectTrigger id="mercadoria">
                  <SelectValue placeholder="Selecione uma mercadoria" />
                </SelectTrigger>
                <SelectContent>
                  {mercadoriasData.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome} (R$ {m.tarifaPorSaca}/saca)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidadeSacas">Quantidade de Sacas</Label>
              <Input
                id="quantidadeSacas"
                type="number"
                placeholder="Ex: 500"
                value={newFrete.quantidadeSacas}
                onChange={(e) =>
                  setNewFrete({ ...newFrete, quantidadeSacas: e.target.value })
                }
              />
              {newFrete.mercadoriaId && newFrete.quantidadeSacas && (
                <p className="text-sm text-muted-foreground">
                  Peso estimado: {(parseInt(newFrete.quantidadeSacas) * 
                    (mercadoriasData.find(m => m.id === newFrete.mercadoriaId)?.pesoMedioSaca || 0) / 1000).toFixed(2)} toneladas
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewFreteOpen(false);
                setNewFrete({
                  origem: "",
                  destino: "",
                  motoristaId: "",
                  caminhaoId: "",
                  mercadoriaId: "",
                  quantidadeSacas: "",
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Validar campos
                if (!newFrete.origem || !newFrete.destino || !newFrete.motoristaId || 
                    !newFrete.caminhaoId || !newFrete.mercadoriaId || !newFrete.quantidadeSacas) {
                  alert("Preencha todos os campos!");
                  return;
                }

                const quantidadeSacas = parseInt(newFrete.quantidadeSacas);
                if (isNaN(quantidadeSacas) || quantidadeSacas <= 0) {
                  alert("Quantidade de sacas inválida!");
                  return;
                }

                // Buscar dados selecionados
                const motorista = motoristasData.find(m => m.id === newFrete.motoristaId);
                const caminhao = caminhoesData.find(c => c.id === newFrete.caminhaoId);
                const mercadoria = mercadoriasData.find(m => m.id === newFrete.mercadoriaId);
                const custoAbastecimento = custosAbastecimentoPorCaminhao.find(c => c.id === newFrete.caminhaoId);
                const custoMotorista = custosPorMotorista.find(m => m.motoristaId === newFrete.motoristaId);

                if (!motorista || !caminhao || !mercadoria || !custoAbastecimento || !custoMotorista) return;

                // Calcular receita baseado na quantidade de sacas
                const receita = quantidadeSacas * mercadoria.tarifaPorSaca;

                // Calcular custos específicos do caminhão e motorista
                // Custos de abastecimento: estimativa baseada no peso (500km com consumo de 5km/litro)
                const distanciaEstimada = 500;
                const combustivelNecess = distanciaEstimada / 5;
                const custoCombustivel = combustivelNecess * custoAbastecimento.custoLitro;
                
                // Custo de motorista: 1 diária (assumindo viagem de 1 dia)
                const custoMotoristaTotal = custoMotorista.diaria;
                
                // Custos totais
                const custos = Math.floor(custoCombustivel + custoMotoristaTotal);
                const resultado = receita - custos;

                // Criar novo frete
                const novoFrete: Frete = {
                  id: `#${Math.floor(Math.random() * 1000) + 1200}`,
                  origem: newFrete.origem,
                  destino: newFrete.destino,
                  motorista: motorista.nome,
                  motoristaId: motorista.id,
                  caminhao: caminhao.placa,
                  caminhaoId: caminhao.id,
                  mercadoria: mercadoria.nome,
                  mercadoriaId: mercadoria.id,
                  quantidadeSacas: quantidadeSacas,
                  status: "pendente",
                  receita,
                  custos,
                  resultado,
                };

                // Adicionar à lista
                setFretesState([novoFrete, ...fretesState]);
                setIsNewFreteOpen(false);
                setNewFrete({
                  origem: "",
                  destino: "",
                  motoristaId: "",
                  caminhaoId: "",
                  mercadoriaId: "",
                  quantidadeSacas: "",
                });
              }}
            >
              Criar Frete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
