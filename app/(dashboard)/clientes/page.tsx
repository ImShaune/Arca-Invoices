import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimateIn } from "@/components/shared/animate-in";
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

    const { q, page } = await searchParams;
    const currentPage = Number(page ?? 1);
    const pageSize = 10;
    const offset = (currentPage - 1) * pageSize;

    let query = supabase
        .from("clients")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

    if (q) {
        query = query.or(`name.ilike.%${q}%,cuit.ilike.%${q}%,dni.ilike.%${q}%`);
    }

    const { data: clients } = await query;

    return (
        <div className="flex flex-col gap-6">
            <AnimateIn>
                <PageHeader
                    title="Clientes"
                    description="Administrá tus clientes y sus datos fiscales."
                >
                    <NewClientButton />
                </PageHeader>
            </AnimateIn>

            <AnimateIn delay={0.1}>
                <form method="GET">
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por nombre, CUIT o DNI..."
                        className="w-full max-w-sm rounded-lg border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </form>
            </AnimateIn>

            <AnimateIn delay={0.2}>
                {!clients || clients.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No hay clientes"
                        description={q ? "No encontramos clientes con esa búsqueda." : "Todavía no cargaste ningún cliente."}
                    >
                        <NewClientButton />
                    </EmptyState>
                ) : (
                    <ClientsTable clients={clients} />
                )}
            </AnimateIn>
        </div>
    );
}