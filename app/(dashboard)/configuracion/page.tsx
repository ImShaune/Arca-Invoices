import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { AnimateIn } from "@/components/shared/animate-in";
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
            <AnimateIn>
                <PageHeader
                    title="Configuración"
                    description="Administrá los datos de tu empresa."
                />
            </AnimateIn>
            <AnimateIn delay={0.1}>
                <CompanyForm company={company} userId={user.id} />
            </AnimateIn>
        </div>
    );
}