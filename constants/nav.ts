import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    Settings,
    Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
    {
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Gestión",
        items: [
            {
                label: "Clientes",
                href: "/clientes",
                icon: Users,
            },
            {
                label: "Productos",
                href: "/productos",
                icon: Package,
            },
            {
                label: "Facturas",
                href: "/facturas",
                icon: FileText,
            },
        ],
    },
    {
        title: "Empresa",
        items: [
            {
                label: "Mi empresa",
                href: "/empresa",
                icon: Building2,
            },
            {
                label: "Configuración",
                href: "/configuracion",
                icon: Settings,
            },
        ],
    },
];