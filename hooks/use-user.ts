"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

async function getUser(): Promise<User | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export function useUser() {
    const { data: user, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
    };
}