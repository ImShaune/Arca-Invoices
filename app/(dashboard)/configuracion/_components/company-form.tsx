"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
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
import { updateCompanyAction, type CompanyFormData } from "../_actions/settings";
import { LogoUpload } from "./logo-upload";

interface CompanyFormProps {
    company: CompanyFormData & { id: string; logo_url?: string | null };
    userId: string;
}

export function CompanyForm({ company, userId }: CompanyFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useForm<CompanyFormData>({
        defaultValues: {
            name: company.name,
            cuit: company.cuit,
            address: company.address ?? "",
            city: company.city ?? "",
            province: company.province ?? "",
            phone: company.phone ?? "",
            email: company.email ?? "",
            tax_condition: company.tax_condition,
            arca_point_of_sale: company.arca_point_of_sale ?? 1,
            arca_environment: company.arca_environment,
        },
    });

    async function onSubmit(data: CompanyFormData) {
        const result = await updateCompanyAction(data);
        if (result.error) {
            toast.error(result.error);
            return;
        }
        toast.success("Configuración guardada");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Logo */}
            <div className="rounded-xl border bg-card p-6">
                <LogoUpload
                    companyId={company.id}
                    currentLogo={company.logo_url ?? null}
                    userId={userId}
                />
            </div>

            {/* Datos de la empresa */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Datos de la empresa</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="name">Razón social *</Label>
                        <Input id="name" {...register("name")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cuit">CUIT *</Label>
                        <Input id="cuit" {...register("cuit")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Condición IVA</Label>
                        <Select
                            value={watch("tax_condition")}
                            onValueChange={(v) => setValue("tax_condition", v as CompanyFormData["tax_condition"])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="responsable_inscripto">Responsable Inscripto</SelectItem>
                                <SelectItem value="monotributista">Monotributista</SelectItem>
                                <SelectItem value="exento">Exento</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" {...register("phone")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" {...register("address")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input id="city" {...register("city")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="province">Provincia</Label>
                        <Input id="province" {...register("province")} />
                    </div>
                </div>
            </div>

            {/* Configuración ARCA */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Configuración ARCA</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="arca_point_of_sale">Punto de venta</Label>
                        <Input
                            id="arca_point_of_sale"
                            type="number"
                            min="1"
                            {...register("arca_point_of_sale")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Ambiente</Label>
                        <Select
                            value={watch("arca_environment")}
                            onValueChange={(v) => setValue("arca_environment", v as CompanyFormData["arca_environment"])}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="homologacion">Homologación (pruebas)</SelectItem>
                                <SelectItem value="produccion">Producción</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        : <Save className="mr-2 h-4 w-4" />
                    }
                    Guardar cambios
                </Button>
            </div>
        </form>
    );
}