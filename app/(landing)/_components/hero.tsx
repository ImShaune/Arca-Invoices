"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Fondo con gradientes */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-sm backdrop-blur-sm mb-8"
                >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-muted-foreground">Integración oficial con ARCA</span>
                </motion.div>

                {/* Título */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                >
                    Facturación electrónica{" "}
                    <span className="text-primary">sin complicaciones</span>
                </motion.h1>

                {/* Descripción */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                    Emitir facturas, obtener CAE y gestionar tu negocio nunca fue tan simple.
                    Integración oficial con ARCA para Pymes argentinas.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link href="/register">
                        <Button size="lg" className="gap-2 px-8">
                            Empezar gratis
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="px-8">
                            Iniciar sesión
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16"
                >
                    {[
                        { icon: Zap, label: "CAE en segundos", value: "< 3 seg" },
                        { icon: Shield, label: "Integración oficial", value: "ARCA" },
                        { icon: FileText, label: "Tipos de comprobante", value: "A, B, C, M" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Preview del dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="rounded-2xl border bg-card/50 backdrop-blur-sm p-2 shadow-2xl max-w-4xl mx-auto"
                >
                    <div className="rounded-xl bg-card overflow-hidden">
                        {/* Barra de título fake */}
                        <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/30">
                            <div className="h-3 w-3 rounded-full bg-red-500/70" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                            <div className="h-3 w-3 rounded-full bg-green-500/70" />
                            <div className="flex-1 mx-4 h-6 rounded-md bg-muted/50 flex items-center px-3">
                                <span className="text-xs text-muted-foreground">app.arcainvoices.com/dashboard</span>
                            </div>
                        </div>
                        {/* Contenido fake del dashboard */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {["Facturación del mes", "Facturas emitidas", "Clientes activos", "Productos"].map((label, i) => (
                                    <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <div className="h-6 w-20 rounded bg-muted animate-pulse" />
                                        <div className="h-3 w-12 rounded bg-muted/50 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="col-span-2 rounded-lg border bg-card p-4 h-32 flex items-end gap-1 pb-2">
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-sm bg-primary/30"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="rounded-lg border bg-card p-4 space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-full rounded bg-muted animate-pulse" />
                                                <div className="h-2 w-2/3 rounded bg-muted/50 animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}