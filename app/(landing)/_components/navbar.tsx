"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "border-b bg-background/80 backdrop-blur-md shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <FileText className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg">ARCA Invoices</span>
                    </Link>

                    {/* Links desktop */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Funciones
                        </a>
                        <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Cómo funciona
                        </a>
                        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Precios
                        </a>
                    </nav>

                    {/* Acciones desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Iniciar sesión</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm">Empezar gratis</Button>
                        </Link>
                    </div>

                    {/* Menú mobile */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                        >
                            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Menú mobile abierto */}
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t py-4 space-y-4"
                    >
                        <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>Funciones</a>
                        <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
                        <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>Precios</a>
                        <div className="flex flex-col gap-2 pt-2">
                            <Link href="/login" onClick={() => setMenuOpen(false)}>
                                <Button variant="outline" className="w-full">Iniciar sesión</Button>
                            </Link>
                            <Link href="/register" onClick={() => setMenuOpen(false)}>
                                <Button className="w-full">Empezar gratis</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}   