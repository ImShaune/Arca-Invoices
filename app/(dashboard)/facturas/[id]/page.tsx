import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { InvoiceStatusBadge } from "../_components/invoice-status-badge";
import { PDFDownloadButton } from "./_components/pdf-download-button";
import { AuthorizeButton } from "./_components/authorize-button";
import { formatCurrency, formatDate, formatCuit } from "@/lib/utils";
import type { Company, Client, Invoice, InvoiceItem } from "@/types";
import { CancelButton } from "./_components/cancel-button";

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
                    <AuthorizeButton invoiceId={invoice.id} status={invoice.status} />
                    <CancelButton invoiceId={invoice.id} status={invoice.status} />
                    <PDFDownloadButton
                        invoice={invoiceWithItems as Invoice & { items: InvoiceItem[] }}
                        client={client as Client}
                        company={company as Company}
                    />
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">



                    {/* Datos del comprobante */}
                    <div className="rounded-xl border bg-card p-6 space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Comprobante
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Tipo</p>
                                <p className="font-medium">Factura {invoice.type}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Número</p>
                                <p className="font-medium">
                                    {String(invoice.point_of_sale).padStart(4, "0")}-{String(invoice.number).padStart(8, "0")}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Fecha</p>
                                <p className="font-medium">{formatDate(invoice.date)}</p>
                            </div>
                            {invoice.due_date && (
                                <div>
                                    <p className="text-muted-foreground">Vencimiento</p>
                                    <p className="font-medium">{formatDate(invoice.due_date)}</p>
                                </div>
                            )}
                        </div>
                    </div>


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
                        {client?.address && (
                            <p className="text-sm text-muted-foreground">{client.address}</p>
                        )}
                    </div>

                    {/* Items */}
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Productos y servicios
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[600px]">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                                            Cant.
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                                            Precio unit.
                                        </th>
                                        <th className="px-6 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                                            IVA
                                        </th>
                                        <th className="px-6 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                                            Total
                                        </th>
                                        <th className="pl-8 pr-6 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="px-6 py-3">{item.description}</td>
                                            <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                                                {formatCurrency(item.unit_price)}
                                            </td>
                                            <td className="px-6 py-3 text-right text-muted-foreground whitespace-nowrap">
                                                {`${item.vat_rate}%  —  ${formatCurrency(item.vat_amount)}`}
                                            </td>
                                            <td className="px-6 py-3 text-right text-muted-foreground whitespace-nowrap">
                                                {item.vat_rate}% &nbsp;&nbsp; {formatCurrency(item.vat_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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

                {/* Columna lateral */}
                <div className="space-y-4">

                    {/* Totales */}
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
                        <div className="rounded-xl border bg-card p-6 space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                CAE
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Comprobante autorizado por ARCA
                            </p>
                            <p className="text-sm font-mono font-semibold">{invoice.cae}</p>
                            {invoice.cae_expiry && (
                                <p className="text-xs text-muted-foreground">
                                    Vence: {formatDate(invoice.cae_expiry)}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Empresa emisora */}
                    <div className="rounded-xl border bg-card p-6 space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Emisor
                        </h3>
                        <p className="text-sm font-semibold">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                            CUIT: {formatCuit(company.cuit)}
                        </p>
                        {company.address && (
                            <p className="text-xs text-muted-foreground">{company.address}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}