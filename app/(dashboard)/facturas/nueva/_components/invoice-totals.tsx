import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface InvoiceTotalsProps {
    subtotal: number;
    vatAmount: number;
    total: number;
}

export function InvoiceTotals({ subtotal, vatAmount, total }: InvoiceTotalsProps) {
    return (
        <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA</span>
                <span>{formatCurrency(vatAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatCurrency(total)}</span>
            </div>
        </div>
    );
}