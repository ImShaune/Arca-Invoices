import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientsTable } from "./_components/clients-table";
import { NewClientButton } from "./_components/new-client-button";
import { Users } from "lucide-react";

interface PageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function ClientesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/dashboard");

    const { q } = await searchParams;

    let query = supabase
        .from("clients")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

    if (q) {
        query = query.or(`name.ilike.%${q}%,cuit.ilike.%${q}%,dni.ilike.%${q}%`);
    }

    const { data: clients } = await query;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Clientes"
                description="Administrá tus clientes y sus datos fiscales."
            >
                <NewClientButton />
            </PageHeader>

            <form method="GET">
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="Buscar por nombre, CUIT o DNI..."
                    className="w-full max-w-sm rounded-lg border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
            </form>

            {!clients || clients.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No hay clientes"
                    description={
                        q
                            ? "No encontramos clientes con esa búsqueda."
                            : "Todavía no cargaste ningún cliente."
                    }
                >
                    <NewClientButton />
                </EmptyState>
            ) : (
                <ClientsTable clients={clients} />
            )}
        </div>
    );
}