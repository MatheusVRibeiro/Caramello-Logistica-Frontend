import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Package, Weight, DollarSign, Edit, MapPin, TrendingDown, AlertCircle, Save, X, Info } from "lucide-react";
import { toast } from "sonner";

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

const estoqueFazendasData: EstoqueFazenda[] = [
  {
    id: "1",
    fazenda: "Fazenda Santa Esperança",
    localizacao: "Marília, SP",
    mercadoria: "Amendoim em Casca",
    variedade: "Verde",
    quantidadeSacas: 850000,
    quantidadeInicial: 1000000,
    tarifaPorSaca: 15,
    pesoMedioSaca: 25,
    safra: "2024/2025",
  },
  {
    id: "2",
    fazenda: "Fazenda Boa Vista",
    localizacao: "Tupã, SP",
    mercadoria: "Amendoim em Casca",
    variedade: "Vermelho",
    quantidadeSacas: 650000,
    quantidadeInicial: 750000,
    tarifaPorSaca: 16,
    pesoMedioSaca: 25,
    safra: "2024/2025",
  },
  {
    id: "3",
    fazenda: "Fazenda São João",
    localizacao: "Jaboticabal, SP",
    mercadoria: "Amendoim Premium",
    variedade: "Selecionado",
    quantidadeSacas: 180000,
    quantidadeInicial: 300000,
    tarifaPorSaca: 25,
    pesoMedioSaca: 25,
    safra: "2024/2025",
  },
  {
    id: "4",
    fazenda: "Fazenda Vale Verde",
    localizacao: "Ribeirão Preto, SP",
    mercadoria: "Amendoim Descascado",
    variedade: "Tipo 1",
    quantidadeSacas: 420000,
    quantidadeInicial: 500000,
    tarifaPorSaca: 20,
    pesoMedioSaca: 25,
    safra: "2024/2025",
  },
  {
    id: "5",
    fazenda: "Fazenda Recanto",
    localizacao: "Barretos, SP",
    mercadoria: "Amendoim em Casca",
    variedade: "Runner",
    quantidadeSacas: 0,
    quantidadeInicial: 600000,
    tarifaPorSaca: 17,
    pesoMedioSaca: 25,
    safra: "2024/2025",
  },
];

