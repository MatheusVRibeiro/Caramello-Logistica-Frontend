import api from "@/api/axios";
import type { ApiResponse, User } from "@/types";

interface LoginPayload {
  email: string;
  senha: string;
}

interface BackendUsuario {
  id: string;
  email: string;
  nome: string;
  role?: "admin" | "operador" | "motorista";
}

interface BackendLoginResponse {
  success: boolean;
  message?: string;
  token: string;
  usuario: BackendUsuario;
}

interface LoginResult {
  user: User;
  token: string;
}

export async function login(email: string, senha: string): Promise<ApiResponse<LoginResult>> {
  try {
    const res = await api.post<BackendLoginResponse>("/auth/login", { email, senha });
    
    // Backend retorna: { success, message, token, usuario }
    if (res.data.success && res.data.token && res.data.usuario) {
      const { token, usuario } = res.data;
      
      if (!usuario) {
        return { success: false, data: null, message: "Usuário não encontrado na resposta" };
      }
      
      // Map backend fields (nome) to frontend format (name)
      const mappedUser: User = {
        id: usuario.id,
        name: usuario.nome,
        email: usuario.email,
        role: usuario.role ?? "admin",
      };
      
      return {
        success: true,
        data: {
          user: mappedUser,
          token: token,
        },
      };
    }
    
    return { success: false, data: null, message: "Resposta inválida do servidor" };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro na autenticação";
    return { success: false, data: null, message };
  }
}

export async function register(nome: string, email: string, senha: string): Promise<ApiResponse<{ user: User }>> {
  try {
    const res = await api.post("/auth/registrar", { nome, email, senha });
    
    if (res.data.success && res.data.data) {
      return {
        success: true,
        data: { user: res.data.data },
      };
    }
    
    return { success: false, data: null, message: "Resposta inválida do servidor" };
  } catch (err: unknown) {
    const message = err?.response?.data?.message ?? err.message ?? "Erro no registro";
    return { success: false, data: null, message };
  }
}
