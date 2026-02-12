import api from "@/api/axios";
import type { ApiResponse, Caminhao, CriarCaminhaoPayload } from "@/types";

export async function listarCaminhoes(): Promise<ApiResponse<Caminhao[]>> {
  try {
    const res = await api.get("/frota");
    // Backend retorna {success, message, data: [...]}
    // Então res.data.data contém o array de caminhões
    return { success: true, data: res.data.data || res.data };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao listar caminhões";
    return { success: false, data: null, message };
  }
}

export async function criarCaminhao(payload: CriarCaminhaoPayload): Promise<ApiResponse<Caminhao>> {
  try {
    const res = await api.post("/frota", payload);
    return { success: true, data: res.data.data || res.data };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao criar caminhão";
    return { success: false, data: null, message };
  }
}

export async function atualizarCaminhao(id: string, payload: Partial<CriarCaminhaoPayload>): Promise<ApiResponse<Caminhao>> {
  try {
    const res = await api.put(`/frota/${id}`, payload);
    return { success: true, data: res.data.data || res.data };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao atualizar caminhão";
    return { success: false, data: null, message };
  }
}

export async function deletarCaminhao(id: string): Promise<ApiResponse<void>> {
  try {
    await api.delete(`/frota/${id}`);
    return { success: true, data: null };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao deletar caminhão";
    return { success: false, data: null, message };
  }
}

const caminhoesService = {
  listarCaminhoes,
  criarCaminhao,
  atualizarCaminhao,
  deletarCaminhao,
};

export default caminhoesService;
