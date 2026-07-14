"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn, formatCuit } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types";

interface ClientSelectorProps {
    clients: Client[];
    value: string;
    onChange: (clientId: string) => void;
}

export function ClientSelector({ clients, value, onChange }: ClientSelectorProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selected = clients.find((c) => c.id === value);
    const filtered = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.cuit && c.cuit.includes(search))
    );

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm",
                    "hover:bg-accent transition-colors",
                    !selected && "text-muted-foreground"
                )}
            >
                <span>{selected ? selected.name : "Seleccioná un cliente"}</span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border bg-card shadow-lg">
                    <div className="flex items-center border-b px-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar cliente..."
                            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-muted-foreground">
                                No encontramos clientes.
                            </p>
                        ) : (
                            filtered.map((client) => (
                                <button
                                    key={client.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(client.id);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                                >
                                    <Check
                                        className={cn(
                                            "h-4 w-4 shrink-0",
                                            value === client.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="text-left">
                                        <p className="font-medium">{client.name}</p>
                                        {client.cuit && (
                                            <p className="text-xs text-muted-foreground">
                                                {formatCuit(client.cuit)}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}