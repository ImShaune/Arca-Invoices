import { Badge } from "@/components/ui/badge";

const config = {
    draft: { label: "Borrador", variant: "secondary" },
    emitted: { label: "Emitida", variant: "default" },
    cancelled: { label: "Anulada", variant: "destructive" },
    overdue: { label: "Vencida", variant: "destructive" },
} as const;

export function InvoiceStatusBadge({ status }: { status: string }) {
    const s = config[status as keyof typeof config] ?? { label: status, variant: "secondary" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
}