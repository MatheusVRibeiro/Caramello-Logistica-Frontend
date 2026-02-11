import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  highlightNegative?: (item: T) => boolean;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = "Nenhum registro encontrado",
  highlightNegative,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-12 text-center animate-fade-in">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden animate-fade-in shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-muted/50 to-muted/30 hover:bg-muted/50 border-b-2">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn("font-bold text-foreground text-sm uppercase tracking-wide", column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const isNegative = highlightNegative?.(item);
            return (
              <TableRow
                key={index}
                className={cn(
                  "cursor-pointer transition-all duration-200 border-b hover:border-primary/20",
                  isNegative && "bg-loss/5 hover:bg-loss/10",
                  !isNegative && "hover:bg-primary/5 hover:shadow-sm"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn("py-3 px-4", column.className)}>
                    {column.render
                      ? column.render(item, index)
                      : (item as Record<string, unknown>)[column.key] as ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
