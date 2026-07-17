"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
    "Facturas ilimitadas",
    "Integración oficial con ARCA",
    "Comprobantes A, B, C y M",
    "Obtención de CAE automática",
    "Gestión de clientes y productos",
    "PDF profesional con CAE",
    "Exportación a Excel",
    "Reportes y estadísticas",
    "Configuración de empresa",
    "Múltiples puntos de venta",
    "Modo homologación y producción",
    "Soporte prioritario",
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-muted/30">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
                        Precios
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight mb-4">
                        Un plan. Todo incluido.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Sin límites, sin sorpresas. Todo lo que necesitás para facturar
                        electrónicamente en Argentina.
                    </p>
                </motion.div>

                {/* Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-lg mx-auto"
                >
                    <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10">
                        {/* Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                                <Zap className="h-3 w-3" />
                                Todo incluido
                            </span>
                        </div>

                        {/* Nombre y precio */}
                        <div className="text-center mb-8 mt-2">
                            <h3 className="text-2xl font-bold mb-2">Plan Professional</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-bold">$80</span>
                                <span className="text-muted-foreground">USD / mes</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Facturá sin límites desde el primer día
                            </p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                        <Check className="h-3 w-3 text-primary" />
                                    </div>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <Link href="/register" className="block">
                            <Button className="w-full" size="lg">
                                Empezar ahora
                            </Button>
                        </Link>

                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Cancelá cuando quieras. Sin permanencia.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}