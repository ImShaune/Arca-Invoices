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
import { formatCurrency } from "@/lib/utils";
import { ProductDialog } from "./product-dialog";
import { DeleteDialog } from "./delete-dialog";
import type { Product } from "@/types";

interface ProductsTableProps {
    products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

    return (
        <>
            <div className="rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Código</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Precio</th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">IVA</th>
                                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Stock</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            {product.category && (
                                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                        {product.internal_code ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                                        {product.vat_rate}%
                                    </td>
                                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                                        {product.stock ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                            {product.status === "active" ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditProduct(product)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteProduct(product)}
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

            <ProductDialog
                open={!!editProduct}
                onOpenChange={(open) => !open && setEditProduct(null)}
                product={editProduct ?? undefined}
            />
            <DeleteDialog
                open={!!deleteProduct}
                onOpenChange={(open) => !open && setDeleteProduct(null)}
                productId={deleteProduct?.id ?? ""}
                productName={deleteProduct?.name ?? ""}
            />
        </>
    );
}