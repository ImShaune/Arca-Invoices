"use client";

import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "./client-form";
import { createClientAction, updateClientAction } from "../_actions/clients";
import type { Client } from "@/types";
import type { ClientFormData } from "../_actions/clients";

interface ClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    client?: Client;
}

export function ClientDialog({ open, onOpenChange, client }: ClientDialogProps) {
    async function handleSubmit(data: ClientFormData) {
        const result = client
            ? await updateClientAction(client.id, data)
            : await createClientAction(data);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success(client ? "Cliente actualizado" : "Cliente creado");
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {client ? "Editar cliente" : "Nuevo cliente"}
                    </DialogTitle>
                </DialogHeader>
                <ClientForm
                    client={client}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}