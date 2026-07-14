"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteClientAction } from "../_actions/clients";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    clientName: string;
}

export function DeleteDialog({
    open,
    onOpenChange,
    clientId,
    clientName,
}: DeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteClientAction(clientId);

        if (result.error) {
            toast.error(result.error);
            setIsDeleting(false);
            return;
        }

        toast.success("Cliente eliminado");
        onOpenChange(false);
        setIsDeleting(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Estás por eliminar a <strong>{clientName}</strong>. Esta acción
                        no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}