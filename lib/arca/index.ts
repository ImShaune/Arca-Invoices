import path from "path";
import { getAuthToken } from "./wsaa";
import { authorizeInvoice, type InvoiceToAuthorize } from "./wsfe";
import { getCachedToken, setCachedToken } from "./token-cache";

const CERT_PATH = path.join(process.cwd(), "certs", "certificate.crt");
const KEY_PATH = path.join(process.cwd(), "certs", "private.key");

export async function getToken(env: "homologacion" | "produccion") {
    const cached = getCachedToken(env);
    if (cached) return cached;

    const token = await getAuthToken(env, CERT_PATH, KEY_PATH);
    setCachedToken(env, token);
    return token;
}

// Mapa de tipo de factura a código ARCA
export const INVOICE_TYPE_MAP: Record<string, number> = {
    A: 1,
    B: 6,
    C: 11,
    M: 51,
};

// Mapa de alícuota IVA a ID ARCA
export const VAT_RATE_MAP: Record<number, number> = {
    0: 3,
    10.5: 4,
    21: 5,
    27: 6,
};

export { authorizeInvoice, type InvoiceToAuthorize };