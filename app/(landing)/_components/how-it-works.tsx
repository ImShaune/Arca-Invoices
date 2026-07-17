"use client";

import { motion } from "framer-motion";
import { UserPlus, Building2, FileText, Download } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        step: "01",
        title: "Creá tu cuenta",
        description: "Registrate gratis en segundos. Sin tarjeta de crédito requerida.",
    },
    {
        icon: Building2,
        step: "02",
        title: "Configurá tu empresa",
        description: "Ingresá los datos de tu empresa y conectá tu certificado de ARCA.",
    },
    {
        icon: FileText,
        step: "03",
        title: "Emitir tu primera factura",
        description: "Seleccioná el cliente, agregá productos y emití el comprobante.",
    },
    {
        icon: Download,
        step: "04",
        title: "Descargá el PDF",
        description: "Obtené el comprobante con CAE en PDF listo para enviar.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24">
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
                        Cómo funciona
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight mb-4">
                        Empezá a facturar en minutos
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Seguí estos pasos simples y comenzá a emitir comprobantes
                        electrónicos hoy mismo.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Línea conectora */}
                    <div className="absolute top-16 left-0 right-0 h-px bg-border hidden lg:block" />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                {/* Ícono con número */}
                                <div className="relative mb-6">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border-2 border-primary/20 shadow-sm">
                                        <step.icon className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}