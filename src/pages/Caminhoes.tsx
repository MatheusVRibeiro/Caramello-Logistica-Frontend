import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Plus, Edit, Eye, Truck, Gauge, Weight, CalendarDays, Wrench, AlertCircle, Save, X, Info } from "lucide-react";
import { toast } from "sonner";

interface Caminhao {
  id: string;
  placa: string;
  modelo: string;
  fabricacao: string;
  capacidade: number;
  status: "disponivel" | "em_viagem" | "manutencao";
  kmRodados: number;
  motorista?: string;
  ultimaManutencao: string;
  proxistaManutencao: number;
}

const caminhoesData: Caminhao[] = [
  {
    id: "1",
    placa: "ABC-1234",
    modelo: "Volvo FH 540",
    fabricacao: "2020",
    capacidade: 40,
    status: "em_viagem",
    kmRodados: 245000,
    motorista: "Carlos Silva",
    ultimaManutencao: "15/01/2025",
    proxistaManutencao: 250000,
  },
  {
    id: "2",
    placa: "DEF-5678",
    modelo: "Scania R450",
    fabricacao: "2019",
    capacidade: 35,
    status: "disponivel",
    kmRodados: 180000,
    motorista: "João Oliveira",
    ultimaManutencao: "10/01/2025",
    proxistaManutencao: 200000,
  },
  {
    id: "3",
    placa: "GHI-9012",
    modelo: "Mercedes Actros",
    fabricacao: "2018",
    capacidade: 38,
    status: "manutencao",
    kmRodados: 320000,
    ultimaManutencao: "25/01/2025",
    proxistaManutencao: 350000,
  },
  {
    id: "4",
    placa: "JKL-3456",
    modelo: "DAF XF",
    fabricacao: "2021",
    capacidade: 42,
    status: "disponivel",
    kmRodados: 95000,
    motorista: "Pedro Santos",
    ultimaManutencao: "05/01/2025",
    proxistaManutencao: 150000,
  },
  {
    id: "5",
    placa: "MNO-7890",
    modelo: "Volvo FH 500",
    fabricacao: "2020",
    capacidade: 40,
    status: "em_viagem",
    kmRodados: 210000,
    motorista: "André Costa",
    ultimaManutencao: "12/01/2025",
    proxistaManutencao: 240000,
  },
];

const statusConfig = {
  disponivel: { label: "Disponível", variant: "active" as const },
  em_viagem: { label: "Em Viagem", variant: "inTransit" as const },
  manutencao: { label: "Manutenção", variant: "warning" as const },
};

