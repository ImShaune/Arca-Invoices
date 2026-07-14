"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export type LineItem = {
    id: string;
    product_id: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: number;
    subtotal: number;
    vat_amount: number;
    total: number;
};

interface ProductLineProps {
    line: LineItem;
    products: Product[];
    onChange: (id: string, line: Partial<LineItem>) => void;
    onRemove: (id: string) => void;
}

export function ProductLine({ line, products, onChange, onRemove }: ProductLineProps) {
    function handleProductChange(productId: string) {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const quantity = line.quantity;
        const unit_price = product.price;
        const vat_rate = product.vat_rate;
        const subtotal = quantity * unit_price;
        const vat_amount = subtotal * (vat_rate / 100);
        const total = subtotal + vat_amount;

        onChange(line.id, {
            product_id: product.id,
            description: product.name,
            unit_price,
            vat_rate,
            subtotal,
            vat_amount,
            total,
        });
    }

    function handleChange(field: keyof LineItem, value: string | number) {
        const updated = { ...line, [field]: value };

        if (field === "quantity" || field === "unit_price" || field === "vat_rate") {
            const quantity = field === "quantity" ? Number(value) : line.quantity;
            const unit_price = field === "unit_price" ? Number(value) : line.unit_price;
            const vat_rate = field === "vat_rate" ? Number(value) : line.vat_rate;
            const subtotal = quantity * unit_price;
            const vat_amount = subtotal * (vat_rate / 100);
            const total = subtotal + vat_amount;

            onChange(line.id, { ...updated, subtotal, vat_amount, total });
        } else {
            onChange(line.id, updated);
        }
    }

    return (
        <div className="grid grid-cols-12 gap-2 items-center rounded-lg border bg-card p-3">
            {/* Producto */}
            <div className="col-span-12 sm:col-span-4">
                <select
                    value={line.product_id ?? ""}
                    onChange={(e) => {
                        if (e.target.value) handleProductChange(e.target.value);
                    }}
                    className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                >
                    <option value="">Seleccionar producto...</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <Input
                    className="mt-1 text-xs"
                    placeholder="Descripción"
                    value={line.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />
            </div>

            {/* Cantidad */}
            <div className="col-span-3 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Cant.</label>
                <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={line.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    className="text-sm"
                />
            </div>

            {/* Precio unitario */}
            <div className="col-span-4 sm:col-span-2">
                <label className="text-xs text-muted-foreground">Precio</label>
                <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unit_price}
                    onChange={(e) => handleChange("unit_price", e.target.value)}
                    className="text-sm"
                />
            </div>

            {/* IVA */}
            <div className="col-span-3 sm:col-span-2">
                <label className="text-xs text-muted-foreground">IVA %</label>
                <select
                    value={line.vat_rate}
                    onChange={(e) => handleChange("vat_rate", e.target.value)}
                    className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                >
                    <option value={0}>0%</option>
                    <option value={10.5}>10.5%</option>
                    <option value={21}>21%</option>
                    <option value={27}>27%</option>
                </select>
            </div>

            {/* Total */}
            <div className="col-span-6 sm:col-span-1 text-right">
                <label className="text-xs text-muted-foreground">Total</label>
                <p className="text-sm font-medium">{formatCurrency(line.total)}</p>
            </div>

            {/* Eliminar */}
            <div className="col-span-6 sm:col-span-1 flex justify-end">
                <button
                    type="button"
                    onClick={() => onRemove(line.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}