import api from "@/api/axios";
import type { ApiResponse, Pagamento, CriarPagamentoPayload, AtualizarPagamentoPayload } from "@/types";

const listarPagamentos = async (): Promise<ApiResponse<Pagamento[]>> => {
  try {
    const res = await api.get("/pagamentos");
    return { success: true, data: res.data.data || res.data };
  } catch (err: unknown) {
    const message = (err as any)?.response?.data?.message ?? (err as Error).message ?? "Erro ao listar pagamentos";
    return { success: false, data: null, message };
  }
};

const obterPagamento = async (id: string): Promise<ApiResponse<Pagamento>> => {
  try {
    const res = await api.get(`/pagamentos/${id}`);
    return { success: true, data: res.data.data || res.data };
  } catch (err: unknown) {
    const message = (err as any)?.response?.data?.message ?? (err as Error).message ?? "Erro ao obter pagamento";
    return { success: false, data: null, message };
  }
};

const criarPagamento = async (payload: CriarPagamentoPayload): Promise<ApiResponse<{ id: string }>> => {
  try {
    const res = await api.post("/pagamentos", payload);
    return { success: true, data: res.data.data || res.data, message: res.data.message };
  } catch (err: unknown) {
    const message = (err as any)?.response?.data?.message ?? (err as Error).message ?? "Erro ao criar pagamento";
    return { success: false, data: null, message };
  }
};

const atualizarPagamento = async (
  id: string,
  payload: AtualizarPagamentoPayload
): Promise<ApiResponse<{ id: string }>> => {
  try {
    const res = await api.put(`/pagamentos/${id}`, payload);
    return { success: true, data: res.data.data || res.data, message: res.data.message };
  } catch (err: unknown) {
    const message = (err as any)?.response?.data?.message ?? (err as Error).message ?? "Erro ao atualizar pagamento";
    return { success: false, data: null, message };
  }
};

const deletarPagamento = async (id: string): Promise<ApiResponse<void>> => {
  try {
    await api.delete(`/pagamentos/${id}`);
    return { success: true, data: null };
  } catch (err: unknown) {
    const message = (err as any)?.response?.data?.message ?? (err as Error).message ?? "Erro ao deletar pagamento";
    return { success: false, data: null, message };
  }
};

const pagamentosService = {
  listarPagamentos,
  obterPagamento,
  criarPagamento,
  atualizarPagamento,
  deletarPagamento,
};

export default pagamentosService;
