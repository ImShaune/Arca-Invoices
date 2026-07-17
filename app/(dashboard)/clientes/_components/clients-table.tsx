"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCuit } from "@/lib/utils";
import { ClientDialog } from "./client-dialog";
import { DeleteDialog } from "./delete-dialog";
import type { Client } from "@/types";

const TAX_CONDITION_LABELS: Record<string, string> = {
    responsable_inscripto: "Resp. Inscripto",
    monotributista: "Monotributista",
    exento: "Exento",
    consumidor_final: "Cons. Final",
    no_categorizado: "No categorizado",
};

interface ClientsTableProps {
    clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
    const [editClient, setEditClient] = useState<Client | null>(null);
    const [deleteClient, setDeleteClient] = useState<Client | null>(null);

    return (
        <>
            <div className="rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">CUIT / DNI</th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Email</th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Condición</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client, index) => (
                                <motion.tr
                                    key={client.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium">{client.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {client.cuit
                                            ? formatCuit(client.cuit)
                                            : client.dni
                                                ? `DNI ${client.dni}`
                                                : "—"}
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                        {client.email ?? "—"}
                                    </td>
                                    <td className="hidden px-4 py-3 lg:table-cell">
                                        <Badge variant="secondary">
                                            {TAX_CONDITION_LABELS[client.tax_condition] ?? client.tax_condition}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditClient(client)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteClient(client)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientDialog
                open={!!editClient}
                onOpenChange={(open) => !open && setEditClient(null)}
                client={editClient ?? undefined}
            />
            <DeleteDialog
                open={!!deleteClient}
                onOpenChange={(open) => !open && setDeleteClient(null)}
                clientId={deleteClient?.id ?? ""}
                clientName={deleteClient?.name ?? ""}
            />
        </>
    );
}