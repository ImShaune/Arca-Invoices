import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceStatusBadge } from "../_components/invoice-status-badge";
import { PDFDownloadButton } from "./_components/pdf-download-button";
import { formatCurrency, formatDate, formatCuit } from "@/lib/utils";
import type { Company, Client, Invoice, InvoiceItem } from "@/types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function FacturaDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/dashboard");

    const { data: invoice } = await supabase
        .from("invoices")
        .select(`*, invoice_items(*), clients(*)`)
        .eq("id", id)
        .eq("company_id", company.id)
        .single();

    if (!invoice) notFound();

    const client = Array.isArray(invoice.clients)
        ? invoice.clients[0]
        : invoice.clients;

    const items: InvoiceItem[] = Array.isArray(invoice.invoice_items)
        ? invoice.invoice_items
        : [];

    const invoiceWithItems = { ...invoice, items };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={`Factura ${invoice.type} ${String(invoice.number).padStart(8, "0")}`}
                description={formatDate(invoice.date)}
            >
                <div className="flex items-center gap-2">
                    <InvoiceStatusBadge status={invoice.status} />
                    <PDFDownloadButton
                        invoice={invoiceWithItems as Invoice & { items: InvoiceItem[] }}
                        client={client as Client}
                        company={company as Company}
                    />
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Detalle principal */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Cliente */}
                    <div className="rounded-xl border bg-card p-6 space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Cliente
                        </h3>
                        <p className="font-semibold text-lg">{client?.name}</p>
                        {client?.cuit && (
                            <p className="text-sm text-muted-foreground">
                                CUIT: {formatCuit(client.cuit)}
                            </p>
                        )}
                        {client?.email && (
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                        )}
                    </div>

                    {/* Items */}
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Productos y servicios
                            </h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Descripción</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cant.</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">IVA</th>
                                    <th className="px-6 py-3 text-right font-medium text-muted-foreground">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0">
                                        <td className="px-6 py-3">{item.description}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{item.vat_rate}%</td>
                                        <td className="px-6 py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Notas */}
                    {invoice.notes && (
                        <div className="rounded-xl border bg-card p-6 space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Notas
                            </h3>
                            <p className="text-sm">{invoice.notes}</p>
                        </div>
                    )}
                </div>

                {/* Totales */}
                <div className="space-y-4">
                    <div className="rounded-xl border bg-card p-6 space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Resumen
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">IVA</span>
                                <span>{formatCurrency(invoice.vat_amount)}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-semibold">
                                <span>Total</span>
                                <span className="text-lg">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* CAE */}
                    {invoice.cae && (
                        <div className="rounded-xl border bg-card p-6 space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                CAE
                            </h3>
                            <p className="text-sm font-mono">{invoice.cae}</p>
                            {invoice.cae_expiry && (
                                <p className="text-xs text-muted-foreground">
                                    Vence: {formatDate(invoice.cae_expiry)}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}