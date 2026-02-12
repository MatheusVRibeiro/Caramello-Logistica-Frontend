import api from "@/api/axios";
import type { ApiResponse, Frete, CriarFretePayload } from "@/types";

interface BackendFretesResponse {
  success: boolean;
  message: string;
  data: Frete[];
}

interface BackendFreteResponse {
  success: boolean;
  message: string;
  data: { id: string };
}

export async function listarFretes(): Promise<ApiResponse<Frete[]>> {
  try {
    const res = await api.get<BackendFretesResponse>("/fretes");
    
    if (res.data.success && res.data.data) {
      return { success: true, data: res.data.data };
    }
    
    return { success: false, data: null, message: "Resposta inválida do servidor" };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao listar fretes";
    return { success: false, data: null, message };
  }
}

export async function criarFrete(payload: CriarFretePayload): Promise<ApiResponse<{ id: string }>> {
  try {
    const res = await api.post<BackendFreteResponse>("/fretes", payload);
    
    if (res.data.success && res.data.data) {
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    }
    
    return { success: false, data: null, message: "Resposta inválida do servidor" };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err?.response?.data?.error ?? err.message ?? "Erro ao criar frete";
    return { success: false, data: null, message };
  }
}

export async function obterFrete(id: string): Promise<ApiResponse<Frete>> {
  try {
    const res = await api.get<{ success: boolean; message: string; data: Frete }>(`/fretes/${id}`);
    
    if (res.data.success && res.data.data) {
      return { success: true, data: res.data.data };
    }
    
    return { success: false, data: null, message: "Frete não encontrado" };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro ao obter frete";
    return { success: false, data: null, message };
  }
}
