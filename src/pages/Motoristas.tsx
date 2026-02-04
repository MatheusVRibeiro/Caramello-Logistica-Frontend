import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/shared/DataTable";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, TrendingUp, Phone, Mail, Calendar, Truck, Edit, Save, X, MapPin, Award, CreditCard, Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cnh: string;
  cnhValidade: string;
  cnhCategoria?: "A" | "B" | "C" | "D" | "E";
  status: "ativo" | "inativo" | "ferias";
  tipo: "proprio" | "terceirizado";
  receitaGerada: number;
  viagensRealizadas: number;
  dataAdmissao: string;
  caminhaoAtual?: string;
  endereco?: string;
  // Dados Bancários
  tipoPagamento?: "pix" | "transferencia_bancaria";
  chavePixTipo?: "cpf" | "email" | "telefone" | "aleatoria";
  chavePix?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: "corrente" | "poupanca";
}

// Lista de caminhões disponíveis (simulado)
const caminhoes = [
  { placa: "ABC-1234", modelo: "Scania R450" },
  { placa: "XYZ-5678", modelo: "Volvo FH 460" },
  { placa: "DEF-9012", modelo: "Mercedes-Benz Actros" },
  { placa: "GHI-3456", modelo: "Iveco Stralis" },
  { placa: "JKL-7890", modelo: "DAF XF" },
];

const motoristasData: Motorista[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "carlos.silva@email.com",
    cnh: "12345678900",
    cnhValidade: "15/08/2027",
    cnhCategoria: "E",
    status: "ativo",
    tipo: "proprio",
    receitaGerada: 89500,
    viagensRealizadas: 24,
    dataAdmissao: "15/03/2020",
    caminhaoAtual: "ABC-1234",
    endereco: "São Paulo, SP",
    tipoPagamento: "pix",
    chavePixTipo: "cpf",
    chavePix: "123.456.789-00",
  },
  {
    id: "2",
    nome: "João Oliveira",
    cpf: "234.567.890-11",
    telefone: "(21) 97654-3210",
    email: "joao.oliveira@email.com",
    cnh: "23456789011",
    cnhValidade: "22/10/2026",
    cnhCategoria: "E",
    status: "ativo",
    tipo: "terceirizado",
    receitaGerada: 78200,
    viagensRealizadas: 21,
    dataAdmissao: "22/08/2019",
    caminhaoAtual: "XYZ-5678",
    endereco: "Rio de Janeiro, RJ",
    tipoPagamento: "transferencia_bancaria",
    banco: "Banco do Brasil",
    agencia: "1234",
    conta: "567890-1",
    tipoConta: "corrente",
  },
  {
    id: "3",
    nome: "Pedro Santos",
    cpf: "345.678.901-22",
    telefone: "(41) 96543-2109",
    email: "pedro.santos@email.com",
    cnh: "34567890122",
    cnhValidade: "10/05/2028",
    cnhCategoria: "E",
    status: "ferias",
    tipo: "proprio",
    receitaGerada: 72100,
    viagensRealizadas: 19,
    dataAdmissao: "10/01/2021",
    caminhaoAtual: "DEF-9012",
    endereco: "Curitiba, PR",
    tipoPagamento: "pix",
    chavePixTipo: "email",
    chavePix: "pedro.santos@email.com",
  },
  {
    id: "4",
    nome: "André Costa",
    cpf: "456.789.012-33",
    telefone: "(31) 95432-1098",
    email: "andre.costa@email.com",
    cnh: "45678901233",
    cnhValidade: "05/12/2025",
    cnhCategoria: "E",
    status: "ativo",
    tipo: "terceirizado",
    receitaGerada: 65800,
    viagensRealizadas: 17,
    dataAdmissao: "05/06/2022",
    caminhaoAtual: "GHI-3456",
    endereco: "Belo Horizonte, MG",
    tipoPagamento: "pix",
    chavePixTipo: "aleatoria",
    chavePix: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  },
  {
    id: "5",
    nome: "Lucas Ferreira",
    cpf: "567.890.123-44",
    telefone: "(48) 94321-0987",
    email: "lucas.ferreira@email.com",
    cnh: "56789012344",
    cnhValidade: "18/03/2024",
    cnhCategoria: "E",
    status: "inativo",
    tipo: "proprio",
    receitaGerada: 58400,
    viagensRealizadas: 15,
    dataAdmissao: "18/11/2018",
    endereco: "Florianópolis, SC",
    tipoPagamento: "transferencia_bancaria",
    banco: "Caixa Econômica Federal",
    agencia: "5678",
    conta: "123456-9",
    tipoConta: "poupanca",
  },
];

const statusConfig = {
  ativo: { label: "Ativo", variant: "active" as const },
  inativo: { label: "Inativo", variant: "inactive" as const },
  ferias: { label: "Férias", variant: "warning" as const },
};

