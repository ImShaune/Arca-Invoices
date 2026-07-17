import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { CompanyForm } from "./_components/company-form";

export default async function ConfiguracionPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/dashboard");

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <PageHeader
                title="Configuración"
                description="Administrá los datos de tu empresa."
            />
            <CompanyForm company={company} />
        </div>
    );
}