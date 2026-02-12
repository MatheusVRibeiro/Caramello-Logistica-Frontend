import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "circle" | "text" | "line" | "bar";
  count?: number;
  height?: string;
  width?: string;
}

export function Skeleton({
  className,
  variant = "line",
  count = 1,
  height,
  width,
  ...props
}: SkeletonProps) {
  const variants = {
    card: "rounded-lg",
    circle: "rounded-full",
    text: "rounded-md",
    line: "rounded-md",
    bar: "rounded-md",
  };

  const skeletonClass = cn(
    "animate-pulse bg-gradient-to-r from-muted to-muted-foreground/20",
    variants[variant],
    className
  );

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={skeletonClass}
            style={{
              height: height || "20px",
              width: width || "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClass}
      style={{
        height: height || "20px",
        width: width || "100%",
      }}
      {...props}
    />
  );
}

/**
 * Skeleton para Cards de Resumo (KPI Cards)
 */
export function SkeletonCard() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton height="20px" width="40%" />
      <Skeleton height="32px" width="70%" variant="text" />
      <div className="pt-2">
        <Skeleton height="16px" width="50%" />
      </div>
    </div>
  );
}

/**
 * Skeleton para Linha de Tabela
 */
export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton height="40px" width="40px" variant="circle" />
      <Skeleton height="20px" width="25%" />
      <Skeleton height="20px" width="25%" />
      <Skeleton height="20px" width="20%" />
      <Skeleton height="20px" width="20%" />
    </div>
  );
}

/**
 * Skeleton para Tabela Inteira
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 border rounded-lg p-4">
      <div className="grid grid-cols-5 gap-4 pb-4 border-b">
        <Skeleton height="20px" width="95%" />
        <Skeleton height="20px" width="95%" />
        <Skeleton height="20px" width="95%" />
        <Skeleton height="20px" width="95%" />
        <Skeleton height="20px" width="95%" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton para Dialog Modal
 */
export function SkeletonModal() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton height="24px" width="50%" />
      <div className="space-y-3">
        <Skeleton height="20px" width="30%" />
        <Skeleton height="40px" width="100%" />
      </div>
      <div className="space-y-3">
        <Skeleton height="20px" width="30%" />
        <Skeleton height="40px" width="100%" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton height="40px" width="100%" />
        <Skeleton height="40px" width="100%" />
      </div>
    </div>
  );
}
