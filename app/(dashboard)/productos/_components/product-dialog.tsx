"use client";

import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { createProductAction, updateProductAction } from "../_actions/products";
import type { Product } from "@/types";
import type { ProductFormData } from "../_actions/products";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
}

export function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
    async function handleSubmit(data: ProductFormData) {
        const result = product
            ? await updateProductAction(product.id, data)
            : await createProductAction(data);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success(product ? "Producto actualizado" : "Producto creado");
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? "Editar producto" : "Nuevo producto"}
                    </DialogTitle>
                </DialogHeader>
                <ProductForm
                    product={product}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}