import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusTimeline } from "@/components/shared/StatusTimeline";
import { Plus, MapPin, ArrowRight, Truck, Package, DollarSign, TrendingUp, Edit, Save, X, Weight, Info } from "lucide-react";
import { toast } from "sonner";

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
  fazendaId?: string;
  fazendaNome?: string;
  variedade?: string;
  dataFrete: string;
  quantidadeSacas: number;
  toneladas: number;
  valorPorTonelada: number;
  receita: number;
  custos: number;
  resultado: number;
}

interface EstoqueFazenda {
  id: string;
  fazenda: string;
  localizacao: string;
  mercadoria: string;
  variedade: string;
  quantidadeSacas: number;
  quantidadeInicial: number;
  tarifaPorSaca: number;
  pesoMedioSaca: number;
  safra: string;
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
    dataFrete: "20/01/2025",
    quantidadeSacas: 450,
    toneladas: 11.25,
    valorPorTonelada: 600,
    receita: 6750, // 11.25t × R$ 600/t
    custos: 1720,
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
    dataFrete: "18/01/2025",
    quantidadeSacas: 380,
    toneladas: 9.5,
    valorPorTonelada: 800,
    receita: 7600, // 9.5t × R$ 800/t
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
    dataFrete: "15/01/2025",
    quantidadeSacas: 500,
    toneladas: 12.5,
    valorPorTonelada: 600,
    receita: 7500, // 12.5t × R$ 600/t
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
    dataFrete: "12/01/2025",
    quantidadeSacas: 300,
    toneladas: 7.5,
    valorPorTonelada: 1000,
    receita: 7500, // 7.5t × R$ 1000/t
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
    dataFrete: "10/01/2025",
    quantidadeSacas: 0,
    toneladas: 0,
    valorPorTonelada: 0,
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

export default function Fretes() {
  const [search, setSearch] = useState("");
  const [motoristaFilter, setMotoristaFilter] = useState("all");
  const [caminhaoFilter, setCaminhaoFilter] = useState("all");
  const [fazendaFilter, setFazendaFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedFrete, setSelectedFrete] = useState<Frete | null>(null);
  const [isNewFreteOpen, setIsNewFreteOpen] = useState(false);
  const [isEditingFrete, setIsEditingFrete] = useState(false);
  const [fretesState, setFretesState] = useState<Frete[]>(fretesData);
  const [newFrete, setNewFrete] = useState({
    origem: "",
    destino: "",
    motoristaId: "",
    caminhaoId: "",
    fazendaId: "",
    toneladas: "",
  });
  const [estoquesFazendas, setEstoquesFazendas] = useState<EstoqueFazenda[]>([]);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState<EstoqueFazenda | null>(null);

  const handleOpenNewModal = () => {
    // Buscar estoques de fazendas disponíveis
    const getEstoques = (window as any).getEstoquesFazendas;
    if (getEstoques) {
      const estoques = getEstoques() as EstoqueFazenda[];
      setEstoquesFazendas(estoques.filter(e => e.quantidadeSacas > 0));
    }
    
    setNewFrete({
      origem: "",
      destino: "",
      motoristaId: "",
      caminhaoId: "",
      fazendaId: "",
      toneladas: "",
    });
    setEstoqueSelecionado(null);
    setIsEditingFrete(false);
    setIsNewFreteOpen(true);
  };

  const handleOpenEditModal = () => {
    if (selectedFrete) {
      setNewFrete({
        origem: "",
        destino: selectedFrete.destino,
        motoristaId: selectedFrete.motoristaId,
        caminhaoId: selectedFrete.caminhaoId,
        fazendaId: selectedFrete.fazendaId || "",
        toneladas: selectedFrete.toneladas.toString(),
      });
      setIsEditingFrete(true);
      setSelectedFrete(null);
      setIsNewFreteOpen(true);
    }
  };

  const handleSaveFrete = () => {
    // Validar campos
    if (!newFrete.destino || !newFrete.motoristaId || 
        !newFrete.caminhaoId || !newFrete.fazendaId || !newFrete.toneladas) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (!estoqueSelecionado) {
      toast.error("Selecione uma fazenda com estoque disponível!");
      return;
    }

    const toneladas = parseFloat(newFrete.toneladas);
    if (isNaN(toneladas) || toneladas <= 0) {
      toast.error("Tonelagem inválida!");
      return;
    }

    // Converter toneladas para sacas para validar estoque
    const quantidadeSacas = Math.round((toneladas * 1000) / estoqueSelecionado.pesoMedioSaca);
    const toneladasDisponiveis = (estoqueSelecionado.quantidadeSacas * estoqueSelecionado.pesoMedioSaca) / 1000;
    
    // Validar estoque disponível
    if (toneladas > toneladasDisponiveis) {
      toast.error(`Estoque insuficiente! Disponível: ${toneladasDisponiveis.toFixed(2)}t (${estoqueSelecionado.quantidadeSacas.toLocaleString("pt-BR")} sacas)`);
      return;
    }

    // Buscar dados selecionados
    const motorista = motoristasData.find(m => m.id === newFrete.motoristaId);
    const caminhao = caminhoesData.find(c => c.id === newFrete.caminhaoId);
    const custoAbastecimento = custosAbastecimentoPorCaminhao.find(c => c.id === newFrete.caminhaoId);
    const custoMotorista = custosPorMotorista.find(m => m.motoristaId === newFrete.motoristaId);

    if (!motorista || !caminhao || !custoAbastecimento || !custoMotorista) return;

    // Calcular receita
    const receita = quantidadeSacas * estoqueSelecionado.tarifaPorSaca;
    const distanciaEstimada = 500;
    const combustivelNecess = distanciaEstimada / 5;
    const custoCombustivel = combustivelNecess * custoAbastecimento.custoLitro;
    const custoMotoristaTotal = custoMotorista.diaria;
    const custos = Math.floor(custoCombustivel + custoMotoristaTotal);
    const resultado = receita - custos;

    if (isEditingFrete) {
      toast.success("Frete atualizado com sucesso!");
    } else {
      // Descontar do estoque da fazenda
      const descontarEstoque = (window as any).descontarEstoque;
      if (descontarEstoque) {
        descontarEstoque(estoqueSelecionado.id, quantidadeSacas);
      }

      const novoFrete: Frete = {
        id: `#${Math.floor(Math.random() * 1000) + 1200}`,
        origem: `${estoqueSelecionado.fazenda} - ${estoqueSelecionado.localizacao}`,
        destino: newFrete.destino,
        motorista: motorista.nome,
        motoristaId: motorista.id,
        caminhao: caminhao.placa,
        caminhaoId: caminhao.id,
        mercadoria: estoqueSelecionado.mercadoria,
        mercadoriaId: estoqueSelecionado.id,
        fazendaId: estoqueSelecionado.id,
        fazendaNome: estoqueSelecionado.fazenda,
        variedade: estoqueSelecionado.variedade,
        dataFrete: new Date().toLocaleDateString("pt-BR"),
        quantidadeSacas: quantidadeSacas,
        toneladas: (quantidadeSacas * 25) / 1000,
        valorPorTonelada: estoqueSelecionado.tarifaPorSaca ? (estoqueSelecionado.tarifaPorSaca / 25) * 1000 : 0,
        receita,
        custos,
        resultado,
      };
      setFretesState([novoFrete, ...fretesState]);
      toast.success(`Frete criado! Estoque atualizado: ${(estoqueSelecionado.quantidadeSacas - quantidadeSacas).toLocaleString("pt-BR")} sacas restantes`);
    }

    setIsNewFreteOpen(false);
    setNewFrete({
      origem: "",
      destino: "",
      motoristaId: "",
      caminhaoId: "",
      fazendaId: "",
      toneladas: "",
    });
    setEstoqueSelecionado(null);
  };

  const parseDateBR = (value: string) => {
    const [dia, mes, ano] = value.split("/");
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  };

  const filteredData = fretesState.filter((frete) => {
    const matchesSearch =
      frete.origem.toLowerCase().includes(search.toLowerCase()) ||
      frete.destino.toLowerCase().includes(search.toLowerCase()) ||
      frete.motorista.toLowerCase().includes(search.toLowerCase()) ||
      frete.id.toLowerCase().includes(search.toLowerCase());
    const matchesMotorista = motoristaFilter === "all" || frete.motoristaId === motoristaFilter;
    const matchesCaminhao = caminhaoFilter === "all" || frete.caminhaoId === caminhaoFilter;
    const matchesFazenda = fazendaFilter === "all" || frete.fazendaNome === fazendaFilter;

    let matchesPeriodo = true;
    if (dateFrom || dateTo) {
      const freteDate = parseDateBR(frete.dataFrete);
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (freteDate < from) matchesPeriodo = false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (freteDate > to) matchesPeriodo = false;
      }
    }

    return matchesSearch && matchesMotorista && matchesCaminhao && matchesFazenda && matchesPeriodo;
  });

