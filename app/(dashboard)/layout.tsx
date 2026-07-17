import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("name, logo_url")
        .eq("owner_id", user.id)
        .single();

    return (
        <AppShell
            logoUrl={company?.logo_url ?? null}
            companyName={company?.name ?? "ARCA Invoices"}
        >
            {children}
        </AppShell>
    );
}