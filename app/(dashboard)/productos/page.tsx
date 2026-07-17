import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimateIn } from "@/components/shared/animate-in";
import { ProductsTable } from "./_components/products-table";
import { NewProductButton } from "./_components/new-product-button";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
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
        .from("products")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

    if (q) {
        query = query.or(`name.ilike.%${q}%,internal_code.ilike.%${q}%,category.ilike.%${q}%`);
    }

    const { data: products } = await query;

    return (
        <div className="flex flex-col gap-6">
            <AnimateIn>
                <PageHeader
                    title="Productos"
                    description="Administrá tu catálogo de productos y servicios."
                >
                    <NewProductButton />
                </PageHeader>
            </AnimateIn>

            <AnimateIn delay={0.1}>
                <form method="GET">
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por nombre, código o categoría..."
                        className="w-full max-w-sm rounded-lg border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </form>
            </AnimateIn>

            <AnimateIn delay={0.2}>
                {!products || products.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No hay productos"
                        description={
                            q
                                ? "No encontramos productos con esa búsqueda."
                                : "Todavía no cargaste ningún producto."
                        }
                    >
                        <NewProductButton />
                    </EmptyState>
                ) : (
                    <ProductsTable products={products} />
                )}
            </AnimateIn>
        </div>
    );
}