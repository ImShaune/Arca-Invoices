"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, FileText, Eye, EyeOff, Moon, Sun, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
    companyName: z.string().min(1, "El nombre de la empresa es requerido"),
    email: z.string().min(1, "El email es requerido").email("El email no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá la contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();
    const { theme, setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterFormData) {
        setAuthError(null);

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: { full_name: data.companyName },
            },
        });

        if (signUpError) {
            setAuthError(
                signUpError.message === "User already registered"
                    ? "Ya existe una cuenta con ese email"
                    : "Error al crear la cuenta. Intentá de nuevo."
            );
            return;
        }

        if (!authData.user) {
            setAuthError("Error al crear la cuenta");
            return;
        }

        const { error: companyError } = await supabase
            .from("companies")
            .insert({
                owner_id: authData.user.id,
                name: data.companyName,
                cuit: "00-00000000-0",
                tax_condition: "responsable_inscripto",
                arca_environment: "homologacion",
                arca_point_of_sale: 1,
            });

        if (companyError) {
            setAuthError("Error al crear la empresa. Contactá soporte.");
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md px-4"
        >
            {/* Barra superior */}
            <div className="flex justify-between items-center mb-4">
                <Link
                    href="/"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Link>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card/80 backdrop-blur-sm hover:bg-accent transition-colors"
                    aria-label="Cambiar tema"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </button>
            </div>

            {/* Card */}
            <div className="rounded-2xl border bg-card/80 p-8 shadow-2xl backdrop-blur-sm">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
                        <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Empezá a facturar electrónicamente
                        </p>
                    </div>
                </div>

                {/* Error */}
                {authError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        {authError}
                    </motion.div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nombre de la empresa</Label>
                        <Input
                            id="companyName"
                            placeholder="Mi Empresa S.A."
                            {...register("companyName")}
                            className={cn(errors.companyName && "border-destructive")}
                        />
                        {errors.companyName && (
                            <p className="text-xs text-destructive">{errors.companyName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            autoComplete="email"
                            {...register("email")}
                            className={cn(errors.email && "border-destructive")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className={cn("pr-10", errors.password && "border-destructive")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                                className={cn("pr-10", errors.confirmPassword && "border-destructive")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            "Crear cuenta"
                        )}
                    </Button>
                </form>

                {/* Links */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    ¿Ya tenés cuenta?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Iniciá sesión
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}