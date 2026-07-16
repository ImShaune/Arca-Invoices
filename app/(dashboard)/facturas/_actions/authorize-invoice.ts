"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getToken, authorizeInvoice, INVOICE_TYPE_MAP, VAT_RATE_MAP } from "@/lib/arca";

export async function authorizeInvoiceAction(invoiceId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "No autenticado" };

        const { data: company } = await supabase
            .from("companies")
            .select("*")
            .eq("owner_id", user.id)
            .single();

        if (!company) return { error: "Empresa no encontrada" };

        const { data: invoice } = await supabase
            .from("invoices")
            .select(`*, invoice_items(*), clients(*)`)
            .eq("id", invoiceId)
            .eq("company_id", company.id)
            .single();

        if (!invoice) return { error: "Factura no encontrada" };

        const client = Array.isArray(invoice.clients)
            ? invoice.clients[0]
            : invoice.clients;

        const items = Array.isArray(invoice.invoice_items)
            ? invoice.invoice_items
            : [];

        const env = company.arca_environment as "homologacion" | "produccion";

        const { token, sign } = await getToken(env);

        const vatMap = new Map<number, { base: number; amount: number }>();
        for (const item of items) {
            const rate = item.vat_rate;
            const current = vatMap.get(rate) ?? { base: 0, amount: 0 };
            vatMap.set(rate, {
                base: current.base + item.subtotal,
                amount: current.amount + item.vat_amount,
            });
        }

        const vat = Array.from(vatMap.entries()).map(([rate, { base, amount }]) => ({
            id: VAT_RATE_MAP[rate] ?? 5,
            base,
            amount,
        }));

        const taxCondition = client?.tax_condition;

        const condicionIvaReceptor =
            taxCondition === "responsable_inscripto" ? 1 :
                taxCondition === "exento" ? 4 :
                    taxCondition === "monotributista" ? 6 :
                        5;

        const docType = taxCondition === "consumidor_final" ? 99 :
            client?.cuit ? 80 : 99;

        const docNumber = taxCondition === "consumidor_final" ? "0" :
            client?.cuit?.replace(/\D/g, "") ?? "0";

        const date = invoice.date.replace(/-/g, "");

        const result = await authorizeInvoice(env, token, sign, {
            cuit: company.cuit.replace(/\D/g, ""),
            pointOfSale: company.arca_point_of_sale ?? 1,
            invoiceType: INVOICE_TYPE_MAP[invoice.type] ?? 6,
            concept: 2,
            docType,
            docNumber,
            dateFrom: date,
            dateTo: date,
            total: invoice.total,
            noTaxable: 0,
            netTaxable: invoice.subtotal,
            vat,
            condicionIvaReceptor,
        });

        if (result.error) return { error: result.error };

        const { error } = await supabase
            .from("invoices")
            .update({
                cae: result.cae,
                cae_expiry: result.expiry
                    ? `${result.expiry.slice(0, 4)}-${result.expiry.slice(4, 6)}-${result.expiry.slice(6, 8)}`
                    : null,
                status: "emitted",
            })
            .eq("id", invoiceId);

        if (error) return { error: error.message };

        revalidatePath(`/facturas/${invoiceId}`);
        revalidatePath("/facturas");
        return { success: true, cae: result.cae };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        return { error: msg };
    }
}