"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    FileText,
    Users,
    Package,
    DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
    stats: {
        revenueThisMonth: number;
        revenueVariation: number;
        countThisMonth: number;
        countVariation: number;
        totalClients: number;
        totalProducts: number;
    };
}

interface StatCard {
    title: string;
    value: string;
    variation?: number;
    icon: React.ElementType;
    description: string;
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards: StatCard[] = [
        {
            title: "Facturación del mes",
            value: formatCurrency(stats.revenueThisMonth),
            variation: stats.revenueVariation,
            icon: DollarSign,
            description: "vs. mes anterior",
        },
        {
            title: "Facturas emitidas",
            value: stats.countThisMonth.toString(),
            variation: stats.countVariation,
            icon: FileText,
            description: "este mes",
        },
        {
            title: "Clientes activos",
            value: stats.totalClients.toString(),
            icon: Users,
            description: "en total",
        },
        {
            title: "Productos activos",
            value: stats.totalProducts.toString(),
            icon: Package,
            description: "en catálogo",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="rounded-xl border bg-card p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <card.icon className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold">{card.value}</p>
                        <div className="mt-1 flex items-center gap-1">
                            {card.variation !== undefined && (
                                <>
                                    {card.variation >= 0 ? (
                                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-destructive" />
                                    )}
                                    <span
                                        className={`text-xs font-medium ${card.variation >= 0
                                            ? "text-emerald-500"
                                            : "text-destructive"
                                            }`}
                                    >
                                        {card.variation > 0 ? "+" : ""}
                                        {card.variation}%
                                    </span>
                                </>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {card.description}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}