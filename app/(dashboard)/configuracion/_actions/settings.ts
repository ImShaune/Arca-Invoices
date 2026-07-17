"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const companySchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    cuit: z.string().min(1, "El CUIT es requerido"),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    tax_condition: z.enum(["responsable_inscripto", "monotributista", "exento"]),
    arca_point_of_sale: z.coerce.number().int().min(1),
    arca_environment: z.enum(["homologacion", "produccion"]),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export async function updateCompanyAction(data: CompanyFormData) {
    try {
        const validated = companySchema.parse(data);
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "No autenticado" };

        const { error } = await supabase
            .from("companies")
            .update({
                ...validated,
                email: validated.email || null,
            })
            .eq("owner_id", user.id);

        if (error) return { error: error.message };

        revalidatePath("/configuracion");
        return { success: true };
    } catch {
        return { error: "Error al guardar la configuración" };
    }
}