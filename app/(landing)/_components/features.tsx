"use client";

import { motion } from "framer-motion";
import {
    FileText,
    Users,
    Package,
    BarChart3,
    Shield,
    Download,
    Zap,
    Settings,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Facturación electrónica",
        description: "Emitir facturas A, B, C y M con CAE oficial de ARCA en segundos.",
    },
    {
        icon: Zap,
        title: "Integración oficial ARCA",
        description: "Conexión directa con los Web Services de ARCA. Sin intermediarios.",
    },
    {
        icon: Users,
        title: "Gestión de clientes",
        description: "Administrá tu cartera de clientes con datos fiscales completos.",
    },
    {
        icon: Package,
        title: "Catálogo de productos",
        description: "Gestioná productos y servicios con precios, IVA y stock.",
    },
    {
        icon: Download,
        title: "PDF profesional",
        description: "Generá comprobantes en PDF listos para enviar a tus clientes.",
    },
    {
        icon: BarChart3,
        title: "Reportes y estadísticas",
        description: "Visualizá tu facturación mensual y métricas de tu negocio.",
    },
    {
        icon: Shield,
        title: "Seguridad",
        description: "Datos protegidos con Row Level Security y autenticación segura.",
    },
    {
        icon: Settings,
        title: "Multi-empresa",
        description: "Configurá tu empresa, punto de venta y ambiente de ARCA.",
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-muted/30">
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
                        Funciones
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight mb-4">
                        Todo lo que necesitás para facturar
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Una plataforma completa para gestionar tu facturación electrónica
                        de principio a fin.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className="rounded-xl border bg-card p-6 space-y-3 hover:shadow-md transition-shadow"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <feature.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}