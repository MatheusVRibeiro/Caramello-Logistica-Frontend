import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TipoVisualizacao } from "@/hooks/usePeriodoFilter";

interface PeriodoFilterProps {
  tipoVisualizacao: TipoVisualizacao;
  selectedPeriodo: string;
  periodosDisponiveis: string[];
  formatPeriodoLabel: (periodo: string) => string;
  onTipoChange: (tipo: TipoVisualizacao) => void;
  onPeriodoChange: (periodo: string) => void;
}

export function PeriodoFilter({
  tipoVisualizacao,
  selectedPeriodo,
  periodosDisponiveis,
  formatPeriodoLabel,
  onTipoChange,
  onPeriodoChange,
}: PeriodoFilterProps) {
  return (
    <>
      {/* Seletor de Tipo de Visualização */}
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground whitespace-nowrap">Visualizar:</Label>
        <Select 
          value={tipoVisualizacao} 
          onValueChange={(value) => onTipoChange(value as TipoVisualizacao)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mensal">Mensal</SelectItem>
            <SelectItem value="trimestral">Trimestral</SelectItem>
            <SelectItem value="semestral">Semestral</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Seletor de Período (dinâmico) */}
      <div className="flex items-center gap-2">
        <Label className="text-sm text-muted-foreground whitespace-nowrap">Período:</Label>
        <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            {periodosDisponiveis.length === 0 ? (
              <SelectItem value="sem-dados" disabled>Nenhum dado disponível</SelectItem>
            ) : (
              periodosDisponiveis.map((periodo) => (
                <SelectItem key={periodo} value={periodo}>
                  {formatPeriodoLabel(periodo)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
