import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, Weight, DollarSign, Edit, Trash2 } from "lucide-react";

interface Mercadoria {
  id: string;
  nome: string;
  tipo: string;
  tarifaPorSaca: number;
  pesoMedioSaca: number;
}

const mercadoriasData: Mercadoria[] = [
  { id: "1", nome: "Amendoim em Casca", tipo: "In Natura", tarifaPorSaca: 15, pesoMedioSaca: 25 },
  { id: "2", nome: "Amendoim Descascado", tipo: "Processado", tarifaPorSaca: 20, pesoMedioSaca: 25 },
  { id: "3", nome: "Amendoim Premium", tipo: "Selecionado", tarifaPorSaca: 25, pesoMedioSaca: 25 },
  { id: "4", nome: "Amendoim Tipo 1", tipo: "Classificado", tarifaPorSaca: 18, pesoMedioSaca: 25 },
  { id: "5", nome: "Amendoim Tipo 2", tipo: "Classificado", tarifaPorSaca: 16, pesoMedioSaca: 25 },
];

export default function Mercadorias() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mercadoriasState, setMercadoriasState] = useState<Mercadoria[]>(mercadoriasData);
  const [newMercadoria, setNewMercadoria] = useState({
    nome: "",
    tipo: "",
    tarifaPorSaca: "",
    pesoMedioSaca: "25",
  });

  const filteredData = mercadoriasState.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.tipo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout title="Mercadorias" subtitle="Catálogo de mercadorias">
      <PageHeader
        title="Mercadorias"
        description="Gerencie os tipos de amendoim transportados"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Mercadoria
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar mercadoria..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((mercadoria) => (
          <Card key={mercadoria.id} className="hover:shadow-md transition-shadow animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-loss hover:text-loss"
                    onClick={() => {
                      setMercadoriasState(mercadoriasState.filter(m => m.id !== mercadoria.id));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{mercadoria.nome}</h3>
              <p className="text-sm text-muted-foreground mb-4">{mercadoria.tipo}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tarifa:</span>
                  <span className="font-medium text-profit">R$ {mercadoria.tarifaPorSaca}/saca</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Peso médio:</span>
                  <span className="font-medium">{mercadoria.pesoMedioSaca} kg/saca</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma mercadoria encontrada</p>
        </div>
      )}

      {/* New Merchandise Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Mercadoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                placeholder="Ex: Amendoim em Casca"
                value={newMercadoria.nome}
                onChange={(e) => setNewMercadoria({ ...newMercadoria, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo/Classificação</Label>
              <Input 
                id="tipo" 
                placeholder="Ex: In Natura, Processado, Selecionado"
                value={newMercadoria.tipo}
                onChange={(e) => setNewMercadoria({ ...newMercadoria, tipo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tarifa">Tarifa por Saca (R$)</Label>
                <Input 
                  id="tarifa" 
                  type="number"
                  placeholder="Ex: 15"
                  value={newMercadoria.tarifaPorSaca}
                  onChange={(e) => setNewMercadoria({ ...newMercadoria, tarifaPorSaca: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso Médio (kg/saca)</Label>
                <Input 
                  id="peso" 
                  type="number"
                  placeholder="Ex: 25"
                  value={newMercadoria.pesoMedioSaca}
                  onChange={(e) => setNewMercadoria({ ...newMercadoria, pesoMedioSaca: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setNewMercadoria({ nome: "", tipo: "", tarifaPorSaca: "", pesoMedioSaca: "25" });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (!newMercadoria.nome || !newMercadoria.tipo || !newMercadoria.tarifaPorSaca) {
                  alert("Preencha todos os campos obrigatórios!");
                  return;
                }

                const novaMercadoria: Mercadoria = {
                  id: String(mercadoriasState.length + 1),
                  nome: newMercadoria.nome,
                  tipo: newMercadoria.tipo,
                  tarifaPorSaca: parseFloat(newMercadoria.tarifaPorSaca),
                  pesoMedioSaca: parseFloat(newMercadoria.pesoMedioSaca || "25"),
                };

                setMercadoriasState([...mercadoriasState, novaMercadoria]);
                setIsModalOpen(false);
                setNewMercadoria({ nome: "", tipo: "", tarifaPorSaca: "", pesoMedioSaca: "25" });
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
