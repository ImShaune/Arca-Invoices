"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authorizeInvoiceAction } from "../../_actions/authorize-invoice";

interface AuthorizeButtonProps {
    invoiceId: string;
    status: string;
}

export function AuthorizeButton({ invoiceId, status }: AuthorizeButtonProps) {
    const [loading, setLoading] = useState(false);

    if (status !== "draft") return null;

    async function handleAuthorize() {
        setLoading(true);
        const result = await authorizeInvoiceAction(invoiceId);
        setLoading(false);

        if (result.error) {
            toast.error(`Error ARCA: ${result.error}`);
            return;
        }

        toast.success(`CAE obtenido: ${result.cae}`);
    }

    return (
        <Button onClick={handleAuthorize} disabled={loading}>
            {loading
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Zap className="mr-2 h-4 w-4" />
            }
            Solicitar CAE
        </Button>
    );
}