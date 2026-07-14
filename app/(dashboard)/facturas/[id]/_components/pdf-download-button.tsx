"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInvoicePDF } from "@/lib/pdf/generate-invoice";
import type { Invoice, Client, Company, InvoiceItem } from "@/types";

interface PDFDownloadButtonProps {
    invoice: Invoice & { items: InvoiceItem[] };
    client: Client;
    company: Company;
}

export function PDFDownloadButton({ invoice, client, company }: PDFDownloadButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleDownload() {
        setLoading(true);
        try {
            const pdfBytes = await generateInvoicePDF({ invoice, client, company });
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factura-${invoice.type}-${String(invoice.number).padStart(8, "0")}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" onClick={handleDownload} disabled={loading}>
            {loading
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Download className="mr-2 h-4 w-4" />
            }
            Descargar PDF
        </Button>
    );
}