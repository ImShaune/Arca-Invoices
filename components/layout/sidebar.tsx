"use client";

import { NAV_SECTIONS } from "@/constants/nav";
import { NavItem } from "./nav-item";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
    logoUrl?: string | null;
    companyName?: string;
}

export function Sidebar({ className, logoUrl, companyName }: SidebarProps) {
    return (
        <aside
            className={cn(
                "flex h-screen w-64 flex-col border-r bg-card",
                className
            )}
        >
            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-6">
                    {NAV_SECTIONS.map((section, index) => (
                        <div key={index}>
                            {section.title && (
                                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavItem key={item.href} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer del sidebar */}
            <div className="border-t p-3">
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs font-medium">Homologación activa</p>
                    <p className="text-xs text-muted-foreground">Modo prueba ARCA</p>
                </div>
            </div>
        </aside>
    );
}