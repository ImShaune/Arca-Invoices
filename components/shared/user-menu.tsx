"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
    email: string;
    fullName?: string | null;
    logoUrl?: string | null;
}

export function UserMenu({ email, fullName, logoUrl }: UserMenuProps) {
    const router = useRouter();
    const supabase = createClient();

    const displayName = fullName || email;
    const initials = getInitials(displayName);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent outline-none transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary overflow-hidden text-xs font-semibold text-primary-foreground shrink-0">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-medium leading-none">{fullName || "Usuario"}</span>
                    <span className="text-xs text-muted-foreground">{email}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                    <p className="text-sm font-medium">{fullName || "Usuario"}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}