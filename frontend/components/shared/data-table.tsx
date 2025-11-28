import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((col) => (
              <TableHead key={String(col.key)} className="font-semibold text-foreground">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/20">
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
