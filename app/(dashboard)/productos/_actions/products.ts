"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(100),
    description: z.string().nullable().optional(),
    price: z.coerce.number().min(0, "El precio no puede ser negativo"),
    vat_rate: z.coerce.number().refine(
        (v) => [0, 10.5, 21, 27].includes(v),
        "IVA inválido"
    ),
    category: z.string().nullable().optional(),
    internal_code: z.string().nullable().optional(),
    stock: z.coerce.number().int().nullable().optional(),
    unit: z.string().min(1, "La unidad es requerida"),
    status: z.enum(["active", "inactive"]),
});

export type ProductFormData = z.infer<typeof productSchema>;

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

export async function createProductAction(data: ProductFormData) {
    try {
        const validated = productSchema.parse(data);
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase.from("products").insert({
            ...validated,
            company_id: companyId,
        });

        if (error) return { error: error.message };

        revalidatePath("/productos");
        return { success: true };
    } catch {
        return { error: "Error al crear el producto" };
    }
}

export async function updateProductAction(id: string, data: ProductFormData) {
    try {
        const validated = productSchema.parse(data);
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase
            .from("products")
            .update(validated)
            .eq("id", id)
            .eq("company_id", companyId);

        if (error) return { error: error.message };

        revalidatePath("/productos");
        return { success: true };
    } catch {
        return { error: "Error al actualizar el producto" };
    }
}

export async function deleteProductAction(id: string) {
    try {
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id)
            .eq("company_id", companyId);

        if (error) return { error: error.message };

        revalidatePath("/productos");
        return { success: true };
    } catch {
        return { error: "Error al eliminar el producto" };
    }
}