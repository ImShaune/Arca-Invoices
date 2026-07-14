"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductFormData = {
    name: string;
    description: string;
    price: number;
    vat_rate: number;
    category: string;
    internal_code: string;
    stock: number | null;
    unit: string;
    status: "active" | "inactive";
};

const VAT_RATES = [
    { value: 0, label: "0% — Exento" },
    { value: 10.5, label: "10.5%" },
    { value: 21, label: "21% — General" },
    { value: 27, label: "27% — Servicios públicos" },
];

const UNITS = [
    "unidad", "kg", "g", "lt", "ml", "m", "cm", "m2", "m3", "hora", "servicio",
];

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: ProductFormData) => Promise<void>;
    onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        defaultValues: {
            name: product?.name ?? "",
            description: product?.description ?? "",
            price: product?.price ?? 0,
            vat_rate: product?.vat_rate ?? 21,
            category: product?.category ?? "",
            internal_code: product?.internal_code ?? "",
            stock: product?.stock ?? undefined,
            unit: product?.unit ?? "unidad",
            status: product?.status ?? "active",
        },
    });

    function validate(data: ProductFormData): boolean {
        return data.name.trim().length > 0 && data.price >= 0;
    }

    async function onFormSubmit(data: ProductFormData) {
        if (!validate(data)) return;
        await onSubmit({
            name: data.name,
            description: data.description || "",
            price: Number(data.price),
            vat_rate: Number(data.vat_rate),
            category: data.category || "",
            internal_code: data.internal_code || "",
            stock: data.stock != null && String(data.stock) !== "" ? Number(data.stock) : null,
            unit: data.unit,
            status: data.status,
        });
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="name">
                        Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder="Producto o servicio"
                        {...register("name", { required: true })}
                        className={cn(errors.name && "border-destructive")}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">El nombre es requerido</p>
                    )}
                </div>

                <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                        id="description"
                        placeholder="Descripción opcional"
                        {...register("description")}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">
                        Precio <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register("price", { required: true, min: 0 })}
                        className={cn(errors.price && "border-destructive")}
                    />
                    {errors.price && (
                        <p className="text-xs text-destructive">Precio inválido</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>IVA</Label>
                    <Select
                        value={String(watch("vat_rate"))}
                        onValueChange={(v) => setValue("vat_rate", Number(v))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccioná el IVA" />
                        </SelectTrigger>
                        <SelectContent>
                            {VAT_RATES.map((r) => (
                                <SelectItem key={r.value} value={String(r.value)}>
                                    {r.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="internal_code">Código interno</Label>
                    <Input
                        id="internal_code"
                        placeholder="SKU-001"
                        {...register("internal_code")}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                        id="category"
                        placeholder="Electrónica, Ropa..."
                        {...register("category")}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        min="0"
                        placeholder="Sin límite"
                        {...register("stock")}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Unidad</Label>
                    <Select
                        value={watch("unit")}
                        onValueChange={(v) => setValue("unit", v ?? "unidad")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Unidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {UNITS.map((u) => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                        value={watch("status")}
                        onValueChange={(v) => setValue("status", v as "active" | "inactive")}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {product ? "Guardar cambios" : "Crear producto"}
                </Button>
            </div>
        </form>
    );
}