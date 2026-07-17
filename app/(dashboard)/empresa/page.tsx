import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { AnimateIn } from "@/components/shared/animate-in";
import { formatCuit } from "@/lib/utils";
import { Building2, Mail, Phone, MapPin, Receipt } from "lucide-react";

export default async function EmpresaPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    if (!company) redirect("/dashboard");

    const TAX_LABELS: Record<string, string> = {
        responsable_inscripto: "Responsable Inscripto",
        monotributista: "Monotributista",
        exento: "Exento",
    };

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <AnimateIn>
                <PageHeader
                    title="Mi empresa"
                    description="Información de tu empresa registrada."
                />
            </AnimateIn>

            <AnimateIn delay={0.1}>
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                            <Building2 className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{company.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                CUIT: {formatCuit(company.cuit)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {company.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm">{company.email}</p>
                                </div>
                            </div>
                        )}
                        {company.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Teléfono</p>
                                    <p className="text-sm">{company.phone}</p>
                                </div>
                            </div>
                        )}
                        {company.address && (
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Dirección</p>
                                    <p className="text-sm">
                                        {[company.address, company.city, company.province]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Condición IVA</p>
                                <p className="text-sm">
                                    {TAX_LABELS[company.tax_condition] ?? company.tax_condition}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimateIn>

            <AnimateIn delay={0.2}>
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Configuración ARCA</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Punto de venta</p>
                            <p className="font-medium">{company.arca_point_of_sale ?? 1}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Ambiente</p>
                            <p className="font-medium capitalize">
                                {company.arca_environment === "homologacion"
                                    ? "Homologación (pruebas)"
                                    : "Producción"}
                            </p>
                        </div>
                    </div>
                </div>
            </AnimateIn>
        </div>
    );
}