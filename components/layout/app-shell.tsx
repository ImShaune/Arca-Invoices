import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
    children: React.ReactNode;
    title?: string;
    logoUrl?: string | null;
    companyName?: string;
}

export function AppShell({ children, title, logoUrl, companyName }: AppShellProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar logoUrl={logoUrl} companyName={companyName} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header title={title} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}