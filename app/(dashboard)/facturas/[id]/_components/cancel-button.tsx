"use client";

import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateInvoiceStatusAction } from "../../_actions/invoices";

interface CancelButtonProps {
    invoiceId: string;
    status: string;
}

export function CancelButton({ invoiceId, status }: CancelButtonProps) {
    const [loading, setLoading] = useState(false);

    if (status !== "emitted") return null;

    async function handleCancel() {
        setLoading(true);
        const result = await updateInvoiceStatusAction(invoiceId, "cancelled");
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success("Factura anulada");
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center gap-2 rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                <XCircle className="h-4 w-4" />
                Anular
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Anular factura?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción marcará la factura como anulada. El CAE seguirá
                        registrado en ARCA. Esta operación no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleCancel}
                        disabled={loading}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Anular factura
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}