import axios from "axios";

const IBGE_API_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export interface Municipio {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        id: number;
        sigla: string;
        nome: string;
      };
    };
  };
}

export interface CidadeFormatada {
  id: number;
  nome: string;
  estado: string;
  estadoSigla: string;
  label: string; // "Cidade - UF"
}

/**
 * Busca todos os estados brasileiros
 */
export const buscarEstados = async (): Promise<Estado[]> => {
  try {
    const response = await axios.get<Estado[]>(`${IBGE_API_BASE}/estados`, {
      params: { orderBy: "nome" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    return [];
  }
};

/**
 * Busca todos os municípios de um estado específico
 */
export const buscarMunicipiosPorEstado = async (uf: string): Promise<CidadeFormatada[]> => {
  try {
    const response = await axios.get<Municipio[]>(`${IBGE_API_BASE}/estados/${uf}/municipios`, {
      params: { orderBy: "nome" },
    });
    
    return response.data.map((municipio) => ({
      id: municipio.id,
      nome: municipio.nome,
      estado: municipio.microrregiao.mesorregiao.UF.nome,
      estadoSigla: municipio.microrregiao.mesorregiao.UF.sigla,
      label: `${municipio.nome} - ${municipio.microrregiao.mesorregiao.UF.sigla}`,
    }));
  } catch (error) {
    console.error(`Erro ao buscar municípios do estado ${uf}:`, error);
    return [];
  }
};

/**
 * Busca todos os municípios do Brasil (use com cuidado, são 5570+ cidades)
 */
export const buscarTodosMunicipios = async (): Promise<CidadeFormatada[]> => {
  try {
    const response = await axios.get<Municipio[]>(`${IBGE_API_BASE}/municipios`, {
      params: { orderBy: "nome" },
    });
    
    return response.data.map((municipio) => ({
      id: municipio.id,
      nome: municipio.nome,
      estado: municipio.microrregiao.mesorregiao.UF.nome,
      estadoSigla: municipio.microrregiao.mesorregiao.UF.sigla,
      label: `${municipio.nome} - ${municipio.microrregiao.mesorregiao.UF.sigla}`,
    }));
  } catch (error) {
    console.error("Erro ao buscar todos os municípios:", error);
    return [];
  }
};

const ibgeService = {
  buscarEstados,
  buscarMunicipiosPorEstado,
  buscarTodosMunicipios,
};

export default ibgeService;
