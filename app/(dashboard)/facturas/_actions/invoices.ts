"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type InvoiceItemInput = {
    product_id?: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: number;
    subtotal: number;
    vat_amount: number;
    total: number;
};

export type InvoiceInput = {
    client_id: string;
    type: "A" | "B" | "C" | "M";
    point_of_sale: number;
    date: string;
    due_date?: string | null;
    subtotal: number;
    vat_amount: number;
    total: number;
    notes?: string | null;
    items: InvoiceItemInput[];
};

async function getCompanyId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data: company } = await supabase
        .from("companies")
        .select("id, arca_point_of_sale")
        .eq("owner_id", user.id)
        .single();

    if (!company) throw new Error("Empresa no encontrada");
    return { supabase, companyId: company.id, company };
}

async function getNextInvoiceNumber(
    supabase: Awaited<ReturnType<typeof createClient>>,
    companyId: string,
    type: string,
    pointOfSale: number
): Promise<number> {
    const { data } = await supabase
        .from("invoices")
        .select("number")
        .eq("company_id", companyId)
        .eq("type", type)
        .eq("point_of_sale", pointOfSale)
        .order("number", { ascending: false })
        .limit(1);

    return data && data.length > 0 ? data[0].number + 1 : 1;
}

export async function createInvoiceAction(input: InvoiceInput) {
    try {
        const { supabase, companyId, company } = await getCompanyId();

        const pointOfSale = input.point_of_sale ?? company.arca_point_of_sale ?? 1;
        const number = await getNextInvoiceNumber(supabase, companyId, input.type, pointOfSale);

        const { data: invoice, error } = await supabase
            .from("invoices")
            .insert({
                company_id: companyId,
                client_id: input.client_id,
                type: input.type,
                point_of_sale: pointOfSale,
                number,
                date: input.date,
                due_date: input.due_date ?? null,
                subtotal: input.subtotal,
                vat_amount: input.vat_amount,
                total: input.total,
                notes: input.notes ?? null,
                status: "draft",
            })
            .select()
            .single();

        if (error) return { error: error.message };

        // Insertar items
        const items = input.items.map((item) => ({
            invoice_id: invoice.id,
            product_id: item.product_id ?? null,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            vat_rate: item.vat_rate,
            subtotal: item.subtotal,
            vat_amount: item.vat_amount,
            total: item.total,
        }));

        const { error: itemsError } = await supabase
            .from("invoice_items")
            .insert(items);

        if (itemsError) return { error: itemsError.message };

        revalidatePath("/facturas");
        return { success: true, invoiceId: invoice.id };
    } catch (e) {
        return { error: "Error al crear la factura" };
    }
}

export async function updateInvoiceStatusAction(
    id: string,
    status: "draft" | "emitted" | "cancelled"
) {
    try {
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase
            .from("invoices")
            .update({ status })
            .eq("id", id)
            .eq("company_id", companyId);

        if (error) return { error: error.message };

        revalidatePath("/facturas");
        revalidatePath(`/facturas/${id}`);
        return { success: true };
    } catch {
        return { error: "Error al actualizar el estado" };
    }
}

export async function deleteInvoiceAction(id: string) {
    try {
        const { supabase, companyId } = await getCompanyId();

        const { error } = await supabase
            .from("invoices")
            .delete()
            .eq("id", id)
            .eq("company_id", companyId)
            .eq("status", "draft");

        if (error) return { error: error.message };

        revalidatePath("/facturas");
        return { success: true };
    } catch {
        return { error: "Error al eliminar la factura" };
    }
}