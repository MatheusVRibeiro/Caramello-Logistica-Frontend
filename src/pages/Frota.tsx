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
import { Plus, Edit, Eye, Truck, Gauge, Weight, CalendarDays, Wrench, AlertCircle, Save, X, Info, FileText, Shield, Fuel, Package as PackageIcon } from "lucide-react";
import { toast } from "sonner";

// Interface de Motorista para vinculação
interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  status: "ativo" | "inativo" | "ferias";
  tipo: "proprio" | "terceirizado";
}

// Dados mockados de motoristas (sincronizado com a tela de Motoristas)
const motoristasDisponiveis: Motorista[] = [
  {
    id: "MOT-001",
    nome: "Carlos Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    status: "ativo",
    tipo: "proprio",
  },
  {
    id: "MOT-002",
    nome: "João Oliveira",
    cpf: "234.567.890-11",
    telefone: "(21) 97654-3210",
    status: "ativo",
    tipo: "terceirizado",
  },
  {
    id: "MOT-003",
    nome: "Pedro Santos",
    cpf: "345.678.901-22",
    telefone: "(31) 96543-2109",
    status: "ativo",
    tipo: "proprio",
  },
  {
    id: "MOT-004",
    nome: "André Costa",
    cpf: "456.789.012-33",
    telefone: "(41) 95432-1098",
    status: "ativo",
    tipo: "terceirizado",
  },
  {
    id: "MOT-005",
    nome: "Fernando Alves",
    cpf: "567.890.123-44",
    telefone: "(51) 94321-0987",
    status: "ativo",
    tipo: "proprio",
  },
];

interface Caminhao {
  id: string;
  placa: string;
  placaCarreta?: string; // Placa do reboque/carreta
  modelo: string; // Modelo completo incluindo marca (ex: Volvo FH 540)
  anoFabricacao: number; // Ano de fabricação (INT no banco)
  capacidadeToneladas: number; // Capacidade em toneladas (DECIMAL no banco)
  status: "disponivel" | "em_viagem" | "manutencao";
  kmAtual: number; // KM atual do veículo
  motoristaFixoId?: string; // ID do motorista fixo (FK)
  // Documentação e Fiscal
  renavam?: string;
  renavamCarreta?: string; // RENAVAM do reboque/carreta
  chassi?: string;
  registroAntt?: string;
  validadeSeguro?: string; // Formato DD/MM/AAAA (DATE no banco)
  validadeLicenciamento?: string; // Formato DD/MM/AAAA (DATE no banco)
  // Especificações Técnicas
  tipoCombustivel?: "DIESEL" | "S10" | "ARLA" | "OUTRO";
  tipoVeiculo?: "TRUCADO" | "TOCO" | "CARRETA" | "BITREM" | "RODOTREM";
  // Gestão e Manutenção
  proprietarioTipo?: "PROPRIO" | "TERCEIRO" | "AGREGADO";
  ultimaManutencaoData?: string; // Data da última manutenção (DATE no banco)
  proximaManutencaoKm?: number; // KM previsto para próxima revisão
}

