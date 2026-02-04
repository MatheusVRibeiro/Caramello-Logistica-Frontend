import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Package, Weight, DollarSign, Edit, MapPin, Save, X, Info, TrendingUp, Calendar, User, Sparkles, BarChart3, FileDown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface ProducaoFazenda {
  id: string;
  fazenda: string;
  localizacao: string;
  proprietario: string;
  mercadoria: string;
  variedade: string;
  totalSacasCarregadas: number;  // Começa em 0, aumenta conforme carrega
  totalToneladas: number;          // Começa em 0, aumenta conforme carrega
  faturamentoTotal: number;        // Começa em 0, aumenta conforme carrega
  precoPorTonelada: number;        // Preço base por tonelada
  pesoMedioSaca: number;           // Peso médio em kg
  safra: string;
  ultimoFrete: string;             // Data do último frete
  colheitaFinalizada?: boolean;    // Marca se a colheita foi finalizada
}

const producaoFazendasData: ProducaoFazenda[] = [
  {
    id: "1",
    fazenda: "Fazenda Santa Esperança",
    localizacao: "Marília, SP",
    proprietario: "João Silva",
    mercadoria: "Amendoim em Casca",
    variedade: "Verde",
    totalSacasCarregadas: 0,
    totalToneladas: 0,
    faturamentoTotal: 0,
    precoPorTonelada: 600,
    pesoMedioSaca: 25,
    safra: "2024/2025",
    ultimoFrete: "-",
    colheitaFinalizada: false,
  },
  {
    id: "2",
    fazenda: "Fazenda Boa Vista",
    localizacao: "Tupã, SP",
    proprietario: "Maria Santos",
    mercadoria: "Amendoim em Casca",
    variedade: "Vermelho",
    totalSacasCarregadas: 0,
    totalToneladas: 0,
    faturamentoTotal: 0,
    precoPorTonelada: 720,
    pesoMedioSaca: 25,
    safra: "2024/2025",
    ultimoFrete: "-",
    colheitaFinalizada: false,
  },
  {
    id: "3",
    fazenda: "Fazenda São João",
    localizacao: "Jaboticabal, SP",
    proprietario: "Pedro Costa",
    mercadoria: "Amendoim Premium",
    variedade: "Selecionado",
    totalSacasCarregadas: 0,
    totalToneladas: 0,
    faturamentoTotal: 0,
    precoPorTonelada: 1000,
    pesoMedioSaca: 25,
    safra: "2024/2025",
    ultimoFrete: "-",
    colheitaFinalizada: false,
  },
  {
    id: "4",
    fazenda: "Fazenda Vale Verde",
    localizacao: "Ribeirão Preto, SP",
    proprietario: "Lucas Oliveira",
    mercadoria: "Amendoim Descascado",
    variedade: "Tipo 1",
    totalSacasCarregadas: 0,
    totalToneladas: 0,
    faturamentoTotal: 0,
    precoPorTonelada: 800,
    pesoMedioSaca: 25,
    safra: "2024/2025",
    ultimoFrete: "-",
    colheitaFinalizada: false,
  },
  {
    id: "5",
    fazenda: "Fazenda Recanto",
    localizacao: "Barretos, SP",
    proprietario: "André Ribeiro",
    mercadoria: "Amendoim em Casca",
    variedade: "Runner",
    totalSacasCarregadas: 0,
    totalToneladas: 0,
    faturamentoTotal: 0,
    precoPorTonelada: 640,
    pesoMedioSaca: 25,
    safra: "2024/2025",
    ultimoFrete: "-",
    colheitaFinalizada: false,
  },
];

