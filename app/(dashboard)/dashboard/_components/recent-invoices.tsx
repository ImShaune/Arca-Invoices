import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

const statusConfig = {
    draft: { label: "Borrador", variant: "secondary" },
    emitted: { label: "Emitida", variant: "default" },
    cancelled: { label: "Anulada", variant: "destructive" },
    overdue: { label: "Vencida", variant: "destructive" },
} as const;

interface RecentInvoicesProps {
    invoices: Array<{
        id: string;
        number: number;
        type: string;
        total: number;
        status: string;
        date: string;
        clients: { name: string | null } | { name: string | null }[] | null;
    }>;
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="font-semibold">Últimas facturas</h3>
                <p className="text-sm text-muted-foreground">
                    Actividad reciente
                </p>
            </div>

            {invoices.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Sin facturas"
                    description="Todavía no emitiste ninguna factura."
                />
            ) : (
                <div className="space-y-4">
                    {invoices.map((invoice) => {
                        const status = statusConfig[invoice.status as keyof typeof statusConfig];
                        return (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between gap-2"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {(Array.isArray(invoice.clients)
                                            ? invoice.clients[0]?.name
                                            : invoice.clients?.name) ?? "Cliente eliminado"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Fact. {invoice.type} #{String(invoice.number).padStart(8, "0")} · {formatDate(invoice.date)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-semibold">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                    <Badge variant={status?.variant ?? "secondary"} className="text-[10px]">
                                        {status?.label ?? invoice.status}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}