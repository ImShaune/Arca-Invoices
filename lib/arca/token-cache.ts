interface CachedToken {
    token: string;
    sign: string;
    expiry: string;
}

const cache = new Map<string, CachedToken>();

export function getCachedToken(env: string): CachedToken | null {
    const cached = cache.get(env);
    if (!cached) return null;

    const expiry = new Date(cached.expiry);
    const now = new Date();

    // Si vence en menos de 10 minutos, refrescamos
    if (expiry.getTime() - now.getTime() < 10 * 60 * 1000) {
        cache.delete(env);
        return null;
    }

    return cached;
}

export function setCachedToken(env: string, token: CachedToken) {
    cache.set(env, token);
}