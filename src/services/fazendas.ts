import api from "@/api/axios";
import type { Fazenda, CriarFazendaPayload, ApiResponse } from "@/types";

const listarFazendas = async (): Promise<ApiResponse<Fazenda[]>> => {
  try {
    const res = await api.get("/fazendas");
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao listar fazendas";
    return { success: false, data: null, message };
  }
};

const obterFazenda = async (id: string): Promise<ApiResponse<Fazenda>> => {
  try {
    const res = await api.get(`/fazendas/${id}`);
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao obter fazenda";
    return { success: false, data: null, message };
  }
};

const criarFazenda = async (payload: CriarFazendaPayload): Promise<ApiResponse<Fazenda>> => {
  try {
    const res = await api.post("/fazendas", payload);
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao criar fazenda";
    return { success: false, data: null, message };
  }
};

const atualizarFazenda = async (
  id: string,
  payload: Partial<CriarFazendaPayload>
): Promise<ApiResponse<Fazenda>> => {
  try {
    const res = await api.put(`/fazendas/${id}`, payload);
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao atualizar fazenda";
    return { success: false, data: null, message };
  }
};

const deletarFazenda = async (id: string): Promise<ApiResponse<void>> => {
  try {
    await api.delete(`/fazendas/${id}`);
    return { success: true, data: null };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao deletar fazenda";
    return { success: false, data: null, message };
  }
};

const incrementarVolumeTransportado = async (
  id: string,
  toneladas: number
): Promise<ApiResponse<Fazenda>> => {
  try {
    const res = await api.post(`/fazendas/${id}/incrementar-volume`, { toneladas });
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao incrementar volume";
    return { success: false, data: null, message };
  }
};

const fazendasService = {
  listarFazendas,
  obterFazenda,
  criarFazenda,
  atualizarFazenda,
  deletarFazenda,
  incrementarVolumeTransportado,
};

export default fazendasService;