export default function Caminhoes() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCaminhao, setSelectedCaminhao] = useState<Caminhao | null>(null);
  const [editedCaminhao, setEditedCaminhao] = useState<Partial<Caminhao>>({});

  const handleOpenNewModal = () => {
    setEditedCaminhao({
      placa: "",
      modelo: "",
      fabricacao: "",
      capacidade: 0,
      status: "disponivel",
      kmRodados: 0,
      ultimaManutencao: "",
      proxistaManutencao: 0,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (caminhao: Caminhao) => {
    setEditedCaminhao(caminhao);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      toast.success("Caminhão atualizado com sucesso!");
    } else {
      toast.success("Caminhão cadastrado com sucesso!");
    }
    setIsModalOpen(false);
  };

  const filteredData = caminhoesData.filter((caminhao) => {
    const matchesSearch =
      caminhao.placa.toLowerCase().includes(search.toLowerCase()) ||
      caminhao.modelo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || caminhao.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getMaintenanceStatus = (km: number, proxima: number) => {
    const percentual = (km / proxima) * 100;
    if (percentual >= 90) return "critical";
    if (percentual >= 70) return "warning";
    return "ok";
  };

  const columns = [
    {
      key: "placa",
      header: "Caminhão",
      render: (item: Caminhao) => (
        <div className="flex items-start gap-3 py-2">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono font-bold text-lg text-foreground">{item.placa}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{item.modelo}</p>
            <p className="text-xs text-muted-foreground mt-1">Fab. {item.fabricacao}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Caminhao) => (
        <div className="flex items-center gap-3">
          <Badge variant={statusConfig[item.status].variant} className="font-semibold">
            {statusConfig[item.status].label}
          </Badge>
          {item.motorista && (
            <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-950/40 rounded text-blue-700 dark:text-blue-300">
              {item.motorista}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "capacidade",
      header: "Especificações",
      render: (item: Caminhao) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{item.capacidade} ton</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{item.kmRodados.toLocaleString("pt-BR")} km</span>
          </div>
        </div>
      ),
    },
    {
      key: "proximaManutencao",
      header: "Manutenção",
      render: (item: Caminhao) => {
        const status = getMaintenanceStatus(item.kmRodados, item.proxistaManutencao);
        const percentual = ((item.kmRodados / item.proxistaManutencao) * 100).toFixed(0);
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.ultimaManutencao}</span>
            </div>
            <div className="flex items-center gap-2">
              {status === "critical" && <AlertCircle className="h-4 w-4 text-red-500" />}
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    status === "critical"
                      ? "bg-red-500"
                      : status === "warning"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(parseInt(percentual), 100)}%` }}
                />
              </div>
              <span className="text-xs font-semibold">{percentual}%</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "acoes",
      header: "Ações",
      render: (item: Caminhao) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCaminhao(item);
            }}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Ver</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(item);
            }}
            className="gap-1"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Editar</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Caminhões" subtitle="Gestão da frota">
      <PageHeader
        title="Caminhões"
        description="Gerencie sua frota de veículos"
        actions={
          <Button onClick={handleOpenNewModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Caminhão
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por placa ou modelo..."
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="em_viagem">Em Viagem</SelectItem>
            <SelectItem value="manutencao">Manutenção</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable<Caminhao>
        columns={columns}
        data={filteredData}
        emptyMessage="Nenhum caminhão encontrado"
      />

      {/* Details Modal */}
      <Dialog open={!!selectedCaminhao} onOpenChange={() => setSelectedCaminhao(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Detalhes do Caminhão</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedCaminhao) {
                    handleOpenEditModal(selectedCaminhao);
                    setSelectedCaminhao(null);
                  }
                }}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </DialogHeader>
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
          {selectedCaminhao && (
            <div className="space-y-6">
              {/* Header */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-mono font-bold mb-1">{selectedCaminhao.placa}</p>
                      <p className="text-lg font-semibold mb-2">{selectedCaminhao.modelo}</p>
                      <Badge variant={statusConfig[selectedCaminhao.status].variant} className="text-sm">
                        {statusConfig[selectedCaminhao.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">Ano de Fabricação</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{selectedCaminhao.fabricacao}</p>
                </Card>

                <Card className="p-4 border-l-4 border-l-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-muted-foreground">Capacidade</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{selectedCaminhao.capacidade} ton</p>
                </Card>

                <Card className="p-4 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-purple-600" />
                    <p className="text-sm text-muted-foreground">KM Rodados</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedCaminhao.kmRodados.toLocaleString("pt-BR")}
                  </p>
                </Card>
              </div>

              <Separator />

              {/* Maintenance */}
              {(() => {
                const status = getMaintenanceStatus(selectedCaminhao.kmRodados, selectedCaminhao.proxistaManutencao);
                const percentual = ((selectedCaminhao.kmRodados / selectedCaminhao.proxistaManutencao) * 100).toFixed(0);
                return (
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Status de Manutenção
                    </h4>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Última Manutenção</p>
                            <p className="font-semibold">{selectedCaminhao.ultimaManutencao}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Próxima em</p>
                            <p className="font-semibold">{selectedCaminhao.proxistaManutencao.toLocaleString("pt-BR")} km</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progressão</span>
                            <span className="text-sm font-bold">{percentual}%</span>
                          </div>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                status === "critical"
                                  ? "bg-red-500"
                                  : status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(parseInt(percentual), 100)}%` }}
                            />
                          </div>
                          {status === "critical" && (
                            <div className="flex items-center gap-2 text-red-600 text-xs font-semibold mt-2">
                              <AlertCircle className="h-4 w-4" />
                              Manutenção crítica - Agende imediatamente!
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })()}

              {selectedCaminhao.motorista && (
                <>
                  <Separator />
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
                    <p className="text-sm text-muted-foreground mb-1">Motorista Designado</p>
                    <p className="font-semibold text-lg text-blue-700 dark:text-blue-300">{selectedCaminhao.motorista}</p>
                  </Card>
                </>
              )}
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              {isEditing ? "Editar Caminhão" : "Cadastrar Novo Caminhão"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Seção: Identificação */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Identificação</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placa" className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Placa *
                  </Label>
                  <Input
                    id="placa"
                    placeholder="ABC-1234"
                    className="font-mono font-semibold"
                    value={editedCaminhao.placa || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, placa: e.target.value.toUpperCase() })}
                  />
                  <p className="text-xs text-muted-foreground">Formato: AAA-NNNN</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Modelo *
                  </Label>
                  <Input
                    id="modelo"
                    placeholder="Volvo FH 540"
                    value={editedCaminhao.modelo || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, modelo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Seção: Especificações Técnicas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Especificações Técnicas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fabricacao" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Ano *
                  </Label>
                  <Input
                    id="fabricacao"
                    placeholder="2020"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={editedCaminhao.fabricacao || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, fabricacao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidade" className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    Capacidade *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="capacidade"
                      type="number"
                      placeholder="40"
                      min="1"
                      value={editedCaminhao.capacidade || ""}
                      onChange={(e) => setEditedCaminhao({ ...editedCaminhao, capacidade: parseInt(e.target.value) || 0 })}
                    />
                    <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">ton</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km" className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    KM Rodados *
                  </Label>
                  <Input
                    id="km"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={editedCaminhao.kmRodados || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, kmRodados: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Seção: Status e Motorista */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Operacional</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <Badge className="h-4 w-4 rounded text-xs px-1.5">Status</Badge>
                    Status *
                  </Label>
                  <Select
                    value={editedCaminhao.status || "disponivel"}
                    onValueChange={(value: "disponivel" | "em_viagem" | "manutencao") => 
                      setEditedCaminhao({ ...editedCaminhao, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponivel">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          Disponível
                        </div>
                      </SelectItem>
                      <SelectItem value="em_viagem">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          Em Viagem
                        </div>
                      </SelectItem>
                      <SelectItem value="manutencao">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          Manutenção
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motorista" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Motorista
                  </Label>
                  <Input
                    id="motorista"
                    placeholder="Nome do motorista (opcional)"
                    value={editedCaminhao.motorista || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, motorista: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Seção: Manutenção */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Manutenção Preventiva</h3>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  Configure o intervalo de manutenção para receber alertas quando o caminhão se aproximar do limite
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ultimaManutencao" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    Última Manutenção *
                  </Label>
                  <Input
                    id="ultimaManutencao"
                    placeholder="DD/MM/AAAA"
                    value={editedCaminhao.ultimaManutencao || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, ultimaManutencao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaManutencao" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Próxima Manutenção (KM) *
                  </Label>
                  <Input
                    id="proximaManutencao"
                    type="number"
                    placeholder="250000"
                    min="0"
                    value={editedCaminhao.proxistaManutencao || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, proxistaManutencao: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {editedCaminhao.kmRodados !== undefined && editedCaminhao.proxistaManutencao !== undefined && editedCaminhao.proxistaManutencao > 0 && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Intervalo de Manutenção</span>
                    <span className="text-sm font-bold text-foreground">
                      {((editedCaminhao.kmRodados / editedCaminhao.proxistaManutencao) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (editedCaminhao.kmRodados / editedCaminhao.proxistaManutencao) * 100 >= 90
                          ? "bg-red-500"
                          : (editedCaminhao.kmRodados / editedCaminhao.proxistaManutencao) * 100 >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min((editedCaminhao.kmRodados / editedCaminhao.proxistaManutencao) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 flex flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4" />
              {isEditing ? "Salvar Alterações" : "Cadastrar Caminhão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
