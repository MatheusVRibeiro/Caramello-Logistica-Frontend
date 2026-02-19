import { useState, useCallback } from "react";
import { toast } from "sonner";

interface RefreshDataOptions {
  autoClose?: boolean;
  showToast?: boolean;
}

/**
 * Hook para gerenciar refresh de dados após mutações
 * Mostra indicador visual enquanto carrega novos dados
 */
export const useRefreshData = (options: RefreshDataOptions = {}) => {
  const { autoClose = true, showToast = true } = options;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (showToast) {
      toast.info("🔄 Atualizando dados...", { duration: 2000 });
    }
  }, [showToast]);

  const endRefresh = useCallback(() => {
    setIsRefreshing(false);
    if (autoClose && showToast) {
      toast.success("✓ Dados atualizados", { duration: 1500 });
    }
  }, [autoClose, showToast]);

  const refreshData = useCallback(
    async (fetchFn: () => Promise<any>, setDataFn?: (data: any) => void) => {
      startRefresh();
      try {
        const result = await fetchFn();
        if (setDataFn) {
          setDataFn(result);
        }
        endRefresh();
        return result;
      } catch (error) {
        setIsRefreshing(false);
        toast.error("❌ Erro ao atualizar dados");
        throw error;
      }
    },
    [startRefresh, endRefresh]
  );

  return {
    isRefreshing,
    startRefresh,
    endRefresh,
    refreshData,
  };
};
