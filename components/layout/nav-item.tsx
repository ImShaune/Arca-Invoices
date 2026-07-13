"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/constants/nav";

interface NavItemProps {
    item: NavItem;
    collapsed?: boolean;
}

export function NavItem({ item, collapsed = false }: NavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                collapsed && "justify-center px-2"
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.badge !== undefined && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}