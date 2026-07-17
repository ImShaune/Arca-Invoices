import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-card/50 py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo y descripción */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <FileText className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold">ARCA Invoices</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Sistema de facturación electrónica profesional para Argentina
                            con integración oficial a ARCA.
                        </p>
                    </div>

                    {/* Links producto */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Producto</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Funciones
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Cómo funciona
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Precios
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Links cuenta */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Cuenta</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Iniciar sesión
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Crear cuenta
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} ARCA Invoices. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Diseñado y desarrollado por:{" "}
                        <Link
                            href="https://wa.me/541131857294"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-primary font-medium"
                        >
                            Nahuel
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}