"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const clientSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100),
    cuit: z.string().nullable().optional(),
    dni: z.string().nullable().optional(),
    email: z.string().email("Email inválido").nullable().optional().or(z.literal("")),
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

export type ClientFormData = z.infer<typeof clientSchema>;

async function getCompanyId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!company) throw new Error("Empresa no encontrada");
    return { supabase, companyId: company.id };
}

export async function createClientAction(data: ClientFormData) {
    try {
        const validated = clientSchema.parse(data);
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase.from("clients").insert({
            ...validated,
            company_id: companyId,
            email: validated.email || null,
        });

        if (error) return { error: error.message };

        revalidatePath("/clientes");
        return { success: true };
    } catch (e) {
        return { error: "Error al crear el cliente" };
    }
}

export async function updateClientAction(id: string, data: ClientFormData) {
    try {
        const validated = clientSchema.parse(data);
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase
            .from("clients")
            .update({ ...validated, email: validated.email || null })
            .eq("id", id)
            .eq("company_id", companyId);

        if (error) return { error: error.message };

        revalidatePath("/clientes");
        return { success: true };
    } catch (e) {
        return { error: "Error al actualizar el cliente" };
    }
}

export async function deleteClientAction(id: string) {
    try {
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase
            .from("clients")
            .delete()
            .eq("id", id)
            .eq("company_id", companyId);

        if (error) return { error: error.message };

        revalidatePath("/clientes");
        return { success: true };
    } catch (e) {
        return { error: "Error al eliminar el cliente" };
    }
}