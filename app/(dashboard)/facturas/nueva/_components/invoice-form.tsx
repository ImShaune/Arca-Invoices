"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ClientSelector } from "./client-selector";
import { ProductLine, type LineItem } from "./product-line";
import { InvoiceTotals } from "./invoice-totals";
import { createInvoiceAction } from "../../_actions/invoices";
import type { Client, Product } from "@/types";

interface InvoiceFormProps {
    clients: Client[];
    products: Product[];
}

const INVOICE_TYPES = [
    { value: "A", label: "Factura A" },
    { value: "B", label: "Factura B" },
    { value: "C", label: "Factura C" },
];

function newLine(): LineItem {
    return {
        id: uuidv4(),
        product_id: null,
        description: "",
        quantity: 1,
        unit_price: 0,
        vat_rate: 21,
        subtotal: 0,
        vat_amount: 0,
        total: 0,
    };
}

export function InvoiceForm({ clients, products }: InvoiceFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [clientId, setClientId] = useState("");
    const [invoiceType, setInvoiceType] = useState<"A" | "B" | "C">("B");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState("");
    const [notes, setNotes] = useState("");
    const [lines, setLines] = useState<LineItem[]>([newLine()]);

    const addLine = () => setLines((prev) => [...prev, newLine()]);

    const updateLine = useCallback((id: string, updates: Partial<LineItem>) => {
        setLines((prev) =>
            prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
        );
    }, []);

    const removeLine = useCallback((id: string) => {
        setLines((prev) => prev.filter((l) => l.id !== id));
    }, []);

    const subtotal = lines.reduce((acc, l) => acc + l.subtotal, 0);
    const vatAmount = lines.reduce((acc, l) => acc + l.vat_amount, 0);
    const total = lines.reduce((acc, l) => acc + l.total, 0);

    async function handleSubmit(status: "draft" | "emitted") {
        if (!clientId) {
            toast.error("Seleccioná un cliente");
            return;
        }
        if (lines.length === 0 || lines.every((l) => !l.description)) {
            toast.error("Agregá al menos un producto");
            return;
        }

        setIsSubmitting(true);

        const result = await createInvoiceAction({
            client_id: clientId,
            type: invoiceType,
            point_of_sale: 1,
            date,
            due_date: dueDate || null,
            subtotal,
            vat_amount: vatAmount,
            total,
            notes: notes || null,
            items: lines.filter((l) => l.description),
        });

        setIsSubmitting(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success(
            status === "emitted" ? "Factura emitida" : "Borrador guardado"
        );
        router.push("/facturas");
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Columna principal */}
            <div className="space-y-6 lg:col-span-2">

                {/* Datos de la factura */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Datos del comprobante</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select
                                value={invoiceType}
                                onValueChange={(v) => setInvoiceType(v as "A" | "B" | "C")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {INVOICE_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vencimiento</Label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Cliente */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Cliente</h3>
                    <ClientSelector
                        clients={clients}
                        value={clientId}
                        onChange={setClientId}
                    />
                </div>

                {/* Líneas de productos */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Productos y servicios</h3>
                    <div className="space-y-3">
                        {lines.map((line) => (
                            <ProductLine
                                key={line.id}
                                line={line}
                                products={products}
                                onChange={updateLine}
                                onRemove={removeLine}
                            />
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addLine}
                        className="w-full"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar línea
                    </Button>
                </div>

                {/* Notas */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Notas</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Observaciones opcionales..."
                        rows={3}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                </div>
            </div>

            {/* Columna lateral */}
            <div className="space-y-4">
                <InvoiceTotals
                    subtotal={subtotal}
                    vatAmount={vatAmount}
                    total={total}
                />

                <div className="space-y-2">
                    <Button
                        className="w-full"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit("emitted")}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Emitir factura
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit("draft")}
                    >
                        Guardar borrador
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}