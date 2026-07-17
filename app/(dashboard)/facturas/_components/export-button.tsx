"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { formatDate } from "@/lib/utils";

interface Invoice {
    number: number;
    type: string;
    date: string;
    total: number;
    status: string;
    clients: { name: string } | { name: string }[] | null;
}

interface ExportButtonProps {
    invoices: Invoice[];
}

const STATUS_LABELS: Record<string, string> = {
    draft: "Borrador",
    emitted: "Emitida",
    cancelled: "Anulada",
    overdue: "Vencida",
};

export function ExportButton({ invoices }: ExportButtonProps) {
    function handleExport() {
        const rows = invoices.map((inv) => {
            const clientName = Array.isArray(inv.clients)
                ? inv.clients[0]?.name ?? "—"
                : inv.clients?.name ?? "—";

            return {
                "Tipo": inv.type,
                "Número": String(inv.number).padStart(8, "0"),
                "Cliente": clientName,
                "Fecha": formatDate(inv.date),
                "Total": inv.total,
                "Estado": STATUS_LABELS[inv.status] ?? inv.status,
            };
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Facturas");

        ws["!cols"] = [
            { wch: 8 },
            { wch: 12 },
            { wch: 30 },
            { wch: 14 },
            { wch: 16 },
            { wch: 12 },
        ];

        XLSX.writeFile(wb, `facturas-${new Date().toISOString().split("T")[0]}.xlsx`);
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
        </Button>
    );
}