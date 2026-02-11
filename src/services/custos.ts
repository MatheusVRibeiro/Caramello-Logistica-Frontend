import api from "@/api/axios";
import type { Custo, CriarCustoPayload, ApiResponse } from "@/types";

const listarCustos = async (): Promise<ApiResponse<Custo[]>> => {
  try {
    const res = await api.get("/custos");
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao listar custos";
    return { success: false, data: null, message };
  }
};

const obterCusto = async (id: string): Promise<ApiResponse<Custo>> => {
  try {
    const res = await api.get(`/custos/${id}`);
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao obter custo";
    return { success: false, data: null, message };
  }
};

const criarCusto = async (payload: CriarCustoPayload): Promise<ApiResponse<Custo>> => {
  try {
    const res = await api.post("/custos", payload);
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao criar custo";
    return { success: false, data: null, message };
  }
};

const atualizarCusto = async (
  id: string,
  payload: Partial<CriarCustoPayload>
): Promise<ApiResponse<Custo>> => {
  try {
    const res = await api.put(`/custos/${id}`, payload);
    return { success: true, data: res.data.data || res.data };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao atualizar custo";
    return { success: false, data: null, message };
  }
};

const deletarCusto = async (id: string): Promise<ApiResponse<void>> => {
  try {
    await api.delete(`/custos/${id}`);
    return { success: true, data: null };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao deletar custo";
    return { success: false, data: null, message };
  }
};

const custosService = {
  listarCustos,
  obterCusto,
  criarCusto,
  atualizarCusto,
  deletarCusto,
};

export default custosService;
