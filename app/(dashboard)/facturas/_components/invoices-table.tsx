"use client";

import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { deleteInvoiceAction } from "../_actions/invoices";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
    id: string;
    number: number;
    type: string;
    total: number;
    status: string;
    date: string;
    clients: { name: string } | { name: string }[] | null;
}

interface InvoicesTableProps {
    invoices: Invoice[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
    const router = useRouter();

    async function handleDelete(id: string) {
        const result = await deleteInvoiceAction(id);
        if (result.error) toast.error(result.error);
        else toast.success("Factura eliminada");
    }

    function getClientName(clients: Invoice["clients"]): string {
        if (!clients) return "—";
        if (Array.isArray(clients)) return clients[0]?.name ?? "—";
        return clients.name;
    }

    return (
        <div className="rounded-xl border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Número</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                            <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Fecha</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr
                                key={invoice.id}
                                className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => router.push(`/facturas/${invoice.id}`)}
                            >
                                <td className="px-4 py-3 font-medium">
                                    {invoice.type} {String(invoice.number).padStart(8, "0")}
                                </td>
                                <td className="px-4 py-3">{getClientName(invoice.clients)}</td>
                                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                    {formatDate(invoice.date)}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    {formatCurrency(invoice.total)}
                                </td>
                                <td className="px-4 py-3">
                                    <InvoiceStatusBadge status={invoice.status} />
                                </td>
                                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => router.push(`/facturas/${invoice.id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver detalle
                                            </DropdownMenuItem>
                                            {invoice.status === "draft" && (
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(invoice.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}