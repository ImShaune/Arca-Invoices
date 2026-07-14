"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { Client } from "@/types";

const clientSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100),
    cuit: z.string().nullable().optional(),
    dni: z.string().nullable().optional(),
    email: z.string().email("Email inválido").or(z.literal("")).optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    tax_condition: z.enum([
        "responsable_inscripto",
        "monotributista",
        "exento",
        "consumidor_final",
        "no_categorizado",
    ]),
    notes: z.string().nullable().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

const TAX_CONDITIONS = [
    { value: "responsable_inscripto", label: "Responsable Inscripto" },
    { value: "monotributista", label: "Monotributista" },
    { value: "exento", label: "Exento" },
    { value: "consumidor_final", label: "Consumidor Final" },
    { value: "no_categorizado", label: "No categorizado" },
];

interface ClientFormProps {
    client?: Client;
    onSubmit: (data: ClientFormData) => Promise<void>;
    onCancel: () => void;
}

export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: client?.name ?? "",
            cuit: client?.cuit ?? "",
            dni: client?.dni ?? "",
            email: client?.email ?? "",
            phone: client?.phone ?? "",
            address: client?.address ?? "",
            city: client?.city ?? "",
            province: client?.province ?? "",
            tax_condition: client?.tax_condition ?? "consumidor_final",
            notes: client?.notes ?? "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Nombre */}
                <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="name">
                        Nombre / Razón social <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder="Empresa S.A."
                        {...register("name")}
                        className={cn(errors.name && "border-destructive")}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                </div>

                {/* Condición fiscal */}
                <div className="sm:col-span-2 space-y-2">
                    <Label>Condición fiscal</Label>
                    <Select
                        value={watch("tax_condition")}
                        onValueChange={(v) => setValue("tax_condition", v as ClientFormData["tax_condition"])}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccioná una condición" />
                        </SelectTrigger>
                        <SelectContent>
                            {TAX_CONDITIONS.map((tc) => (
                                <SelectItem key={tc.value} value={tc.value}>
                                    {tc.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* CUIT */}
                <div className="space-y-2">
                    <Label htmlFor="cuit">CUIT</Label>
                    <Input
                        id="cuit"
                        placeholder="20-12345678-9"
                        {...register("cuit")}
                    />
                </div>

                {/* DNI */}
                <div className="space-y-2">
                    <Label htmlFor="dni">DNI</Label>
                    <Input
                        id="dni"
                        placeholder="12345678"
                        {...register("dni")}
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="cliente@email.com"
                        {...register("email")}
                        className={cn(errors.email && "border-destructive")}
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                        id="phone"
                        placeholder="+54 11 1234-5678"
                        {...register("phone")}
                    />
                </div>

                {/* Dirección */}
                <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                        id="address"
                        placeholder="Av. Corrientes 1234"
                        {...register("address")}
                    />
                </div>

                {/* Ciudad */}
                <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                        id="city"
                        placeholder="Buenos Aires"
                        {...register("city")}
                    />
                </div>

                {/* Provincia */}
                <div className="space-y-2">
                    <Label htmlFor="province">Provincia</Label>
                    <Input
                        id="province"
                        placeholder="CABA"
                        {...register("province")}
                    />
                </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {client ? "Guardar cambios" : "Crear cliente"}
                </Button>
            </div>
        </form>
    );
}