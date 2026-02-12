import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, AlertCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkeletonCard } from "./Skeleton";

interface SummaryCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "danger" | "success";
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  isLoading?: boolean;
}

interface QuickGlanceDashboardProps {
  cards: SummaryCard[];
  isLoading?: boolean;
}

/**
 * Dashboard de "Batida de Olho" - Resumo visual rápido do estado do negócio
 * Usado no topo das telas de Fretes, Pagamentos, etc.
 */
export function QuickGlanceDashboard({
  cards,
  isLoading = false,
}: QuickGlanceDashboardProps) {
  const variantConfig = {
    default: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200 dark:border-blue-900",
      text: "text-blue-700 dark:text-blue-300",
      icon: "text-blue-600 dark:text-blue-400",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-900",
      text: "text-amber-700 dark:text-amber-300",
      icon: "text-amber-600 dark:text-amber-400",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-900",
      text: "text-red-700 dark:text-red-300",
      icon: "text-red-600 dark:text-red-400",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-900",
      text: "text-green-700 dark:text-green-300",
      icon: "text-green-600 dark:text-green-400",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const config = variantConfig[card.variant || "default"];
        const isCardLoading = isLoading || card.isLoading;

        return (
          <Card
            key={idx}
            className={cn(
              "p-4 border-2 transition-all hover:shadow-md",
              config.bg,
              config.border
            )}
          >
            <CardContent className="p-0 space-y-3">
              {/* Header com ícone e título */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {card.title}
                  </p>
                </div>
                <div className={cn("p-2 rounded-lg", config.bg)}>
                  {card.icon}
                </div>
              </div>

              {/* Value principal */}
              {isCardLoading ? (
                <SkeletonCard />
              ) : (
                <>
                  <div className="flex items-end gap-2">
                    <span className={cn("text-3xl font-bold", config.text)}>
                      {typeof card.value === "number"
                        ? card.value.toLocaleString("pt-BR")
                        : card.value}
                    </span>
                    {card.trend && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "mb-1",
                          card.trend.direction === "up"
                            ? "border-green-300 text-green-700 dark:text-green-300"
                            : "border-red-300 text-red-700 dark:text-red-300"
                        )}
                      >
                        {card.trend.direction === "up" ? "↑" : "↓"}{" "}
                        {Math.abs(card.trend.value)}%
                      </Badge>
                    )}
                  </div>

                  {/* Subtitle */}
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Helper para criar cards padrão de fretes
 */
export function createFretesQuickGlanceCards(data: {
  fretesToday: number;
  fretesTodaySacas: number;
  pendingPayments: number;
  pendingPaymentsValue: number;
  tasksOverdue: number;
  fleetUtilization: number;
  isLoading?: boolean;
}): SummaryCard[] {
  return [
    {
      title: "Fretes Hoje",
      value: data.fretesToday,
      subtitle: `${data.fretesTodaySacas} sacas transportadas`,
      icon: <Package className="h-5 w-5 text-blue-600" />,
      variant: "default",
      isLoading: data.isLoading,
    },
    {
      title: "Pendentes de Pagamento",
      value: data.pendingPayments,
      subtitle: `R$ ${data.pendingPaymentsValue.toLocaleString("pt-BR")} em aberto`,
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      variant: data.pendingPayments > 0 ? "warning" : "success",
      isLoading: data.isLoading,
    },
    {
      title: "Tarefas Atrasadas",
      value: data.tasksOverdue,
      subtitle: "Atenção necessária",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      variant: data.tasksOverdue > 0 ? "danger" : "success",
      isLoading: data.isLoading,
    },
    {
      title: "Utilização da Frota",
      value: `${data.fleetUtilization}%`,
      subtitle: "Caminhões em uso",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      variant: data.fleetUtilization >= 80 ? "success" : "default",
      isLoading: data.isLoading,
    },
  ];
}
