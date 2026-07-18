"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, FileText, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const router = useRouter();
    const supabase = createClient();
    const params = React.use(searchParams);
    const email = params.email ?? "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    function handleChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(""));
            inputs.current[5]?.focus();
        }
    }

    async function handleVerify() {
        const token = code.join("");
        if (token.length !== 6) {
            toast.error("Ingresá los 6 dígitos del código");
            return;
        }

        setIsVerifying(true);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "signup",
        });

        setIsVerifying(false);

        if (error) {
            toast.error("Código incorrecto o expirado");
            setCode(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
            return;
        }

        toast.success("¡Cuenta verificada!");
        router.push("/dashboard");
    }

    async function handleResend() {
        setIsResending(true);

        const { error } = await supabase.auth.resend({
            type: "signup",
            email,
        });

        setIsResending(false);

        if (error) {
            toast.error("Error al reenviar el código");
            return;
        }

        toast.success("Código reenviado a tu email");
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md px-4"
        >
            <div className="rounded-2xl border bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
                        <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Verificá tu cuenta
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Te enviamos un código de 6 dígitos a
                        </p>
                        {email && (
                            <p className="mt-1 text-sm font-medium">{email}</p>
                        )}
                    </div>
                </div>

                {/* Ícono de email */}
                <div className="flex justify-center mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                </div>

                {/* Inputs del código */}
                <div className="flex justify-center gap-2 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="h-14 w-12 rounded-xl border-2 bg-card text-center text-2xl font-bold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    ))}
                </div>

                {/* Botón verificar */}
                <Button
                    className="w-full"
                    onClick={handleVerify}
                    disabled={isVerifying || code.join("").length !== 6}
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verificando...
                        </>
                    ) : (
                        "Confirmar cuenta"
                    )}
                </Button>

                {/* Reenviar código */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿No recibiste el código?{" "}
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="font-medium text-primary hover:underline disabled:opacity-50"
                        >
                            {isResending ? "Reenviando..." : "Reenviar"}
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}