export default function Mercadorias() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEstoque, setSelectedEstoque] = useState<EstoqueFazenda | null>(null);
  const [estoquesState, setEstoquesState] = useState<EstoqueFazenda[]>(estoqueFazendasData);
  const [newEstoque, setNewEstoque] = useState<Partial<EstoqueFazenda>>({
    fazenda: "",
    localizacao: "",
    mercadoria: "",
    variedade: "",
    quantidadeSacas: 0,
    quantidadeInicial: 0,
    tarifaPorSaca: 0,
    pesoMedioSaca: 25,
    safra: "2024/2025",
  });

  const handleOpenNewModal = () => {
    setNewEstoque({
      fazenda: "",
      localizacao: "",
      mercadoria: "",
      variedade: "",
      quantidadeSacas: 0,
      quantidadeInicial: 0,
      tarifaPorSaca: 0,
      pesoMedioSaca: 25,
      safra: "2024/2025",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (estoque: EstoqueFazenda) => {
    setNewEstoque(estoque);
    setIsEditing(true);
    setSelectedEstoque(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newEstoque.fazenda || !newEstoque.mercadoria || !newEstoque.variedade || 
        newEstoque.quantidadeSacas === undefined || newEstoque.quantidadeInicial === undefined) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (isEditing) {
      setEstoquesState(prev => prev.map(e => 
        e.id === newEstoque.id ? { ...e, ...newEstoque } as EstoqueFazenda : e
      ));
      toast.success("Estoque atualizado com sucesso!");
    } else {
      const novoEstoque: EstoqueFazenda = {
        id: `${Math.floor(Math.random() * 10000)}`,
        fazenda: newEstoque.fazenda!,
        localizacao: newEstoque.localizacao || "",
        mercadoria: newEstoque.mercadoria!,
        variedade: newEstoque.variedade!,
        quantidadeSacas: newEstoque.quantidadeSacas!,
        quantidadeInicial: newEstoque.quantidadeInicial!,
        tarifaPorSaca: newEstoque.tarifaPorSaca!,
        pesoMedioSaca: newEstoque.pesoMedioSaca || 25,
        safra: newEstoque.safra || "2024/2025",
      };
      setEstoquesState([novoEstoque, ...estoquesState]);
      toast.success("Estoque cadastrado com sucesso!");
    }

    setIsModalOpen(false);
  };

  const filteredData = estoquesState.filter(
    (e) =>
      e.fazenda.toLowerCase().includes(search.toLowerCase()) ||
      e.mercadoria.toLowerCase().includes(search.toLowerCase()) ||
      e.variedade.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusEstoque = (quantidade: number, inicial: number) => {
    const percentual = (quantidade / inicial) * 100;
    if (quantidade === 0) return "esgotado";
    if (percentual <= 20) return "critico";
    if (percentual <= 50) return "baixo";
    return "normal";
  };

  const columns = [
    {
      key: "fazenda",
      header: "Fazenda",
      render: (item: EstoqueFazenda) => (
        <div className="flex items-start gap-3 py-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{item.fazenda}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.localizacao}</p>
          </div>
        </div>
      ),
    },
    {
      key: "mercadoria",
      header: "Mercadoria",
      render: (item: EstoqueFazenda) => (
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{item.mercadoria}</p>
          <p className="text-xs text-muted-foreground">{item.variedade}</p>
          <Badge variant="outline" className="text-xs mt-1">
            Safra {item.safra}
          </Badge>
        </div>
      ),
    },
    {
      key: "estoque",
      header: "Estoque",
      render: (item: EstoqueFazenda) => {
        const status = getStatusEstoque(item.quantidadeSacas, item.quantidadeInicial);
        const percentual = item.quantidadeInicial > 0 
          ? ((item.quantidadeSacas / item.quantidadeInicial) * 100).toFixed(0)
          : "0";
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg">{item.quantidadeSacas.toLocaleString("pt-BR")}</span>
              <span className="text-xs text-muted-foreground">/{item.quantidadeInicial.toLocaleString("pt-BR")} sacas</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Disponível</span>
                <span className={`font-bold ${
                  status === "esgotado" ? "text-red-600" :
                  status === "critico" ? "text-orange-600" :
                  status === "baixo" ? "text-yellow-600" :
                  "text-green-600"
                }`}>{percentual}%</span>
              </div>
              <Progress 
                value={Number(percentual)} 
                className={`h-2 ${
                  status === "esgotado" ? "[&>div]:bg-red-500" :
                  status === "critico" ? "[&>div]:bg-orange-500" :
                  status === "baixo" ? "[&>div]:bg-yellow-500" :
                  "[&>div]:bg-green-500"
                }`}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "peso",
      header: "Peso Total",
      render: (item: EstoqueFazenda) => (
        <div className="flex items-center gap-2">
          <Weight className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold text-foreground">
            {((item.quantidadeSacas * item.pesoMedioSaca) / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs text-muted-foreground">toneladas</span>
        </div>
      ),
    },
    {
      key: "valor",
      header: "Valor Estimado",
      render: (item: EstoqueFazenda) => {
        const valorTotal = item.quantidadeSacas * item.tarifaPorSaca;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-bold text-green-600 text-lg">
                R$ {valorTotal.toLocaleString("pt-BR")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">R$ {item.tarifaPorSaca}/saca</p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item: EstoqueFazenda) => {
        const status = getStatusEstoque(item.quantidadeSacas, item.quantidadeInicial);
        const config = {
          esgotado: { label: "Esgotado", variant: "cancelled" as const, icon: AlertCircle },
          critico: { label: "Crítico", variant: "loss" as const, icon: AlertCircle },
          baixo: { label: "Baixo", variant: "warning" as const, icon: TrendingDown },
          normal: { label: "Normal", variant: "active" as const, icon: Package },
        };
        const Icon = config[status].icon;
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <Badge variant={config[status].variant} className="font-semibold">
              {config[status].label}
            </Badge>
          </div>
        );
      },
    },
  ];

  // Função exportada para ser usada no sistema de fretes
  (window as any).descontarEstoque = (fazendaId: string, quantidade: number) => {
    setEstoquesState(prev => prev.map(e => 
      e.id === fazendaId ? { ...e, quantidadeSacas: Math.max(0, e.quantidadeSacas - quantidade) } : e
    ));
  };

  // Expor estoques para uso em outras páginas
  (window as any).getEstoquesFazendas = () => estoquesState;

  return (
    <MainLayout
      title="Mercadorias"
      subtitle="Gestão de estoques por fazenda"
    >
      <div className="space-y-6">
        <PageHeader
          title="Estoque de Mercadorias"
          actions={
            <Button onClick={handleOpenNewModal}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Estoque
            </Button>
          }
        />

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por fazenda, mercadoria ou variedade..."
        />

        {/* Cards Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Total de Fazendas</p>
                  <p className="text-xl font-bold mt-0.5">{estoquesState.length}</p>
                </div>
                <MapPin className="h-6 w-6 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Sacas Disponíveis</p>
                  <p className="text-xl font-bold mt-0.5">
                    {estoquesState.reduce((acc, e) => acc + e.quantidadeSacas, 0).toLocaleString("pt-BR")}
                  </p>
                </div>
                <Package className="h-6 w-6 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Toneladas</p>
                  <p className="text-xl font-bold mt-0.5">
                    {(estoquesState.reduce((acc, e) => acc + (e.quantidadeSacas * e.pesoMedioSaca), 0) / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <Weight className="h-6 w-6 text-purple-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Valor Estimado</p>
                  <p className="text-xl font-bold mt-0.5">
                    R$ {estoquesState.reduce((acc, e) => acc + (e.quantidadeSacas * e.tarifaPorSaca), 0).toLocaleString("pt-BR")}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          onRowClick={(item) => setSelectedEstoque(item)}
        />
      </div>

      {/* Modal de Novo/Editar Estoque */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isEditing ? "Editar Estoque" : "Novo Estoque de Fazenda"}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
            {/* Seção: Localização */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-green-600">Localização</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fazenda">Nome da Fazenda *</Label>
                  <Input
                    id="fazenda"
                    placeholder="Ex: Fazenda Santa Esperança"
                    value={newEstoque.fazenda}
                    onChange={(e) => setNewEstoque({ ...newEstoque, fazenda: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input
                    id="localizacao"
                    placeholder="Ex: Marília, SP"
                    value={newEstoque.localizacao}
                    onChange={(e) => setNewEstoque({ ...newEstoque, localizacao: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Seção: Mercadoria */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Package className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-blue-600">Mercadoria</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mercadoria">Tipo de Mercadoria *</Label>
                  <Input
                    id="mercadoria"
                    placeholder="Ex: Amendoim em Casca"
                    value={newEstoque.mercadoria}
                    onChange={(e) => setNewEstoque({ ...newEstoque, mercadoria: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variedade">Variedade/Cor *</Label>
                  <Input
                    id="variedade"
                    placeholder="Ex: Verde, Vermelho, Runner"
                    value={newEstoque.variedade}
                    onChange={(e) => setNewEstoque({ ...newEstoque, variedade: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safra">Safra</Label>
                  <Input
                    id="safra"
                    placeholder="Ex: 2024/2025"
                    value={newEstoque.safra}
                    onChange={(e) => setNewEstoque({ ...newEstoque, safra: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoMedioSaca">Peso Médio por Saca (kg)</Label>
                  <Input
                    id="pesoMedioSaca"
                    type="number"
                    placeholder="25"
                    value={newEstoque.pesoMedioSaca}
                    onChange={(e) => setNewEstoque({ ...newEstoque, pesoMedioSaca: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Seção: Estoque */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Weight className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold text-purple-600">Quantidades</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidadeInicial">Quantidade Inicial (sacas) *</Label>
                  <Input
                    id="quantidadeInicial"
                    type="number"
                    placeholder="Ex: 1000000"
                    value={newEstoque.quantidadeInicial}
                    onChange={(e) => setNewEstoque({ ...newEstoque, quantidadeInicial: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Capacidade total da fazenda
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidadeSacas">Quantidade Disponível (sacas) *</Label>
                  <Input
                    id="quantidadeSacas"
                    type="number"
                    placeholder="Ex: 1000000"
                    value={newEstoque.quantidadeSacas}
                    onChange={(e) => setNewEstoque({ ...newEstoque, quantidadeSacas: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantidade atual em estoque
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tarifaPorSaca">Tarifa por Saca (R$)</Label>
                  <Input
                    id="tarifaPorSaca"
                    type="number"
                    placeholder="Ex: 15"
                    value={newEstoque.tarifaPorSaca}
                    onChange={(e) => setNewEstoque({ ...newEstoque, tarifaPorSaca: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Valor Total Estimado</Label>
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted/50">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">
                      R$ {((newEstoque.quantidadeSacas || 0) * (newEstoque.tarifaPorSaca || 0)).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview do estoque */}
              {newEstoque.quantidadeSacas !== undefined && newEstoque.quantidadeInicial !== undefined && 
               newEstoque.quantidadeInicial > 0 && (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-semibold text-blue-600">Preview do Estoque</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Percentual Disponível</span>
                        <span className="font-bold">
                          {((newEstoque.quantidadeSacas / newEstoque.quantidadeInicial) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(newEstoque.quantidadeSacas / newEstoque.quantidadeInicial) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {((newEstoque.quantidadeSacas * (newEstoque.pesoMedioSaca || 25)) / 1000).toFixed(0)} toneladas disponíveis
                        </span>
                        <span>
                          {((newEstoque.quantidadeInicial * (newEstoque.pesoMedioSaca || 25)) / 1000).toFixed(0)} ton. total
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Salvar Alterações" : "Cadastrar Estoque"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedEstoque} onOpenChange={() => setSelectedEstoque(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-green-600" />
              {selectedEstoque?.fazenda}
            </DialogTitle>
          </DialogHeader>

          {selectedEstoque && (
            <div className="space-y-6">
              {/* Cards Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estoque Disponível</p>
                        <p className="text-2xl font-bold text-green-700">
                          {selectedEstoque.quantidadeSacas.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          de {selectedEstoque.quantidadeInicial.toLocaleString("pt-BR")} sacas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Weight className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Peso Total</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {((selectedEstoque.quantidadeSacas * selectedEstoque.pesoMedioSaca) / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground">toneladas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Estimado</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          R$ {(selectedEstoque.quantidadeSacas * selectedEstoque.tarifaPorSaca).toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          R$ {selectedEstoque.tarifaPorSaca}/saca
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Informações Detalhadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Localização
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fazenda:</span>
                      <span className="font-medium">{selectedEstoque.fazenda}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Região:</span>
                      <span className="font-medium">{selectedEstoque.localizacao}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    Mercadoria
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{selectedEstoque.mercadoria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variedade:</span>
                      <Badge variant="outline">{selectedEstoque.variedade}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Safra:</span>
                      <span className="font-medium">{selectedEstoque.safra}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso do Estoque */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Nível do Estoque</span>
                    <Badge variant={
                      getStatusEstoque(selectedEstoque.quantidadeSacas, selectedEstoque.quantidadeInicial) === "esgotado" ? "cancelled" :
                      getStatusEstoque(selectedEstoque.quantidadeSacas, selectedEstoque.quantidadeInicial) === "critico" ? "loss" :
                      getStatusEstoque(selectedEstoque.quantidadeSacas, selectedEstoque.quantidadeInicial) === "baixo" ? "warning" :
                      "active"
                    }>
                      {((selectedEstoque.quantidadeSacas / selectedEstoque.quantidadeInicial) * 100).toFixed(1)}% Disponível
                    </Badge>
                  </div>
                  <Progress 
                    value={(selectedEstoque.quantidadeSacas / selectedEstoque.quantidadeInicial) * 100} 
                    className="h-3"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Consumido: {(selectedEstoque.quantidadeInicial - selectedEstoque.quantidadeSacas).toLocaleString("pt-BR")} sacas</span>
                    <span>Restam: {selectedEstoque.quantidadeSacas.toLocaleString("pt-BR")} sacas</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedEstoque(null)}>
              Fechar
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                handleOpenEditModal(selectedEstoque!);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Estoque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