const caminhoesData: Caminhao[] = [
  {
    id: "1",
    placa: "ABC-1234",
    placaCarreta: "CRT-5678",
    modelo: "Volvo FH 540",
    anoFabricacao: 2020,
    capacidadeToneladas: 40,
    status: "em_viagem",
    kmAtual: 245000,
    motoristaFixoId: "MOT-001",
    ultimaManutencaoData: "15/01/2025",
    proximaManutencaoKm: 250000,
    renavam: "12345678901",
    renavamCarreta: "98765432109",
    chassi: "9BWHE21JX24060831",
    registroAntt: "ANTT-2020-001",
    validadeSeguro: "15/12/2025",
    validadeLicenciamento: "31/03/2025",
    tipoCombustivel: "S10",
    tipoVeiculo: "CARRETA",
    proprietarioTipo: "PROPRIO",
  },
  {
    id: "2",
    placa: "DEF-5678",
    placaCarreta: "BTR-9012",
    modelo: "Scania R450",
    anoFabricacao: 2019,
    capacidadeToneladas: 35,
    status: "disponivel",
    kmAtual: 180000,
    motoristaFixoId: "MOT-002",
    ultimaManutencaoData: "10/01/2025",
    proximaManutencaoKm: 200000,
    renavam: "23456789012",
    renavamCarreta: "87654321098",
    chassi: "9BSE4X2BXCR123456",
    registroAntt: "ANTT-2019-002",
    validadeSeguro: "20/11/2025",
    validadeLicenciamento: "28/02/2025",
    tipoCombustivel: "DIESEL",
    tipoVeiculo: "BITREM",
    proprietarioTipo: "TERCEIRO",
  },
  {
    id: "3",
    placa: "GHI-9012",
    modelo: "Mercedes Actros",
    anoFabricacao: 2018,
    capacidadeToneladas: 38,
    status: "manutencao",
    kmAtual: 320000,
    ultimaManutencaoData: "25/01/2025",
    proximaManutencaoKm: 350000,
    renavam: "34567890123",
    chassi: "WDB9340231K123789",
    registroAntt: "ANTT-2018-003",
    validadeSeguro: "10/10/2025",
    validadeLicenciamento: "15/01/2025",
    tipoCombustivel: "S10",
    tipoVeiculo: "TRUCADO",
    proprietarioTipo: "PROPRIO",
  },
  {
    id: "4",
    placa: "JKL-3456",
    placaCarreta: "DAF-7890",
    modelo: "DAF XF",
    anoFabricacao: 2021,
    capacidadeToneladas: 42,
    status: "disponivel",
    kmAtual: 95000,
    motoristaFixoId: "MOT-003",
    ultimaManutencaoData: "05/01/2025",
    proximaManutencaoKm: 150000,
    renavam: "45678901234",
    renavamCarreta: "76543210987",
    chassi: "XLRTE47MS0E654321",
    registroAntt: "ANTT-2021-004",
    validadeSeguro: "30/06/2026",
    validadeLicenciamento: "15/04/2025",
    tipoCombustivel: "S10",
    tipoVeiculo: "CARRETA",
    proprietarioTipo: "AGREGADO",
  },
  {
    id: "5",
    placa: "MNO-7890",
    placaCarreta: "RDT-1234",
    modelo: "Volvo FH 500",
    anoFabricacao: 2020,
    capacidadeToneladas: 40,
    status: "em_viagem",
    kmAtual: 210000,
    motoristaFixoId: "MOT-004",
    ultimaManutencaoData: "12/01/2025",
    proximaManutencaoKm: 240000,
    renavam: "56789012345",
    renavamCarreta: "65432109876",
    chassi: "YV2A22C60GA456789",
    registroAntt: "ANTT-2020-005",
    validadeSeguro: "18/08/2025",
    validadeLicenciamento: "22/05/2025",
    tipoCombustivel: "DIESEL",
    tipoVeiculo: "RODOTREM",
    proprietarioTipo: "PROPRIO",
  },
];

const statusConfig = {
  disponivel: { label: "Disponível", variant: "active" as const },
  em_viagem: { label: "Em Viagem", variant: "inTransit" as const },
  manutencao: { label: "Manutenção", variant: "warning" as const },
};

