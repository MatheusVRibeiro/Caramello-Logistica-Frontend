import { cn } from "@/lib/utils";

interface RefreshingIndicatorProps {
  isRefreshing: boolean;
  position?: "top" | "bottom";
}

/**
 * Componente que mostra indicador visual enquanto dados estão sendo atualizados
 * Aparece como uma barra animada no topo ou rodapé da página
 */
export const RefreshingIndicator = ({ isRefreshing, position = "top" }: RefreshingIndicatorProps) => {
  if (!isRefreshing) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 z-50",
        "animate-pulse transition-all duration-300",
        position === "top" ? "top-0" : "bottom-0"
      )}
    >
      <div className="h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

/**
 * Componente de loading em overlay (centro da tela)
 */
export const RefreshingOverlay = ({ isRefreshing, message = "Atualizando..." }: { isRefreshing: boolean; message?: string }) => {
  if (!isRefreshing) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</p>
      </div>
    </div>
  );
};
