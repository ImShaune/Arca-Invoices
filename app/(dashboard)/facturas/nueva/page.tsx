import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceForm } from "./_components/invoice-form";

export default async function NuevaFacturaPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/dashboard");

    const [{ data: clients }, { data: products }] = await Promise.all([
        supabase
            .from("clients")
            .select("*")
            .eq("company_id", company.id)
            .eq("is_active", true)
            .order("name"),
        supabase
            .from("products")
            .select("*")
            .eq("company_id", company.id)
            .eq("status", "active")
            .order("name"),
    ]);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Nueva factura"
                description="Completá los datos para emitir el comprobante."
            />
            <InvoiceForm
                clients={clients ?? []}
                products={products ?? []}
            />
        </div>
    );
}