export default function Frota() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCaminhao, setSelectedCaminhao] = useState<Caminhao | null>(null);
  const [editedCaminhao, setEditedCaminhao] = useState<Partial<Caminhao>>({});

  const handleOpenNewModal = () => {
    setEditedCaminhao({
      placa: "",
      placaCarreta: "",
      modelo: "",
      anoFabricacao: new Date().getFullYear(),
      capacidadeToneladas: 0,
      status: "disponivel",
      kmAtual: 0,
      motoristaFixoId: "",
      ultimaManutencaoData: "",
      proximaManutencaoKm: 0,
      renavam: "",
      renavamCarreta: "",
      chassi: "",
      registroAntt: "",
      validadeSeguro: "",
      validadeLicenciamento: "",
      tipoCombustivel: undefined,
      tipoVeiculo: undefined,
      proprietarioTipo: undefined,
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

  const isDocumentExpiringSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const [day, month, year] = dateStr.split('/');
    const docDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    const diffDays = Math.ceil((docDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isDocumentExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    const [day, month, year] = dateStr.split('/');
    const docDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    return docDate < today;
  };

  const columns = [
    {
      key: "placa",
      header: "Veículo",
      render: (item: Caminhao) => (
        <div className="flex items-start gap-2 py-1">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 hover:from-primary/30 hover:to-primary/20 transition-all shadow-sm">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono font-bold text-base text-foreground tracking-wide">{item.placa}</p>
              {item.placaCarreta && (
                <>
                  <span className="text-muted-foreground font-bold">+</span>
                  <p className="font-mono font-bold text-base text-blue-600 dark:text-blue-400 tracking-wide">{item.placaCarreta}</p>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium">{item.modelo}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] font-semibold py-0 px-2">
                {item.anoFabricacao}
              </Badge>
              {item.tipoVeiculo && (
                <Badge variant="secondary" className="text-[10px] py-0 px-2">
                  {item.tipoVeiculo}
                </Badge>
              )}
              {item.proprietarioTipo && (
                <Badge 
                  variant={item.proprietarioTipo === "PROPRIO" ? "default" : "outline"}
                  className="text-xs"
                >
                  {item.proprietarioTipo}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Caminhao) => (
        <Badge variant={statusConfig[item.status].variant} className="font-semibold text-xs px-3 py-1.5 whitespace-nowrap">
          {statusConfig[item.status].label}
        </Badge>
      ),
    },
    {
      key: "motoristaFixoId",
      header: "Motorista",
      render: (item: Caminhao) => {
        const motorista = motoristasDisponiveis.find(m => m.id === item.motoristaFixoId);
        return (
          <>
            {motorista ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 rounded-md border border-blue-300 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-5 w-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-3 w-3 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-800 dark:text-blue-200 whitespace-nowrap">
                    {motorista.nome}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">
                    {motorista.tipo === "proprio" ? "Próprio" : "Terceirizado"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border border-dashed border-muted-foreground/30">
                <span className="text-xs text-muted-foreground italic">
                  Não atribuído
                </span>
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "capacidade",
      header: "Especificações",
      render: (item: Caminhao) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Weight className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base text-foreground">{item.capacidadeToneladas}</span>
              <span className="text-[10px] text-muted-foreground">ton</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-xs text-foreground">{item.kmAtual.toLocaleString("pt-BR")}</span>
              <span className="text-[10px] text-muted-foreground">km</span>
            </div>
          </div>
          {item.tipoCombustivel && (
            <div className="flex items-center gap-2">
              <Fuel className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
              <Badge variant="outline" className="text-[10px] font-semibold py-0 px-2">
                {item.tipoCombustivel}
              </Badge>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "documentacao",
      header: "Documentação",
      render: (item: Caminhao) => {
        const seguroExpired = isDocumentExpired(item.validadeSeguro);
        const seguroExpiring = isDocumentExpiringSoon(item.validadeSeguro);
        const licExpired = isDocumentExpired(item.validadeLicenciamento);
        const licExpiring = isDocumentExpiringSoon(item.validadeLicenciamento);
        const hasAlert = seguroExpired || seguroExpiring || licExpired || licExpiring;

        return (
          <div className="space-y-2">
            {item.validadeSeguro && (
              <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${
                seguroExpired 
                  ? "bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800" 
                  : seguroExpiring 
                  ? "bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800"
                  : "bg-muted/40"
              }`}>
                <Shield className={`h-3.5 w-3.5 flex-shrink-0 ${
                  seguroExpired ? "text-red-600" : seguroExpiring ? "text-orange-600" : "text-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Seguro</p>
                  <p className={`text-xs font-semibold ${
                    seguroExpired ? "text-red-700 dark:text-red-400" 
                    : seguroExpiring ? "text-orange-700 dark:text-orange-400" 
                    : "text-foreground"
                  }`}>
                    {item.validadeSeguro}
                  </p>
                </div>
                {seguroExpired && <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
                {seguroExpiring && !seguroExpired && <AlertCircle className="h-3.5 w-3.5 text-orange-600" />}
              </div>
            )}
            {item.validadeLicenciamento && (
              <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${
                licExpired 
                  ? "bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800" 
                  : licExpiring 
                  ? "bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800"
                  : "bg-muted/40"
              }`}>
                <FileText className={`h-3.5 w-3.5 flex-shrink-0 ${
                  licExpired ? "text-red-600" : licExpiring ? "text-orange-600" : "text-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Licenciamento</p>
                  <p className={`text-xs font-semibold ${
                    licExpired ? "text-red-700 dark:text-red-400" 
                    : licExpiring ? "text-orange-700 dark:text-orange-400" 
                    : "text-foreground"
                  }`}>
                    {item.validadeLicenciamento}
                  </p>
                </div>
                {licExpired && <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
                {licExpiring && !licExpired && <AlertCircle className="h-3.5 w-3.5 text-orange-600" />}
              </div>
            )}
            {!item.validadeSeguro && !item.validadeLicenciamento && (
              <span className="text-xs text-muted-foreground italic">Não informado</span>
            )}
          </div>
        );
      },
    },
    {
      key: "proximaManutencao",
      header: "Manutenção",
      render: (item: Caminhao) => {
        const status = getMaintenanceStatus(item.kmAtual, item.proximaManutencaoKm!);
        const percentual = ((item.kmAtual / item.proximaManutencaoKm!) * 100).toFixed(0);
        const kmRestante = (item.proximaManutencaoKm! - item.kmAtual).toLocaleString("pt-BR");
        
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wrench className={`h-4 w-4 ${status === "critical" ? "text-red-600" : status === "warning" ? "text-yellow-600" : "text-green-600"}`} />
              <span className="text-xs text-muted-foreground">Última: {item.ultimaManutencaoData}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      status === "critical"
                        ? "bg-gradient-to-r from-red-400 to-red-600"
                        : status === "warning"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-r from-green-400 to-green-600"
                    }`}
                    style={{ width: `${Math.min(parseInt(percentual), 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ml-2 ${
                  status === "critical"
                    ? "text-red-600"
                    : status === "warning"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}>
                  {percentual}%
                </span>
              </div>
              <p className={`text-xs font-medium ${
                status === "critical"
                  ? "text-red-600"
                  : status === "warning"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}>
                {status === "critical" ? "⚠️ CRÍTICO" : status === "warning" ? "⚠️ Atenção" : "✓ OK"} - {kmRestante} km restantes
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "acoes",
      header: "Ações",
      render: (item: Caminhao) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCaminhao(item);
            }}
            className="gap-1.5 hover:bg-primary/10"
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs">Ver</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(item);
            }}
            className="gap-1.5 hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
            <span className="text-xs">Editar</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Frota" subtitle="Gestão da frota">
      <PageHeader
        title="Frota de Veículos"
        description="Gestão completa da frota, documentação e manutenção"
        actions={
          <Button onClick={handleOpenNewModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Caminhão
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total de Veículos</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">{caminhoesData.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {caminhoesData.filter(c => c.status === "disponivel").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alertas Documentação</p>
              <p className="text-xl font-bold text-orange-700 dark:text-orange-400">
                {caminhoesData.filter(c => 
                  isDocumentExpired(c.validadeSeguro) || 
                  isDocumentExpired(c.validadeLicenciamento) ||
                  isDocumentExpiringSoon(c.validadeSeguro) ||
                  isDocumentExpiringSoon(c.validadeLicenciamento)
                ).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Manutenção Crítica</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                {caminhoesData.filter(c => getMaintenanceStatus(c.kmAtual, c.proximaManutencaoKm!) === "critical").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

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
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto px-1">
          {selectedCaminhao && (
            <div className="space-y-6">
              {/* Header */}
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-mono font-bold mb-1">{selectedCaminhao.placa}</p>
                      <p className="text-base font-semibold mb-1.5">{selectedCaminhao.modelo}</p>
                      <Badge variant={statusConfig[selectedCaminhao.status].variant} className="text-xs">
                        {statusConfig[selectedCaminhao.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="p-3 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Ano de Fabricação</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{selectedCaminhao.anoFabricacao}</p>
                </Card>

                <Card className="p-3 border-l-4 border-l-green-500">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Weight className="h-3.5 w-3.5 text-green-600" />
                    <p className="text-xs text-muted-foreground">Capacidade</p>
                  </div>
                  <p className="text-lg font-bold text-green-600">{selectedCaminhao.capacidadeToneladas} ton</p>
                </Card>

                <Card className="p-3 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Gauge className="h-3.5 w-3.5 text-purple-600" />
                    <p className="text-xs text-muted-foreground">KM Rodados</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600">
                    {selectedCaminhao.kmAtual.toLocaleString("pt-BR")}
                  </p>
                </Card>
              </div>

              <Separator />

              {/* Maintenance */}
              {(() => {
                const status = getMaintenanceStatus(selectedCaminhao.kmAtual, selectedCaminhao.proximaManutencaoKm!);
                const percentual = ((selectedCaminhao.kmAtual / selectedCaminhao.proximaManutencaoKm!) * 100).toFixed(0);
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
                            <p className="font-semibold">{selectedCaminhao.ultimaManutencaoData}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Próxima em</p>
                            <p className="font-semibold">{selectedCaminhao.proximaManutencaoKm?.toLocaleString("pt-BR")} km</p>
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

              {selectedCaminhao.motoristaFixoId && (() => {
                const motorista = motoristasDisponiveis.find(m => m.id === selectedCaminhao.motoristaFixoId);
                return motorista ? (
                  <>
                    <Separator />
                    <Card className="p-4 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900">
                      <p className="text-sm text-muted-foreground mb-2">Motorista Fixo</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-lg text-blue-700 dark:text-blue-300">{motorista.nome}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">CPF: {motorista.cpf}</span>
                          <Badge variant={motorista.tipo === "proprio" ? "default" : "outline"}>
                            {motorista.tipo === "proprio" ? "Próprio" : "Terceirizado"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">📞 {motorista.telefone}</p>
                      </div>
                    </Card>
                  </>
                ) : null;
              })()}

              <Separator />

              {/* Documentação e Fiscal */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentação e Fiscal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCaminhao.renavam && (
                    <Card className="p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">RENAVAM do Cavalo</p>
                      <p className="font-mono font-semibold text-foreground">{selectedCaminhao.renavam}</p>
                    </Card>
                  )}
                  {selectedCaminhao.renavamCarreta && (
                    <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-muted-foreground mb-1">RENAVAM da Carreta</p>
                      <p className="font-mono font-semibold text-blue-700 dark:text-blue-300">{selectedCaminhao.renavamCarreta}</p>
                    </Card>
                  )}
                  {selectedCaminhao.chassi && (
                    <Card className="p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Chassi</p>
                      <p className="font-mono font-semibold text-foreground">{selectedCaminhao.chassi}</p>
                    </Card>
                  )}
                  {selectedCaminhao.registroAntt && (
                    <Card className="p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Registro ANTT</p>
                      <p className="font-mono font-semibold text-foreground">{selectedCaminhao.registroAntt}</p>
                    </Card>
                  )}
                  {selectedCaminhao.proprietarioTipo && (
                    <Card className="p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Tipo de Proprietário</p>
                      <Badge variant="outline" className="font-semibold">
                        {selectedCaminhao.proprietarioTipo}
                      </Badge>
                    </Card>
                  )}
                </div>

                {/* Validades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {selectedCaminhao.validadeSeguro && (
                    <Card className="p-4 border-l-4 border-l-orange-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <p className="text-sm text-muted-foreground">Validade do Seguro</p>
                      </div>
                      <p className="text-lg font-bold text-orange-600">{selectedCaminhao.validadeSeguro}</p>
                    </Card>
                  )}
                  {selectedCaminhao.validadeLicenciamento && (
                    <Card className="p-4 border-l-4 border-l-cyan-500">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-cyan-600" />
                        <p className="text-sm text-muted-foreground">Validade do Licenciamento</p>
                      </div>
                      <p className="text-lg font-bold text-cyan-600">{selectedCaminhao.validadeLicenciamento}</p>
                    </Card>
                  )}
                </div>
              </div>

              <Separator />

              {/* Especificações Técnicas */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <PackageIcon className="h-4 w-4" />
                  Especificações Técnicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCaminhao.tipoVeiculo && (
                    <Card className="p-4 border-l-4 border-l-indigo-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-indigo-600" />
                        <p className="text-sm text-muted-foreground">Tipo de Veículo</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-600">{selectedCaminhao.tipoVeiculo}</p>
                    </Card>
                  )}
                  {selectedCaminhao.tipoCombustivel && (
                    <Card className="p-4 border-l-4 border-l-amber-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Fuel className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-muted-foreground">Tipo de Combustível</p>
                      </div>
                      <p className="text-lg font-bold text-amber-600">{selectedCaminhao.tipoCombustivel}</p>
                    </Card>
                  )}
                </div>
              </div>
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

          <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto px-1">
            {/* Seção: Identificação e Especificações Técnicas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Identificação e Especificações</h3>
              </div>
              
              {/* Placas e Modelo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placa" className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Placa do Cavalo *
                  </Label>
                  <Input
                    id="placa"
                    placeholder="ABC-1234"
                    className="font-mono font-semibold"
                    value={editedCaminhao.placa || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, placa: e.target.value.toUpperCase() })}
                  />
                  <p className="text-xs text-muted-foreground">Placa do caminhão trator</p>
                </div>
                
                {/* Placa da Carreta - Mostrada apenas para tipos que precisam */}
                {editedCaminhao.tipoVeiculo && ["CARRETA", "BITREM", "RODOTREM"].includes(editedCaminhao.tipoVeiculo) && (
                  <div className="space-y-2">
                    <Label htmlFor="placaCarreta" className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      Placa da Carreta
                    </Label>
                    <Input
                      id="placaCarreta"
                      placeholder="CRT-5678"
                      className="font-mono font-semibold"
                      value={editedCaminhao.placaCarreta || ""}
                      onChange={(e) => setEditedCaminhao({ ...editedCaminhao, placaCarreta: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-muted-foreground">Placa do reboque/carreta</p>
                  </div>
                )}
              </div>
              
              {/* Modelo e Tipo de Veículo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelo" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Modelo *
                  </Label>
                  <Input
                    id="modelo"
                    placeholder="Ex: Volvo FH 540"
                    value={editedCaminhao.modelo || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, modelo: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipoVeiculo" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Tipo de Veículo *
                  </Label>
                  <Select
                    value={editedCaminhao.tipoVeiculo || ""}
                    onValueChange={(value: "TRUCADO" | "TOCO" | "CARRETA" | "BITREM" | "RODOTREM") => 
                      setEditedCaminhao({ ...editedCaminhao, tipoVeiculo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARRETA">Carreta</SelectItem>
                      <SelectItem value="TRUCADO">Trucado</SelectItem>
                      <SelectItem value="TOCO">Toco</SelectItem>
                      <SelectItem value="BITREM">Bitrem</SelectItem>
                      <SelectItem value="RODOTREM">Rodotrem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Especificações Técnicas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="anoFabricacao" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Ano *
                  </Label>
                  <Input
                    id="anoFabricacao"
                    placeholder="2020"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={editedCaminhao.anoFabricacao || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, anoFabricacao: parseInt(e.target.value) || new Date().getFullYear() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidadeToneladas" className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    Capacidade *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="capacidadeToneladas"
                      type="number"
                      placeholder="40"
                      min="1"
                      value={editedCaminhao.capacidadeToneladas || ""}
                      onChange={(e) => setEditedCaminhao({ ...editedCaminhao, capacidadeToneladas: parseFloat(e.target.value) || 0 })}
                    />
                    <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">ton</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kmAtual" className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    KM Atual *
                  </Label>
                  <Input
                    id="kmAtual"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={editedCaminhao.kmAtual || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, kmAtual: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              {/* Tipo de Combustível */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoCombustivel" className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    Tipo de Combustível
                  </Label>
                  <Select
                    value={editedCaminhao.tipoCombustivel || ""}
                    onValueChange={(value: "DIESEL" | "S10" | "ARLA" | "OUTRO") => 
                      setEditedCaminhao({ ...editedCaminhao, tipoCombustivel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="S10">S10</SelectItem>
                      <SelectItem value="ARLA">ARLA</SelectItem>
                      <SelectItem value="OUTRO">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Seção: Documentação e Fiscal */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h3 className="font-semibold text-foreground">Documentação e Fiscal</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="renavam" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    RENAVAM do Cavalo
                  </Label>
                  <Input
                    id="renavam"
                    placeholder="12345678901"
                    className="font-mono"
                    maxLength={20}
                    value={editedCaminhao.renavam || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, renavam: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">RENAVAM do caminhão trator</p>
                </div>
                {editedCaminhao.tipoVeiculo && ["CARRETA", "BITREM", "RODOTREM"].includes(editedCaminhao.tipoVeiculo) && (
                  <div className="space-y-2">
                    <Label htmlFor="renavamCarreta" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      RENAVAM da Carreta
                    </Label>
                    <Input
                      id="renavamCarreta"
                      placeholder="98765432109"
                      className="font-mono"
                      maxLength={20}
                      value={editedCaminhao.renavamCarreta || ""}
                      onChange={(e) => setEditedCaminhao({ ...editedCaminhao, renavamCarreta: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">RENAVAM do reboque/carreta</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="chassi" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Chassi
                  </Label>
                  <Input
                    id="chassi"
                    placeholder="9BWHE21JX24060831"
                    className="font-mono"
                    maxLength={30}
                    value={editedCaminhao.chassi || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, chassi: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registroAntt" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Registro ANTT
                  </Label>
                  <Input
                    id="registroAntt"
                    placeholder="ANTT-2020-001"
                    maxLength={20}
                    value={editedCaminhao.registroAntt || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, registroAntt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proprietarioTipo" className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Tipo de Proprietário
                  </Label>
                  <Select
                    value={editedCaminhao.proprietarioTipo || "PROPRIO"}
                    onValueChange={(value: "PROPRIO" | "TERCEIRO" | "AGREGADO") => 
                      setEditedCaminhao({ ...editedCaminhao, proprietarioTipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROPRIO">Próprio</SelectItem>
                      <SelectItem value="TERCEIRO">Terceiro</SelectItem>
                      <SelectItem value="AGREGADO">Agregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Validades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="validadeSeguro" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    Validade do Seguro
                  </Label>
                  <Input
                    id="validadeSeguro"
                    placeholder="DD/MM/AAAA"
                    value={editedCaminhao.validadeSeguro || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, validadeSeguro: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validadeLicenciamento" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-600" />
                    Validade do Licenciamento
                  </Label>
                  <Input
                    id="validadeLicenciamento"
                    placeholder="DD/MM/AAAA"
                    value={editedCaminhao.validadeLicenciamento || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, validadeLicenciamento: e.target.value })}
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
                  <Label htmlFor="motoristaFixoId" className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    Motorista Fixo
                  </Label>
                  <Select
                    value={editedCaminhao.motoristaFixoId || "___none___"}
                    onValueChange={(value) => 
                      setEditedCaminhao({ 
                        ...editedCaminhao, 
                        motoristaFixoId: value === "___none___" ? undefined : value 
                      })
                    }
                  >
                    <SelectTrigger id="motoristaFixoId">
                      <SelectValue placeholder="Selecione um motorista (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="___none___">Nenhum (Sem motorista fixo)</SelectItem>
                      {motoristasDisponiveis
                        .filter(m => m.status === "ativo")
                        .map((motorista) => (
                          <SelectItem key={motorista.id} value={motorista.id}>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="font-semibold">{motorista.nome}</span>
                                <span className="text-xs text-muted-foreground">
                                  {motorista.tipo === "proprio" ? "Próprio" : "Terceirizado"} • {motorista.telefone}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Motorista fixo que opera este veículo regularmente</p>
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
                  <Label htmlFor="ultimaManutencaoData" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    Última Manutenção *
                  </Label>
                  <Input
                    id="ultimaManutencaoData"
                    placeholder="DD/MM/AAAA"
                    value={editedCaminhao.ultimaManutencaoData || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, ultimaManutencaoData: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaManutencaoKm" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Próxima Manutenção (KM) *
                  </Label>
                  <Input
                    id="proximaManutencaoKm"
                    type="number"
                    placeholder="250000"
                    min="0"
                    value={editedCaminhao.proximaManutencaoKm || ""}
                    onChange={(e) => setEditedCaminhao({ ...editedCaminhao, proximaManutencaoKm: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              {editedCaminhao.kmAtual !== undefined && editedCaminhao.proximaManutencaoKm !== undefined && editedCaminhao.proximaManutencaoKm > 0 && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Intervalo de Manutenção</span>
                    <span className="text-sm font-bold text-foreground">
                      {((editedCaminhao.kmAtual / editedCaminhao.proximaManutencaoKm) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        (editedCaminhao.kmAtual / editedCaminhao.proximaManutencaoKm) * 100 >= 90
                          ? "bg-red-500"
                          : (editedCaminhao.kmAtual / editedCaminhao.proximaManutencaoKm) * 100 >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min((editedCaminhao.kmAtual / editedCaminhao.proximaManutencaoKm) * 100, 100)}%` }}
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
