import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ARCA Invoices — Facturación Electrónica para Argentina",
    description:
        "Sistema de facturación electrónica profesional con integración oficial a ARCA. Emitir facturas nunca fue tan fácil.",
};

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}