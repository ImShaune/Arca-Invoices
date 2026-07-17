"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface LogoUploadProps {
    companyId: string;
    currentLogo: string | null;
    userId: string;
}

export function LogoUpload({ companyId, currentLogo, userId }: LogoUploadProps) {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentLogo);
    const supabase = createClient();

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Solo se permiten imágenes");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("La imagen no puede superar 10MB");
            return;
        }

        setLoading(true);

        try {
            const ext = file.name.split(".").pop();
            const path = `${userId}/${companyId}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("profile-photo")
                .upload(path, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("profile-photo")
                .getPublicUrl(path);

            const { error: updateError } = await supabase
                .from("companies")
                .update({ logo_url: publicUrl })
                .eq("id", companyId);

            if (updateError) throw updateError;

            setPreview(publicUrl);
            toast.success("Logo actualizado");
        } catch {
            toast.error("Error al subir el logo");
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove() {
        setLoading(true);
        try {
            await supabase
                .from("companies")
                .update({ logo_url: null })
                .eq("id", companyId);

            setPreview(null);
            toast.success("Logo eliminado");
        } catch {
            toast.error("Error al eliminar el logo");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl border bg-muted overflow-hidden shrink-0">
                {preview ? (
                    <img
                        src={preview}
                        alt="Logo de la empresa"
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">Logo de la empresa</p>
                <p className="text-xs text-muted-foreground">
                    PNG, JPG o SVG. Máximo 10MB.
                </p>
                <div className="flex gap-2">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={loading}
                        />
                        <span className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors cursor-pointer">
                            {loading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Upload className="h-4 w-4" />
                            }
                            {loading ? "Subiendo..." : "Subir logo"}
                        </span>
                    </label>
                    {preview && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            disabled={loading}
                            className="text-destructive hover:text-destructive"
                        >
                            Eliminar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}