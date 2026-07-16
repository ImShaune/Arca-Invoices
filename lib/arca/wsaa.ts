import forge from "node-forge";
import fs from "fs";
import path from "path";

const WSAA_URL_HOMO = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl";
const WSAA_URL_PROD = "https://wsaa.afip.gov.ar/ws/services/LoginCms?wsdl";
const SERVICE = "wsfe";

function getWsaaUrl(env: "homologacion" | "produccion") {
    return env === "produccion" ? WSAA_URL_PROD : WSAA_URL_HOMO;
}

function createLoginTicketRequest(): string {
    const now = new Date();
    const past = new Date(now.getTime() - 10 * 60 * 1000); // 10 min atrás
    const expires = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    const toARDate = (d: Date) => {
        const offset = -3 * 60;
        const local = new Date(d.getTime() + offset * 60 * 1000);
        return local.toISOString().replace("Z", "-03:00");
    };

    return `<?xml version="1.0" encoding="UTF-8"?>
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>${Math.floor(Math.random() * 4294967295)}</uniqueId>
    <generationTime>${toARDate(past)}</generationTime>
    <expirationTime>${toARDate(expires)}</expirationTime>
  </header>
  <service>${SERVICE}</service>
</loginTicketRequest>`;
}

function signLoginTicketRequest(tra: string, certPath: string, keyPath: string): string {
    const cert = forge.pki.certificateFromPem(fs.readFileSync(certPath, "utf8"));
    const key = forge.pki.privateKeyFromPem(fs.readFileSync(keyPath, "utf8"));
    const p7 = forge.pkcs7.createSignedData();

    p7.content = forge.util.createBuffer(tra, "utf8");
    p7.addCertificate(cert);
    p7.addSigner({
        key,
        certificate: cert,
        digestAlgorithm: forge.pki.oids.sha256,
        authenticatedAttributes: [
            { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
            { type: forge.pki.oids.messageDigest },
            { type: forge.pki.oids.signingTime, value: new Date().toISOString() },
        ],
    });

    p7.sign();
    return forge.util.encode64(
        forge.asn1.toDer(p7.toAsn1()).getBytes()
    );
}

async function callWsaa(cms: string, env: "homologacion" | "produccion"): Promise<string> {
    const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov.ar">
  <soapenv:Header/>
  <soapenv:Body>
    <wsaa:loginCms>
      <wsaa:in0>${cms}</wsaa:in0>
    </wsaa:loginCms>
  </soapenv:Body>
</soapenv:Envelope>`;

    const url = getWsaaUrl(env).replace("?wsdl", "");
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": '""',
        },
        body: soapBody,
    });

    const text = await response.text();

    // Extraer el contenido de loginCmsReturn y decodificar HTML entities
    const returnMatch = text.match(/<loginCmsReturn>([\s\S]*?)<\/loginCmsReturn>/);
    if (!returnMatch) throw new Error(`Error WSAA: ${text}`);

    const decoded = returnMatch[1]
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

    const tokenMatch = decoded.match(/<token>([\s\S]*?)<\/token>/);
    const signMatch = decoded.match(/<sign>([\s\S]*?)<\/sign>/);
    const expiryMatch = decoded.match(/<expirationTime>([\s\S]*?)<\/expirationTime>/);

    if (!tokenMatch || !signMatch) {
        throw new Error(`No se pudo extraer token: ${decoded}`);
    }

    return JSON.stringify({
        token: tokenMatch[1].trim(),
        sign: signMatch[1].trim(),
        expiry: expiryMatch?.[1]?.trim() ?? "",
    });
}

export async function getAuthToken(
    env: "homologacion" | "produccion",
    certPath: string,
    keyPath: string
): Promise<{ token: string; sign: string; expiry: string }> {
    const tra = createLoginTicketRequest();
    const cms = signLoginTicketRequest(tra, certPath, keyPath);
    const result = await callWsaa(cms, env);
    return JSON.parse(result);
}