const tipoMotoristaConfig = {
  proprio: { label: "Próprio", variant: "secondary" as const },
  terceirizado: { label: "Terceirizado", variant: "outline" as const },
};

export default function Motoristas() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [selectedMotorista, setSelectedMotorista] = useState<Motorista | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMotorista, setEditedMotorista] = useState<Partial<Motorista>>({});

  const handleOpenNewModal = () => {
    setEditedMotorista({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      cnh: "",
      cnhValidade: "",
      status: "ativo",
      tipo: "proprio",
      caminhaoAtual: "",
      endereco: "",
      tipoPagamento: "pix",
      chavePixTipo: "cpf",
      chavePix: "",
      banco: "",
      agencia: "",
      conta: "",
      tipoConta: "corrente",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (motorista: Motorista) => {
    setEditedMotorista(motorista);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      toast.success("Motorista atualizado com sucesso!");
    } else {
      toast.success("Motorista cadastrado com sucesso!");
    }
    setIsModalOpen(false);
  };

  const filteredData = motoristasData.filter((motorista) => {
    const matchesSearch =
      motorista.nome.toLowerCase().includes(search.toLowerCase()) ||
      motorista.cpf.includes(search);
    const matchesStatus =
      statusFilter === "all" || motorista.status === statusFilter;
    const matchesTipo =
      tipoFilter === "all" || motorista.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalMotoristas = motoristasData.length;
  const totalAtivos = motoristasData.filter((m) => m.status === "ativo").length;
  const totalInativos = motoristasData.filter((m) => m.status === "inativo").length;
  const totalTerceirizados = motoristasData.filter((m) => m.tipo === "terceirizado").length;
  const receitaTotal = motoristasData.reduce((acc, m) => acc + m.receitaGerada, 0);

  const columns = [
    {
      key: "nome",
      header: "Motorista",
      render: (item: Motorista) => (
        <div className="flex items-start gap-3 py-2">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
              {item.nome
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  item.status === "ativo" && "bg-green-500",
                  item.status === "inativo" && "bg-red-500",
                  item.status === "ferias" && "bg-yellow-500"
                )}
              />
              <p className="font-semibold text-foreground leading-tight">{item.nome}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{item.cpf}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={statusConfig[item.status].variant} className="text-[10px]">
                {statusConfig[item.status].label}
              </Badge>
              <Badge variant={tipoMotoristaConfig[item.tipo].variant} className="text-[10px]">
                {tipoMotoristaConfig[item.tipo].label}
              </Badge>
            </div>
            {item.caminhaoAtual && (
              <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-950/40 rounded-md w-fit">
                <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {item.caminhaoAtual}
                </p>
              </div>
            )}
            {item.endereco && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{item.endereco}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "telefone",
      header: "Contato",
      render: (item: Motorista) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">{item.telefone}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate text-muted-foreground max-w-[180px]">{item.email}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Motorista) => (
        <div className="space-y-2">
          <Badge variant={statusConfig[item.status].variant} className="font-semibold w-fit">
            {statusConfig[item.status].label}
          </Badge>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Admissão: {item.dataAdmissao}</span>
          </div>
        </div>
      ),
    },
    {
      key: "receitaGerada",
      header: "Desempenho",
      render: (item: Motorista) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-profit" />
            <span className="font-semibold text-profit">
              R$ {item.receitaGerada.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{item.viagensRealizadas} viagens</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Média/viagem: R$ {Math.round(item.receitaGerada / Math.max(item.viagensRealizadas, 1)).toLocaleString("pt-BR")}
          </div>
        </div>
      ),
    },
  ];

  // Simulated freight history
  const historicoFretes = [
    { id: "FRETE-2026-001", rota: "SP → RJ", data: "20/01/2025", valor: "R$ 15.000" },
    { id: "FRETE-2026-007", rota: "PR → SC", data: "15/01/2025", valor: "R$ 8.500" },
    { id: "FRETE-2026-015", rota: "MG → DF", data: "10/01/2025", valor: "R$ 12.000" },
  ];

  return (
    <MainLayout title="Motoristas" subtitle="Gestão de motoristas">
      <PageHeader
        title="Motoristas"
        description="Gerencie sua equipe de motoristas"
        actions={
          <Button onClick={handleOpenNewModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Motorista
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Motoristas</p>
              <p className="text-2xl font-bold">{totalMotoristas}</p>
            </div>
            <Users className="h-8 w-8 text-primary/30" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold text-green-600">{totalAtivos}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600/30" />
          </div>
        </Card>
        <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inativos</p>
              <p className="text-2xl font-bold text-red-600">{totalInativos}</p>
            </div>
            <UserX className="h-8 w-8 text-red-600/30" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Terceirizados</p>
              <p className="text-2xl font-bold text-blue-600">{totalTerceirizados}</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-blue-600/30" />
          </div>
        </Card>
        <Card className="p-4 bg-profit/5 border-profit/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold text-profit">
                R$ {receitaTotal.toLocaleString("pt-BR")}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-profit/30" />
          </div>
        </Card>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nome ou CPF..."
      >
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground block">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="ferias">Férias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground block">Tipo</Label>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="proprio">Próprio</SelectItem>
              <SelectItem value="terceirizado">Terceirizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      <DataTable<Motorista>
        columns={columns}
        data={filteredData}
        onRowClick={(item) => setSelectedMotorista(item)}
        emptyMessage="Nenhum motorista encontrado"
      />

      {/* Driver Detail Modal */}
      <Dialog open={!!selectedMotorista} onOpenChange={() => setSelectedMotorista(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Detalhes do Motorista</DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedMotorista) {
                    handleOpenEditModal(selectedMotorista);
                    setSelectedMotorista(null);
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
          {selectedMotorista && (
            <div className="space-y-6">
              {/* Header */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {selectedMotorista.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-2xl font-bold mb-1">{selectedMotorista.nome}</p>
                      <p className="text-muted-foreground mb-2">{selectedMotorista.cpf}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={statusConfig[selectedMotorista.status].variant}
                          className="text-sm"
                        >
                          {statusConfig[selectedMotorista.status].label}
                        </Badge>
                        <Badge
                          variant={tipoMotoristaConfig[selectedMotorista.tipo].variant}
                          className="text-sm"
                        >
                          {tipoMotoristaConfig[selectedMotorista.tipo].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-semibold">{selectedMotorista.telefone}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-semibold text-sm">{selectedMotorista.email}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* CNH and Truck Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-l-4 border-l-orange-500">
                  <p className="text-sm text-muted-foreground mb-2">CNH</p>
                  <p className="font-mono font-bold text-lg">{selectedMotorista.cnh}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-muted-foreground">
                      Validade: {selectedMotorista.cnhValidade}
                    </p>
                    {selectedMotorista.cnhCategoria && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="outline" className="text-xs">
                          Categoria {selectedMotorista.cnhCategoria}
                        </Badge>
                      </>
                    )}
                  </div>
                </Card>

                {selectedMotorista.caminhaoAtual && (
                  <Card className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Caminhão Atual</p>
                    </div>
                    <p className="font-mono font-bold text-lg text-blue-600">
                      {selectedMotorista.caminhaoAtual}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {caminhoes.find(c => c.placa === selectedMotorista.caminhaoAtual)?.modelo}
                    </p>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 bg-profit/5 border-profit/20">
                  <p className="text-sm text-muted-foreground mb-2">Receita Gerada</p>
                  <p className="text-2xl font-bold text-profit">
                    R$ {selectedMotorista.receitaGerada.toLocaleString("pt-BR")}
                  </p>
                </Card>
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Viagens</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedMotorista.viagensRealizadas}
                  </p>
                </Card>
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Admissão</p>
                  <p className="text-lg font-bold">{selectedMotorista.dataAdmissao}</p>
                </Card>
              </div>

              {/* Freight History */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Histórico de Fretes Recentes
                </h4>
                <div className="space-y-2">
                  {historicoFretes.map((frete) => (
                    <Card
                      key={frete.id}
                      className="p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm font-bold text-primary">{frete.id}</span>
                          <span className="font-medium">{frete.rota}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{frete.data}</span>
                          <span className="font-bold text-profit">{frete.valor}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Data */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Dados Bancários / PIX
                </h4>
                {selectedMotorista.tipoPagamento === "pix" ? (
                  <Card className="p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tipo de Chave PIX</p>
                        <p className="font-semibold">
                          {selectedMotorista.chavePixTipo === "cpf" && "CPF"}
                          {selectedMotorista.chavePixTipo === "email" && "E-mail"}
                          {selectedMotorista.chavePixTipo === "telefone" && "Telefone"}
                          {selectedMotorista.chavePixTipo === "aleatoria" && "Chave Aleatória"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Chave PIX</p>
                        <p className="font-mono bg-white dark:bg-slate-900 p-2 rounded border border-green-200 dark:border-green-900 break-all">
                          {selectedMotorista.chavePix}
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : selectedMotorista.banco ? (
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Banco</p>
                        <p className="font-semibold">{selectedMotorista.banco}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Agência</p>
                        <p className="font-mono font-bold text-lg">{selectedMotorista.agencia}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Conta</p>
                        <p className="font-mono font-bold text-lg">{selectedMotorista.conta}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tipo de Conta</p>
                        <p className="font-semibold">
                          {selectedMotorista.tipoConta === "corrente" ? "Corrente" : "Poupança"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">Nenhum dado bancário cadastrado</p>
                  </Card>
                )}
              </div>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Motorista" : "Novo Motorista"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto px-1">
            {/* Nome e CPF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="João Silva"
                  value={editedMotorista.nome || ""}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={editedMotorista.cpf || ""}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, cpf: e.target.value })}
                />
              </div>
            </div>

            {/* Telefone e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 98765-4321"
                  value={editedMotorista.telefone || ""}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="motorista@email.com"
                  value={editedMotorista.email || ""}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, email: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            {/* CNH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnh">CNH *</Label>
                <Input
                  id="cnh"
                  placeholder="00000000000"
                  value={editedMotorista.cnh || ""}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, cnh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnhValidade">Validade CNH *</Label>
                <Input
                  id="cnhValidade"
                  placeholder="DD/MM/AAAA"
                  value={editedMotorista.cnhValidade || ""}
                  onChange={(e) => setEditedMotorista({ ...editedMotorista, cnhValidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnhCategoria">Categoria CNH *</Label>
                <Select
                  value={editedMotorista.cnhCategoria || ""}
                  onValueChange={(value: "A" | "B" | "C" | "D" | "E") => 
                    setEditedMotorista({ ...editedMotorista, cnhCategoria: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Caminhão e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caminhao">Caminhão Vinculado</Label>
                <Select
                  value={editedMotorista.caminhaoAtual || "none"}
                  onValueChange={(value) => setEditedMotorista({ ...editedMotorista, caminhaoAtual: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um caminhão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {caminhoes.map((caminhao) => (
                      <SelectItem key={caminhao.placa} value={caminhao.placa}>
                        {caminhao.placa} - {caminhao.modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={editedMotorista.status || "ativo"}
                  onValueChange={(value: "ativo" | "inativo" | "ferias") => 
                    setEditedMotorista({ ...editedMotorista, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="ferias">Férias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tipo do Motorista */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo do Motorista *</Label>
              <Select
                value={editedMotorista.tipo || "proprio"}
                onValueChange={(value: "proprio" | "terceirizado") =>
                  setEditedMotorista({ ...editedMotorista, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proprio">Próprio</SelectItem>
                  <SelectItem value="terceirizado">Terceirizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Cidade, Estado"
                value={editedMotorista.endereco || ""}
                onChange={(e) => setEditedMotorista({ ...editedMotorista, endereco: e.target.value })}
              />
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Dados Bancários / PIX
              </h3>

              <div className="space-y-2">
                <Label htmlFor="tipoPagamento">Método de Pagamento *</Label>
                <Select
                  value={editedMotorista.tipoPagamento || "pix"}
                  onValueChange={(value: "pix" | "transferencia_bancaria") => 
                    setEditedMotorista({ ...editedMotorista, tipoPagamento: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transferencia_bancaria">Transferência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PIX Fields */}
              {editedMotorista.tipoPagamento === "pix" && (
                <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="space-y-2">
                    <Label htmlFor="chavePixTipo">Tipo de Chave PIX *</Label>
                    <Select
                      value={editedMotorista.chavePixTipo || "cpf"}
                      onValueChange={(value: "cpf" | "email" | "telefone" | "aleatoria") => 
                        setEditedMotorista({ ...editedMotorista, chavePixTipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chavePix">Chave PIX *</Label>
                    <Input
                      id="chavePix"
                      placeholder={
                        editedMotorista.chavePixTipo === "cpf"
                          ? "000.000.000-00"
                          : editedMotorista.chavePixTipo === "email"
                          ? "email@example.com"
                          : editedMotorista.chavePixTipo === "telefone"
                          ? "(11) 98765-4321"
                          : "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                      }
                      value={editedMotorista.chavePix || ""}
                      onChange={(e) => setEditedMotorista({ ...editedMotorista, chavePix: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Fields */}
              {editedMotorista.tipoPagamento === "transferencia_bancaria" && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="space-y-2">
                    <Label htmlFor="banco">Banco *</Label>
                    <Input
                      id="banco"
                      placeholder="Banco do Brasil"
                      value={editedMotorista.banco || ""}
                      onChange={(e) => setEditedMotorista({ ...editedMotorista, banco: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência *</Label>
                      <Input
                        id="agencia"
                        placeholder="1234"
                        value={editedMotorista.agencia || ""}
                        onChange={(e) => setEditedMotorista({ ...editedMotorista, agencia: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta *</Label>
                      <Input
                        id="conta"
                        placeholder="567890-1"
                        value={editedMotorista.conta || ""}
                        onChange={(e) => setEditedMotorista({ ...editedMotorista, conta: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoConta">Tipo de Conta *</Label>
                    <Select
                      value={editedMotorista.tipoConta || "corrente"}
                      onValueChange={(value: "corrente" | "poupanca") => 
                        setEditedMotorista({ ...editedMotorista, tipoConta: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Salvar Alterações" : "Cadastrar Motorista"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
