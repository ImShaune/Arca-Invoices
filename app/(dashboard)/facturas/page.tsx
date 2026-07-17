import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { NewInvoiceButton } from "./_components/new-invoice-button";
import { InvoicesTable } from "./_components/invoices-table";
import { ExportButton } from "./_components/export-button";

export default async function FacturasPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/dashboard");

    const { data: invoices } = await supabase
        .from("invoices")
        .select(`*, clients(name)`)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Facturas"
                description="Historial de comprobantes emitidos."
            >
                <ExportButton invoices={invoices ?? []} />
                <NewInvoiceButton />
            </PageHeader>

            {!invoices || invoices.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="No hay facturas"
                    description="Todavía no emitiste ningún comprobante."
                >
                    <NewInvoiceButton />
                </EmptyState>
            ) : (
                <InvoicesTable invoices={invoices} />
            )}
        </div>
    );
}