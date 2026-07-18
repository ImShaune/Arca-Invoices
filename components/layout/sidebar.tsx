"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { NAV_SECTIONS } from "@/constants/nav";
import { NavItem } from "./nav-item";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

interface SidebarProps {
    className?: string;
    logoUrl?: string | null;
    companyName?: string;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
    return (
        <div className="flex h-full flex-col">
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
                                    <div key={item.href} onClick={onClose}>
                                        <NavItem item={item} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="border-t p-3">
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs font-medium">Homologación activa</p>
                    <p className="text-xs text-muted-foreground">Modo prueba ARCA</p>
                </div>
            </div>
        </div>
    );
}

export function Sidebar({ className }: SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Sidebar desktop */}
            <aside
                className={cn(
                    "hidden lg:flex h-screen w-64 flex-col border-r bg-card",
                    className
                )}
            >
                <SidebarContent />
            </aside>

            {/* Sidebar mobile */}
            <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger className="fixed top-4 left-4 z-40 flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors">
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SidebarContent onClose={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}