export default function Fazendas() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducao, setSelectedProducao] = useState<ProducaoFazenda | null>(null);
  const [producaoState, setProducaoState] = useState<ProducaoFazenda[]>(producaoFazendasData);
  const [newProducao, setNewProducao] = useState<Partial<ProducaoFazenda>>({
    fazenda: "",
    localizacao: "",
    proprietario: "",
    mercadoria: "",
    variedade: "",
    totalSacasCarregadas: 0,
    totalToneladas: 0,
    faturamentoTotal: 0,
    precoPorTonelada: 0,
    pesoMedioSaca: 25,
    safra: "2024/2025",
    colheitaFinalizada: false,
  });

  const handleOpenNewModal = () => {
    setNewProducao({
      fazenda: "",
      localizacao: "",
      proprietario: "",
      mercadoria: "",
      variedade: "",
      totalSacasCarregadas: 0,
      totalToneladas: 0,
      faturamentoTotal: 0,
      precoPorTonelada: 0,
      pesoMedioSaca: 25,
      safra: "2024/2025",
      colheitaFinalizada: false,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (producao: ProducaoFazenda) => {
    setNewProducao(producao);
    setIsEditing(true);
    setSelectedProducao(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newProducao.fazenda || !newProducao.mercadoria || !newProducao.variedade) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    if (isEditing) {
      setProducaoState(prev => prev.map(p => 
        p.id === newProducao.id ? { ...p, ...newProducao } as ProducaoFazenda : p
      ));
      toast.success("Produção atualizada com sucesso!");
    } else {
      const novaProducao: ProducaoFazenda = {
        id: `${Math.floor(Math.random() * 10000)}`,
        fazenda: newProducao.fazenda!,
        localizacao: newProducao.localizacao || "",
        proprietario: newProducao.proprietario || "",
        mercadoria: newProducao.mercadoria!,
        variedade: newProducao.variedade!,
        totalSacasCarregadas: 0,
        totalToneladas: 0,
        faturamentoTotal: 0,
        precoPorTonelada: newProducao.precoPorTonelada!,
        pesoMedioSaca: newProducao.pesoMedioSaca || 25,
        safra: newProducao.safra || "2024/2025",
        ultimoFrete: "-",
        colheitaFinalizada: false,
      };
      setProducaoState([novaProducao, ...producaoState]);
      toast.success("Fazenda cadastrada com sucesso!");
    }

    setIsModalOpen(false);
  };

  const filteredData = producaoState.filter(
    (p) =>
      p.fazenda.toLowerCase().includes(search.toLowerCase()) ||
      p.mercadoria.toLowerCase().includes(search.toLowerCase()) ||
      p.variedade.toLowerCase().includes(search.toLowerCase()) ||
      p.proprietario.toLowerCase().includes(search.toLowerCase())
  );

  const fazendasAtivas = filteredData.filter((p) => !p.colheitaFinalizada);
  const fazendasFinalizadas = filteredData.filter((p) => p.colheitaFinalizada);

  // Função para adicionar produção quando um frete é carregado
  (window as any).adicionarProducao = (
    fazendaId: string, 
    quantidadeSacas: number, 
    valorFrete: number, 
    toneladas: number
  ) => {
    setProducaoState(prev => prev.map(p => {
      if (p.id === fazendaId) {
        return {
          ...p,
          totalSacasCarregadas: p.totalSacasCarregadas + quantidadeSacas,
          totalToneladas: p.totalToneladas + toneladas,
          faturamentoTotal: p.faturamentoTotal + valorFrete,
          ultimoFrete: new Date().toLocaleDateString("pt-BR"),
        };
      }
      return p;
    }));
  };

  // Expor fazendas para uso em outras páginas
  (window as any).getProducaoFazendas = () => producaoState;

  const handleToggleColheitaFinalizada = (fazendaId: string) => {
    let statusAtual = false;
    setProducaoState((prev) => {
      const fazenda = prev.find((p) => p.id === fazendaId);
      statusAtual = !!fazenda?.colheitaFinalizada;
      return prev.map((p) =>
        p.id === fazendaId
          ? { ...p, colheitaFinalizada: !p.colheitaFinalizada }
          : p
      );
    });

    toast.success(
      statusAtual
        ? "Colheita reaberta para atualização."
        : "Colheita finalizada com sucesso!"
    );
  };

  const handleExportarPDF = (fazenda: ProducaoFazenda) => {
    const doc = new jsPDF();

    // ==================== CABEÇALHO ====================
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 32, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("RN LOGÍSTICA", 14, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Relatório de Colheita", 14, 25);

    doc.setFontSize(9);
    doc.text(`Emitido em ${new Date().toLocaleDateString("pt-BR")}`, 165, 18, { align: "right" });

    // ==================== IDENTIFICAÇÃO ====================
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(fazenda.fazenda, 14, 46);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 50, 182, 20, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 50, 182, 20, 2, 2, "S");

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.text("Localização:", 18, 58);
    doc.setFont("helvetica", "normal");
    doc.text(fazenda.localizacao, 42, 58);

    doc.setFont("helvetica", "bold");
    doc.text("Proprietário:", 120, 58);
    doc.setFont("helvetica", "normal");
    doc.text(fazenda.proprietario, 146, 58);

    doc.setFont("helvetica", "bold");
    doc.text("Safra:", 18, 66);
    doc.setFont("helvetica", "normal");
    doc.text(fazenda.safra, 32, 66);

    // Status em badge
    const statusLabel = fazenda.colheitaFinalizada ? "COLHEITA FINALIZADA" : "COLHEITA EM ANDAMENTO";
    doc.setFillColor(fazenda.colheitaFinalizada ? 37 : 59, fazenda.colheitaFinalizada ? 99 : 130, fazenda.colheitaFinalizada ? 235 : 246);
    doc.roundedRect(145, 40, 50, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(statusLabel, 170, 46, { align: "center" });

    doc.setTextColor(0, 0, 0);

    // ==================== RESUMO ====================
    const precoPorSaca = (fazenda.precoPorTonelada * fazenda.pesoMedioSaca) / 1000;
    const faturamentoPorTon = fazenda.totalToneladas > 0
      ? fazenda.faturamentoTotal / fazenda.totalToneladas
      : 0;

    let y = 75;

    const card = (
      x: number,
      title: string,
      value: string,
      color: [number, number, number],
      fill: [number, number, number]
    ) => {
      doc.setFillColor(fill[0], fill[1], fill[2]);
      doc.roundedRect(x, y, 58, 26, 2, 2, "F");
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y, 58, 26, 2, 2, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(title, x + 4, y + 7);
      doc.setFontSize(12);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(value, x + 4, y + 17);
      doc.setTextColor(0, 0, 0);
    };

    card(
      14,
      "Sacas carregadas",
      fazenda.totalSacasCarregadas.toLocaleString("pt-BR"),
      [37, 99, 235],
      [239, 246, 255]
    );
    card(
      76,
      "Toneladas",
      fazenda.totalToneladas.toLocaleString("pt-BR", { maximumFractionDigits: 1 }),
      [30, 64, 175],
      [224, 231, 255]
    );
    card(
      138,
      "Faturamento",
      `R$ ${fazenda.faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      [22, 163, 74],
      [220, 252, 231]
    );

    y += 36;

    // ==================== DETALHES ====================
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(14, y - 6, 182, 44, 2, 2, "F");
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(14, y - 6, 182, 44, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Detalhes da Produção", 18, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Último frete:", 18, y);
    doc.setFont("helvetica", "normal");
    doc.text(fazenda.ultimoFrete, 50, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Preço por tonelada:", 18, y);
    doc.setFont("helvetica", "normal");
    doc.text(`R$ ${fazenda.precoPorTonelada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 60, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Preço por saca:", 18, y);
    doc.setFont("helvetica", "normal");
    doc.text(`R$ ${precoPorSaca.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, 52, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Peso médio por saca:", 18, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${fazenda.pesoMedioSaca}kg`, 64, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Faturamento por tonelada:", 18, y);
    doc.setFont("helvetica", "normal");
    doc.text(`R$ ${faturamentoPorTon.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`, 78, y);

    // ==================== RODAPÉ ====================
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(14, 285, 196, 285);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("RN Logistica - Sistema de Gestao de Fretes", 14, 288);
    doc.text("Pagina 1 de 1", 105, 288, { align: "center" });
    doc.text("Relatorio Confidencial", 196, 288, { align: "right" });

    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text("Este documento foi gerado automaticamente e contem informacoes confidenciais", 105, 292, { align: "center" });

    const nomeArquivo = `RN_Logistica_Producao_${fazenda.fazenda.replace(/\s+/g, "_")}.pdf`;
    doc.save(nomeArquivo);
    toast.success(`PDF "${nomeArquivo}" gerado com sucesso!`);
  };

  return (
    <MainLayout
      title="Fazendas"
      subtitle="Gestão de produção por fazenda"
    >
      <div className="space-y-6">
        <PageHeader
          title="Produção de Fazendas"
          actions={
            <Button onClick={handleOpenNewModal} size="lg" className="shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Nova Fazenda
            </Button>
          }
        />

        {/* Cards Resumo - Melhorados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total de Fazendas</p>
                  <p className="text-3xl font-bold tracking-tight">{producaoState.length}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Produtoras ativas
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Sacas Carregadas</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {producaoState.reduce((acc, p) => acc + p.totalSacasCarregadas, 0).toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Produção acumulada
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Toneladas</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {producaoState.reduce((acc, p) => acc + p.totalToneladas, 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                  </p>
                  <p className="text-xs text-purple-600 flex items-center gap-1">
                    <Weight className="h-3 w-3" />
                    Peso total carregado
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Weight className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Faturamento Total</p>
                  <p className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
                    R$ {(producaoState.reduce((acc, p) => acc + p.faturamentoTotal, 0) / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}k
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Receita acumulada
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-7 w-7 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por fazenda, proprietário, mercadoria..."
        />

        {/* Grid de Fazendas - Cards Modernos */}
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                Colheitas em andamento
              </h3>
              <Badge className="bg-blue-600 text-white">{fazendasAtivas.length} fazenda(s)</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {fazendasAtivas.map((fazenda) => {
            const precoPorSaca = (fazenda.precoPorTonelada * fazenda.pesoMedioSaca) / 1000;
            const hasProducao = fazenda.totalSacasCarregadas > 0;
            
            return (
              <Card 
                key={fazenda.id} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary/50"
                onClick={() => setSelectedProducao(fazenda)}
              >
                <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                          {fazenda.fazenda.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {fazenda.fazenda}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {fazenda.localizacao}
                        </div>
                      </div>
                    </div>
                    {fazenda.colheitaFinalizada ? (
                      <Badge className="bg-emerald-600 text-white shadow-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Finalizada
                      </Badge>
                    ) : (
                      hasProducao && (
                        <Badge variant="default" className="shadow-sm">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Ativa
                        </Badge>
                      )
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                  {/* Proprietário e Mercadoria */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Proprietário:</span>
                      <span className="font-medium">{fazenda.proprietario}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm">{fazenda.mercadoria}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {fazenda.variedade}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Estatísticas de Produção */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Sacas
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {fazenda.totalSacasCarregadas.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Weight className="h-3 w-3" />
                        Toneladas
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {fazenda.totalToneladas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                      </p>
                    </div>
                  </div>

                  {/* Faturamento */}
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 rounded-lg border border-green-200/50 dark:border-green-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-700 dark:text-green-400 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Faturamento Total
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                      R$ {fazenda.faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-2 pt-2 border-t border-green-200/50 dark:border-green-800/50 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Preço/ton:</span>
                        <span className="font-semibold">R$ {fazenda.precoPorTonelada.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Preço/saca:</span>
                        <span className="font-semibold">R$ {precoPorSaca.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Safra {fazenda.safra}
                    </div>
                    <div className="flex items-center gap-1">
                      Último frete: <span className="font-medium">{fazenda.ultimoFrete}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">Colheitas finalizadas</h3>
              <Badge className="bg-emerald-600 text-white">{fazendasFinalizadas.length} fazenda(s)</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {fazendasFinalizadas.map((fazenda) => {
                const precoPorSaca = (fazenda.precoPorTonelada * fazenda.pesoMedioSaca) / 1000;
                const hasProducao = fazenda.totalSacasCarregadas > 0;

                return (
                  <Card
                    key={fazenda.id}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20"
                    onClick={() => setSelectedProducao(fazenda)}
                  >
                    <CardHeader className="bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-transparent pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg">
                              {fazenda.fazenda.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <CardTitle className="text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                              {fazenda.fazenda}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {fazenda.localizacao}
                            </div>
                          </div>
                        </div>
                        {fazenda.colheitaFinalizada ? (
                          <Badge className="bg-emerald-600 text-white shadow-sm">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Finalizada
                          </Badge>
                        ) : (
                          hasProducao && (
                            <Badge variant="default" className="shadow-sm">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Ativa
                            </Badge>
                          )
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Proprietário:</span>
                          <span className="font-medium">{fazenda.proprietario}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-sm">{fazenda.mercadoria}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {fazenda.variedade}
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Sacas
                          </p>
                          <p className="text-2xl font-bold text-blue-600">
                            {fazenda.totalSacasCarregadas.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Weight className="h-3 w-3" />
                            Toneladas
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {fazenda.totalToneladas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 rounded-lg border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-green-700 dark:text-green-400 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Faturamento Total
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                          R$ {fazenda.faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-2 pt-2 border-t border-green-200/50 dark:border-green-800/50 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Preço/ton:</span>
                            <span className="font-semibold">R$ {fazenda.precoPorTonelada.toLocaleString("pt-BR")}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Preço/saca:</span>
                            <span className="font-semibold">R$ {precoPorSaca.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Safra {fazenda.safra}
                        </div>
                        <div className="flex items-center gap-1">
                          Último frete: <span className="font-medium">{fazenda.ultimoFrete}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Nenhuma fazenda encontrada</h3>
                <p className="text-muted-foreground text-sm">
                  Tente ajustar os filtros ou cadastre uma nova fazenda
                </p>
              </div>
              <Button onClick={handleOpenNewModal} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Fazenda
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Modal de Nova/Editar Fazenda */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {isEditing ? "Editar Fazenda" : "Cadastrar Nova Fazenda"}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto px-1 space-y-6">
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
                    value={newProducao.fazenda}
                    onChange={(e) => setNewProducao({ ...newProducao, fazenda: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input
                    id="localizacao"
                    placeholder="Ex: Marília, SP"
                    value={newProducao.localizacao}
                    onChange={(e) => setNewProducao({ ...newProducao, localizacao: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="proprietario">Proprietário</Label>
                  <Input
                    id="proprietario"
                    placeholder="Ex: João Silva"
                    value={newProducao.proprietario}
                    onChange={(e) => setNewProducao({ ...newProducao, proprietario: e.target.value })}
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
                    value={newProducao.mercadoria}
                    onChange={(e) => setNewProducao({ ...newProducao, mercadoria: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variedade">Variedade/Cor *</Label>
                  <Input
                    id="variedade"
                    placeholder="Ex: Verde, Vermelho, Runner"
                    value={newProducao.variedade}
                    onChange={(e) => setNewProducao({ ...newProducao, variedade: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safra">Safra</Label>
                  <Input
                    id="safra"
                    placeholder="Ex: 2024/2025"
                    value={newProducao.safra}
                    onChange={(e) => setNewProducao({ ...newProducao, safra: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesoMedioSaca">Peso Médio por Saca (kg)</Label>
                  <Input
                    id="pesoMedioSaca"
                    type="number"
                    placeholder="25"
                    value={newProducao.pesoMedioSaca}
                    onChange={(e) => setNewProducao({ ...newProducao, pesoMedioSaca: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Seção: Valores */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <DollarSign className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-green-600">Valores</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precoPorTonelada">Preço por Tonelada (R$) *</Label>
                  <Input
                    id="precoPorTonelada"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 600.00"
                    value={newProducao.precoPorTonelada}
                    onChange={(e) => setNewProducao({ ...newProducao, precoPorTonelada: Number(e.target.value) })}
                  />
                </div>

                {newProducao.precoPorTonelada > 0 && newProducao.pesoMedioSaca > 0 && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Preço Calculado por Saca</Label>
                    <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-blue-50 dark:bg-blue-950/20">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="font-bold text-blue-600">
                        R$ {((newProducao.precoPorTonelada * newProducao.pesoMedioSaca) / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-muted-foreground">/saca ({newProducao.pesoMedioSaca}kg)</span>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Produção Acumulada
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 dark:text-blue-400">Sacas Carregadas</p>
                      <p className="font-bold text-lg">{newProducao.totalSacasCarregadas?.toLocaleString("pt-BR") || 0}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 dark:text-blue-400">Toneladas</p>
                      <p className="font-bold text-lg">{newProducao.totalToneladas?.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) || 0}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 dark:text-blue-400">Faturamento</p>
                      <p className="font-bold text-lg">R$ {newProducao.faturamentoTotal?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Último frete: {newProducao.ultimoFrete || "-"}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Como funciona:</strong> Defina o preço por tonelada e o peso médio da saca. 
                  O sistema calcula automaticamente o valor por saca e o faturamento conforme os fretes são carregados.
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Importante:</strong> A produção será incrementada automaticamente conforme os fretes forem cadastrados. 
                Não é necessário informar quantidades iniciais.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Salvar Alterações" : "Cadastrar Fazenda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes - Redesenhado */}
      <Dialog open={!!selectedProducao} onOpenChange={() => setSelectedProducao(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto px-1">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-2xl">
                    {selectedProducao?.fazenda.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold mb-1">{selectedProducao?.fazenda}</DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedProducao?.localizacao}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedProducao?.proprietario}
                    </div>
                  </div>
                </div>
              </div>
              {selectedProducao?.colheitaFinalizada ? (
                <Badge className="bg-emerald-600 text-white">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Colheita finalizada
                </Badge>
              ) : (
                <Badge variant="outline">Colheita em andamento</Badge>
              )}
            </div>
          </DialogHeader>

          {selectedProducao && (
            <div className="space-y-6 pt-4">
              {/* Métricas Principais em Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Package className="h-5 w-5" />
                        <p className="text-sm font-medium">Sacas Carregadas</p>
                      </div>
                      <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
                        {selectedProducao.totalSacasCarregadas.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-muted-foreground">unidades transportadas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Weight className="h-5 w-5" />
                        <p className="text-sm font-medium">Total em Toneladas</p>
                      </div>
                      <p className="text-4xl font-bold text-purple-700 dark:text-purple-400">
                        {selectedProducao.totalToneladas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                      </p>
                      <p className="text-xs text-muted-foreground">peso transportado</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-yellow-100/50 dark:from-amber-950/30 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <DollarSign className="h-5 w-5" />
                        <p className="text-sm font-medium">Faturamento Total</p>
                      </div>
                      <p className="text-4xl font-bold text-amber-700 dark:text-amber-400">
                        R$ {(selectedProducao.faturamentoTotal / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}k
                      </p>
                      <p className="text-xs text-muted-foreground">receita acumulada</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Informações do Produto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Produto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Mercadoria:</span>
                      <span className="font-semibold">{selectedProducao.mercadoria}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Variedade:</span>
                      <Badge variant="outline">{selectedProducao.variedade}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Safra:</span>
                      <Badge className="bg-green-500">{selectedProducao.safra}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Peso Médio/Saca:</span>
                      <span className="font-semibold">{selectedProducao.pesoMedioSaca}kg</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Precificação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Preço/Tonelada:</span>
                      <span className="font-bold text-green-600">
                        R$ {selectedProducao.precoPorTonelada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Preço/Saca:</span>
                      <span className="font-bold text-blue-600">
                        R$ {((selectedProducao.precoPorTonelada * selectedProducao.pesoMedioSaca) / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {selectedProducao.totalSacasCarregadas > 0 && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-muted-foreground">Média Real/Saca:</span>
                        <span className="font-bold text-purple-600">
                          R$ {(selectedProducao.faturamentoTotal / selectedProducao.totalSacasCarregadas).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Último Frete:</span>
                      <Badge variant="outline" className="font-mono">{selectedProducao.ultimoFrete}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas Avançadas */}
              {selectedProducao.totalSacasCarregadas > 0 && (
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/20">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Análise de Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                        <p className="text-sm text-muted-foreground mb-2">Faturamento/Tonelada</p>
                        <p className="text-2xl font-bold text-amber-600">
                          R$ {(selectedProducao.faturamentoTotal / selectedProducao.totalToneladas).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                        <p className="text-sm text-muted-foreground mb-2">Fretes Estimados</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.ceil(selectedProducao.totalSacasCarregadas / 1200)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                        <p className="text-sm text-muted-foreground mb-2">Peso Real Médio/Saca</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {((selectedProducao.totalToneladas * 1000) / selectedProducao.totalSacasCarregadas).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}kg
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 mt-6 flex-wrap">
            <Button variant="outline" onClick={() => setSelectedProducao(null)} size="lg">
              Fechar
            </Button>
            {selectedProducao && (
              <Button
                variant="outline"
                onClick={() => handleExportarPDF(selectedProducao)}
                size="lg"
                className="gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </Button>
            )}
            {selectedProducao && (
              <Button
                variant={selectedProducao.colheitaFinalizada ? "outline" : "default"}
                onClick={() => handleToggleColheitaFinalizada(selectedProducao.id)}
                size="lg"
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {selectedProducao.colheitaFinalizada ? "Reabrir Colheita" : "Finalizar Colheita"}
              </Button>
            )}
            <Button 
              onClick={() => {
                handleOpenEditModal(selectedProducao!);
              }}
              size="lg"
              className="shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Fazenda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
