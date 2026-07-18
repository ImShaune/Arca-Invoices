import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";

interface HeaderProps {
    title?: string;
}

export async function Header({ title }: HeaderProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: company } = user ? await supabase
        .from("companies")
        .select("name, logo_url")
        .eq("owner_id", user.id)
        .single() : { data: null };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6 lg:px-6 pl-16 lg:pl-6">
            <div>
                {title && <h1 className="text-lg font-semibold">{title}</h1>}
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                {user && (
                    <UserMenu
                        email={user.email ?? ""}
                        fullName={company?.name ?? null}
                        logoUrl={company?.logo_url ?? null}
                    />
                )}
            </div>
        </header>
    );
}