  const fazendasOptions = Array.from(
    new Set(fretesState.map((f) => f.fazendaNome).filter(Boolean))
  ) as string[];

  const clearFilters = () => {
    setSearch("");
    setMotoristaFilter("all");
    setCaminhaoFilter("all");
    setFazendaFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  const columns = [
    {
      key: "id",
      header: "Frete",
      render: (item: Frete) => (
        <div className="flex items-start gap-3 py-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono font-bold text-lg text-foreground">{item.id}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.dataFrete}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rota",
      header: "Rota",
      render: (item: Frete) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.fazendaNome || "Fazenda"}</p>
              <p className="text-xs text-muted-foreground truncate">{item.origem}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-0 pl-5 relative">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-muted" />
            <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0 absolute left-1" />
            <span className="text-xs text-muted-foreground truncate">{item.destino}</span>
          </div>
        </div>
      ),
    },
    {
      key: "detalhes",
      header: "Motorista",
      render: (item: Frete) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-foreground truncate">{item.motorista}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded font-mono">
              {item.caminhao}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "mercadoria",
      header: "Carga",
      render: (item: Frete) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-foreground">{item.mercadoria}</p>
            {item.variedade && (
              <Badge variant="outline" className="text-xs">
                {item.variedade}
              </Badge>
            )}
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Package className="h-3 w-3 flex-shrink-0" />
              <span className="font-semibold text-primary">{item.quantidadeSacas.toLocaleString("pt-BR")}</span>
              <span>sacas</span>
              <span className="mx-0.5">•</span>
              <Weight className="h-3 w-3 flex-shrink-0" />
              <span className="font-semibold text-primary">{item.toneladas.toFixed(2)}t</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3 w-3 text-profit flex-shrink-0" />
              <span className="font-semibold text-profit">R$ {item.valorPorTonelada.toLocaleString("pt-BR")}/t</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "financeiro",
      header: "Resumo financeiro",
      render: (item: Frete) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Receita total:</span>
            <span className="font-bold text-blue-600">R$ {item.receita.toLocaleString("pt-BR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Custos adicionais:</span>
            <span className="font-bold text-red-600">R$ {item.custos.toLocaleString("pt-BR")}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Custos incluem pedágios, combustível, diárias, etc.
          </p>
        </div>
      ),
    },
    {
      key: "resultado",
      header: "Lucro líquido",
      render: (item: Frete) => {
        const percentualLucro = item.receita > 0 ? ((item.resultado / item.receita) * 100).toFixed(0) : "0";
        return (
          <div className="space-y-2">
            <Badge 
              variant={item.resultado >= 0 ? "profit" : "loss"} 
              className="w-fit font-bold text-lg px-3 py-1"
            >
              {item.resultado >= 0 ? "+" : ""}R$ {item.resultado.toLocaleString("pt-BR")}
            </Badge>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.resultado >= 0 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(Math.abs(parseInt(percentualLucro)), 100)}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${item.resultado >= 0 ? "text-green-600" : "text-red-600"}`}>
                {percentualLucro}%
              </span>
            </div>
          </div>
        );
      },
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
        description="Receita é o valor total do frete. Custos são adicionais (pedágios, diárias, etc.)"
        actions={
          <Button onClick={handleOpenNewModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Frete
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-muted/40">
          <p className="text-sm text-muted-foreground">Fretes no período</p>
          <p className="text-2xl font-bold">{filteredData.length}</p>
        </Card>
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
          <p className="text-sm text-muted-foreground">Receita total</p>
          <p className="text-2xl font-bold text-blue-600">
            R$ {filteredData.reduce((acc, f) => acc + f.receita, 0).toLocaleString("pt-BR")}
          </p>
        </Card>
        <Card className="p-4 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
          <p className="text-sm text-muted-foreground">Custos adicionais</p>
          <p className="text-2xl font-bold text-red-600">
            R$ {filteredData.reduce((acc, f) => acc + f.custos, 0).toLocaleString("pt-BR")}
          </p>
        </Card>
        <Card className="p-4 bg-profit/5 border-profit/20">
          <p className="text-sm text-muted-foreground">Lucro líquido</p>
          <p className="text-2xl font-bold text-profit">
            R$ {filteredData.reduce((acc, f) => acc + f.resultado, 0).toLocaleString("pt-BR")}
          </p>
        </Card>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por ID, origem, destino ou motorista..."
      >
        <Select value={motoristaFilter} onValueChange={setMotoristaFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Motorista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {motoristasData.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={caminhaoFilter} onValueChange={setCaminhaoFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Caminhão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {caminhoesData.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.placa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={fazendaFilter} onValueChange={setFazendaFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Fazenda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {fazendasOptions.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-36"
          />
          <span className="text-xs text-muted-foreground">até</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-36"
          />
        </div>
        <Button variant="outline" onClick={clearFilters} className="gap-2">
          Limpar filtros
        </Button>
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                Frete {selectedFrete?.id}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenEditModal}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </DialogHeader>
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto space-y-6">
          {selectedFrete && (
            <>
              {/* Route Info */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-l-4 border-l-primary">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Origem</p>
                      <p className="font-semibold">{selectedFrete.origem}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Destino</p>
                      <p className="font-semibold">{selectedFrete.destino}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Motorista</p>
                  </div>
                  <p className="font-semibold text-lg text-foreground">{selectedFrete.motorista}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedFrete.caminhao}</p>
                </Card>

                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-muted-foreground">Mercadoria</p>
                  </div>
                  <p className="font-semibold text-foreground">{selectedFrete.mercadoria}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedFrete.quantidadeSacas} sacas • {selectedFrete.toneladas.toFixed(2)} ton • R$ {selectedFrete.valorPorTonelada.toLocaleString("pt-BR")}/t</p>
                </Card>

                <Card className="p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">ID do Frete</p>
                  </div>
                  <p className="font-mono font-bold text-foreground">{selectedFrete.id}</p>
                </Card>
              </div>

              <Separator />

              {/* Financial Summary */}
              <div>
                <h4 className="font-semibold mb-4">Resumo Financeiro</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">RECEITA TOTAL</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      R$ {selectedFrete.receita.toLocaleString("pt-BR")}
                    </p>
                  </Card>

                  <Card className="p-4 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-red-600" />
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">CUSTOS ADICIONAIS</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      R$ {selectedFrete.custos.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-[10px] text-red-600/80 mt-1">Pedágios, combustível, diárias, etc.</p>
                  </Card>

                  <Card className={`p-4 ${selectedFrete.resultado >= 0 
                    ? "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900" 
                    : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={`h-4 w-4 ${selectedFrete.resultado >= 0 ? "text-green-600" : "text-red-600"}`} />
                      <p className={`text-xs font-semibold ${selectedFrete.resultado >= 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>LUCRO LÍQUIDO</p>
                    </div>
                    <p className={`text-3xl font-bold ${selectedFrete.resultado >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {selectedFrete.resultado >= 0 ? "+" : ""}R$ {selectedFrete.resultado.toLocaleString("pt-BR")}
                    </p>
                  </Card>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold mb-4">Timeline do Frete</h4>
                <StatusTimeline steps={timelineSteps} />
              </div>
            </>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New/Edit Frete Modal */}
      <Dialog open={isNewFreteOpen} onOpenChange={setIsNewFreteOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              {isEditingFrete ? "Editar Frete" : "Criar Novo Frete"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-4">
            {/* Seção: Fazenda de Origem */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-green-600" />
                <h3 className="font-semibold text-green-600">Fazenda de Origem</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fazenda" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Selecione a Fazenda *
                  </Label>
                  <Select 
                    value={newFrete.fazendaId} 
                    onValueChange={(v) => {
                      const estoque = estoquesFazendas.find(e => e.id === v);
                      setEstoqueSelecionado(estoque || null);
                      setNewFrete({ ...newFrete, fazendaId: v });
                    }}
                  >
                    <SelectTrigger id="fazenda">
                      <SelectValue placeholder="Selecione uma fazenda com estoque" />
                    </SelectTrigger>
                    <SelectContent>
                      {estoquesFazendas.length === 0 ? (
                        <SelectItem value="none" disabled>Nenhuma fazenda com estoque disponível</SelectItem>
                      ) : (
                        estoquesFazendas.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.fazenda} - {e.mercadoria} ({e.variedade}) - {e.quantidadeSacas.toLocaleString("pt-BR")} sacas
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview do Estoque Selecionado */}
                {estoqueSelecionado && (
                  <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-700">Informações da Fazenda</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Localização:</p>
                          <p className="font-medium">{estoqueSelecionado.localizacao}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mercadoria:</p>
                          <p className="font-medium">{estoqueSelecionado.mercadoria}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Variedade:</p>
                          <p className="font-medium">{estoqueSelecionado.variedade}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Safra:</p>
                          <p className="font-medium">{estoqueSelecionado.safra}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estoque Disponível:</p>
                          <p className="font-bold text-green-700">{estoqueSelecionado.quantidadeSacas.toLocaleString("pt-BR")} sacas</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tarifa por Saca:</p>
                          <p className="font-bold text-green-700">R$ {estoqueSelecionado.tarifaPorSaca}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <Separator className="my-2" />

            {/* Seção: Destino */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Destino</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destino" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Local de Entrega *
                </Label>
                <Input
                  id="destino"
                  placeholder="Ex: Secador Central - Filial 1, RJ"
                  value={newFrete.destino}
                  onChange={(e) => setNewFrete({ ...newFrete, destino: e.target.value })}
                />
              </div>
            </div>

            <Separator className="my-2" />

            {/* Seção: Equipe */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Equipe & Veículo</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motorista" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Motorista *
                  </Label>
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
                  <Label htmlFor="caminhao" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Caminhão *
                  </Label>
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
              </div>
            </div>

            <Separator className="my-2" />

            {/* Seção: Carga */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-blue-600" />
                <h3 className="font-semibold text-blue-600">Quantidade de Carga</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="toneladas" className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-blue-600" />
                    Toneladas *
                  </Label>
                  <Input
                    id="toneladas"
                    type="number"
                    placeholder="Ex: 10.5"
                    step="0.1"
                    min="0.1"
                    value={newFrete.toneladas}
                    onChange={(e) => setNewFrete({ ...newFrete, toneladas: e.target.value })}
                    disabled={!estoqueSelecionado}
                  />
                  {estoqueSelecionado && (
                    <p className="text-xs text-muted-foreground">
                      Máximo disponível: {((estoqueSelecionado.quantidadeSacas * estoqueSelecionado.pesoMedioSaca) / 1000).toFixed(2)} toneladas ({estoqueSelecionado.quantidadeSacas.toLocaleString("pt-BR")} sacas)
                    </p>
                  )}
                </div>

                {/* Preview da Carga */}
                {estoqueSelecionado && newFrete.toneladas && parseFloat(newFrete.toneladas) > 0 && (
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-semibold text-blue-700">Estimativa do Frete</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Toneladas</p>
                          <p className="font-bold text-foreground">
                            {parseFloat(newFrete.toneladas).toFixed(2)} t
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sacas (aproximado)</p>
                          <p className="font-bold text-foreground">
                            {Math.round((parseFloat(newFrete.toneladas) * 1000) / estoqueSelecionado.pesoMedioSaca).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Receita Estimada</p>
                          <p className="font-bold text-profit">
                            R$ {(Math.round((parseFloat(newFrete.toneladas) * 1000) / estoqueSelecionado.pesoMedioSaca) * estoqueSelecionado.tarifaPorSaca).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setIsNewFreteOpen(false);
                setNewFrete({
                  origem: "",
                  destino: "",
                  motoristaId: "",
                  caminhaoId: "",
                  fazendaId: "",
                  toneladas: "",
                });
                setEstoqueSelecionado(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveFrete}>
              <Save className="h-4 w-4 mr-2" />
              {isEditingFrete ? "Salvar Alterações" : "Criar Frete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
