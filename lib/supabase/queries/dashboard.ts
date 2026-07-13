import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats(companyId: string) {
    const supabase = await createClient();

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0];
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0];

    const [
        { data: invoicesThisMonth },
        { data: invoicesLastMonth },
        { data: totalClients },
        { data: totalProducts },
        { data: recentInvoices },
        { data: monthlyData },
    ] = await Promise.all([
        // Facturas este mes
        supabase
            .from("invoices")
            .select("total, status")
            .eq("company_id", companyId)
            .gte("date", firstDayOfMonth)
            .neq("status", "cancelled"),

        // Facturas mes pasado
        supabase
            .from("invoices")
            .select("total, status")
            .eq("company_id", companyId)
            .gte("date", firstDayOfLastMonth)
            .lte("date", lastDayOfLastMonth)
            .neq("status", "cancelled"),

        // Total clientes activos
        supabase
            .from("clients")
            .select("id")
            .eq("company_id", companyId)
            .eq("is_active", true),

        supabase
            .from("products")
            .select("id")
            .eq("company_id", companyId)
            .eq("status", "active"),

        // Últimas 5 facturas
        supabase
            .from("invoices")
            .select(`
        id, number, type, total, status, date,
        clients (name)
      `)
            .eq("company_id", companyId)
            .order("created_at", { ascending: false })
            .limit(5),

        // Facturación de los últimos 6 meses
        supabase
            .from("invoices")
            .select("date, total")
            .eq("company_id", companyId)
            .neq("status", "cancelled")
            .gte(
                "date",
                new Date(now.getFullYear(), now.getMonth() - 5, 1)
                    .toISOString()
                    .split("T")[0]
            )
            .order("date", { ascending: true }),
    ]);

    // Calcular totales del mes actual
    const revenueThisMonth =
        invoicesThisMonth?.reduce((acc, inv) => acc + (inv.total ?? 0), 0) ?? 0;
    const countThisMonth = invoicesThisMonth?.length ?? 0;

    // Calcular totales del mes pasado
    const revenueLastMonth =
        invoicesLastMonth?.reduce((acc, inv) => acc + (inv.total ?? 0), 0) ?? 0;
    const countLastMonth = invoicesLastMonth?.length ?? 0;

    // Variación porcentual
    const revenueVariation =
        revenueLastMonth === 0
            ? 100
            : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100);

    const countVariation =
        countLastMonth === 0
            ? 100
            : Math.round(((countThisMonth - countLastMonth) / countLastMonth) * 100);

    // Agrupar facturación mensual para el gráfico
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const monthlyMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthlyMap.set(key, 0);
    }

    monthlyData?.forEach((inv) => {
        const d = new Date(inv.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (monthlyMap.has(key)) {
            monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + inv.total);
        }
    });

    const chartData = Array.from(monthlyMap.entries()).map(([key, total]) => {
        const [year, month] = key.split("-").map(Number);
        return {
            month: monthNames[month],
            total,
        };
    });

    return {
        revenueThisMonth,
        revenueVariation,
        countThisMonth,
        countVariation,
        totalClients: totalClients?.length ?? 0,
        totalProducts: totalProducts?.length ?? 0,
        recentInvoices: recentInvoices ?? [],
        chartData,
    };
}