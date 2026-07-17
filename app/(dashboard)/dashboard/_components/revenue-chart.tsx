"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
    data: { month: string; total: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    // Determinar tendencia comparando primer y último valor
    const first = data[0]?.total ?? 0;
    const last = data[data.length - 1]?.total ?? 0;
    const isUp = last >= first;

    const color = isUp ? "#22c55e" : "#ef4444"; // verde o rojo
    const colorStop = isUp ? "#22c55e20" : "#ef444420";
    const gradientId = isUp ? "colorUp" : "colorDown";

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Facturación mensual</h3>
                    <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
                </div>
                <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                        backgroundColor: isUp ? "#22c55e20" : "#ef444420",
                        color: color,
                    }}
                >
                    {isUp ? "↑ Ascendente" : "↓ Descendente"}
                </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#888888" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#888888" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "hsl(var(--foreground))",
                        }}
                        formatter={(value) => [formatCurrency(value as number), "Total"]}
                        labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#${gradientId})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}