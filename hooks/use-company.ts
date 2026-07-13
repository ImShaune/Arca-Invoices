"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/types";

async function getCompany(): Promise<Company | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    return data;
}

export function useCompany() {
    const { data: company, isLoading, error } = useQuery({
        queryKey: ["company"],
        queryFn: getCompany,
        staleTime: 10 * 60 * 1000,
    });

    return { company, isLoading, error };
}