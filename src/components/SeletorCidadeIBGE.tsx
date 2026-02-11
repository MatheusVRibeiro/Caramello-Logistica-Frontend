import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ibgeService, { type Estado, type CidadeFormatada } from "@/services/ibge";
import { Loader2 } from "lucide-react";

interface SeletorCidadeIBGEProps {
  value?: string; // Formato: "Cidade - UF" ou "Cidade, UF"
  onChange: (localizacao: string) => void;
  errorMessage?: string;
}

export function SeletorCidadeIBGE({ value, onChange, errorMessage }: SeletorCidadeIBGEProps) {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<CidadeFormatada[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);

  // Carregar estados ao montar o componente
  useEffect(() => {
    carregarEstados();
  }, []);

  // Parse do valor inicial (ex: "São Paulo - SP" ou "São Paulo, SP")
  useEffect(() => {
    if (value && estados.length > 0) {
      const partes = value.split(/[-,]\s*/);
      if (partes.length === 2) {
        const ufInicial = partes[1].trim();
        const cidadeInicial = partes[0].trim();
        
        setEstadoSelecionado(ufInicial);
        setCidadeSelecionada(cidadeInicial);
        
        // Carregar cidades do estado inicial
        carregarCidades(ufInicial);
      }
    }
  }, [value, estados]);

  const carregarEstados = async () => {
    setLoadingEstados(true);
    const data = await ibgeService.buscarEstados();
    setEstados(data);
    setLoadingEstados(false);
  };

  const carregarCidades = async (uf: string) => {
    if (!uf) return;
    
    setLoadingCidades(true);
    setCidades([]);
    setCidadeSelecionada("");
    
    const data = await ibgeService.buscarMunicipiosPorEstado(uf);
    setCidades(data);
    setLoadingCidades(false);
  };

  const handleEstadoChange = (uf: string) => {
    setEstadoSelecionado(uf);
    carregarCidades(uf);
    onChange(""); // Limpa a localização enquanto não seleciona cidade
  };

  const handleCidadeChange = (cidadeNome: string) => {
    setCidadeSelecionada(cidadeNome);
    const localizacaoCompleta = `${cidadeNome}, ${estadoSelecionado}`;
    onChange(localizacaoCompleta);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="estado">Estado (UF)</Label>
        {loadingEstados ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando estados...
          </div>
        ) : (
          <Select value={estadoSelecionado} onValueChange={handleEstadoChange}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.id} value={estado.sigla}>
                  {estado.nome} ({estado.sigla})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cidade">Cidade</Label>
        {loadingCidades ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando cidades...
          </div>
        ) : !estadoSelecionado ? (
          <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
            Selecione um estado primeiro
          </div>
        ) : (
          <>
            <Select 
              value={cidadeSelecionada} 
              onValueChange={handleCidadeChange}
              disabled={cidades.length === 0}
            >
              <SelectTrigger id="cidade">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {cidades.map((cidade) => (
                  <SelectItem key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </>
        )}
      </div>

      {estadoSelecionado && cidadeSelecionada && (
        <div className="text-sm text-muted-foreground">
          📍 Localização: <span className="font-medium">{cidadeSelecionada}, {estadoSelecionado}</span>
        </div>
      )}
    </div>
  );
}
