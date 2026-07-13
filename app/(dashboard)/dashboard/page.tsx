import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/supabase/queries/dashboard";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "./_components/stats-cards";
import { RevenueChart } from "./_components/revenue-chart";
import { RecentInvoices } from "./_components/recent-invoices";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/onboarding");

    const stats = await getDashboardStats(company.id);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Dashboard"
                description={`Bienvenido, ${user.email}`}
            />
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueChart data={stats.chartData} />
                </div>
                <div>
                    <RecentInvoices invoices={stats.recentInvoices} />
                </div>
            </div>
        </div>
    );
}