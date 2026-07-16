const WSFE_URL_HOMO = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx";
const WSFE_URL_PROD = "https://servicios1.afip.gov.ar/wsfev1/service.asmx";

function getWsfeUrl(env: "homologacion" | "produccion") {
    return env === "produccion" ? WSFE_URL_PROD : WSFE_URL_HOMO;
}

function buildAuthHeader(token: string, sign: string, cuit: string) {
    return `<ar:Auth>
    <ar:Token>${token}</ar:Token>
    <ar:Sign>${sign}</ar:Sign>
    <ar:Cuit>${cuit}</ar:Cuit>
  </ar:Auth>`;
}

async function soapCall(
    url: string,
    action: string,
    body: string
): Promise<string> {
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Header/>
  <soapenv:Body>${body}</soapenv:Body>
</soapenv:Envelope>`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": `"http://ar.gov.afip.dif.FEV1/${action}"`,
        },
        body: envelope,
    });

    return response.text();
}

function extractValue(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
    return match?.[1]?.trim() ?? "";
}

export async function getLastInvoiceNumber(
    env: "homologacion" | "produccion",
    token: string,
    sign: string,
    cuit: string,
    pointOfSale: number,
    invoiceType: number
): Promise<number> {
    const url = getWsfeUrl(env);
    const body = `
    <ar:FECompUltimoAutorizado>
      ${buildAuthHeader(token, sign, cuit)}
      <ar:PtoVta>${pointOfSale}</ar:PtoVta>
      <ar:CbteTipo>${invoiceType}</ar:CbteTipo>
    </ar:FECompUltimoAutorizado>`;

    const xml = await soapCall(url, "FECompUltimoAutorizado", body);
    const cbteNr = extractValue(xml, "CbteNro");
    return parseInt(cbteNr) || 0;
}

export interface InvoiceToAuthorize {
    cuit: string;
    pointOfSale: number;
    invoiceType: number; // 1=A, 6=B, 11=C
    concept: number; // 1=Productos, 2=Servicios, 3=Ambos
    docType: number; // 80=CUIT, 96=DNI, 99=Consumidor Final
    docNumber: string;
    dateFrom: string; // YYYYMMDD
    dateTo: string;
    total: number;
    noTaxable: number;
    netTaxable: number;
    vat: Array<{ id: number; base: number; amount: number }>;
    condicionIvaReceptor?: number;
}

export async function authorizeInvoice(
    env: "homologacion" | "produccion",
    token: string,
    sign: string,
    invoice: InvoiceToAuthorize
): Promise<{ cae: string; expiry: string; error?: string }> {
    const url = getWsfeUrl(env);
    const lastNumber = await getLastInvoiceNumber(
        env, token, sign, invoice.cuit,
        invoice.pointOfSale, invoice.invoiceType
    );
    const number = lastNumber + 1;

    const vatXml = invoice.vat.map((v) => `
    <ar:AlicIva>
      <ar:Id>${v.id}</ar:Id>
      <ar:BaseImp>${v.base.toFixed(2)}</ar:BaseImp>
      <ar:Importe>${v.amount.toFixed(2)}</ar:Importe>
    </ar:AlicIva>`).join("");

    const body = `
    <ar:FECAESolicitar>
      ${buildAuthHeader(token, sign, invoice.cuit)}
      <ar:FeCAEReq>
        <ar:FeCabReq>
          <ar:CantReg>1</ar:CantReg>
          <ar:PtoVta>${invoice.pointOfSale}</ar:PtoVta>
          <ar:CbteTipo>${invoice.invoiceType}</ar:CbteTipo>
        </ar:FeCabReq>
        <ar:FeDetReq>
          <ar:FECAEDetRequest>
            <ar:Concepto>${invoice.concept}</ar:Concepto>
            <ar:DocTipo>${invoice.docType}</ar:DocTipo>
            <ar:DocNro>${invoice.docNumber}</ar:DocNro>
            <ar:CondicionIVAReceptorId>5</ar:CondicionIVAReceptorId>
            <ar:CbteDesde>${number}</ar:CbteDesde>
            <ar:CbteHasta>${number}</ar:CbteHasta>
            <ar:CbteFch>${invoice.dateFrom}</ar:CbteFch>
            <ar:ImpTotal>${invoice.total.toFixed(2)}</ar:ImpTotal>
            <ar:ImpTotConc>${invoice.noTaxable.toFixed(2)}</ar:ImpTotConc>
            <ar:ImpNeto>${invoice.netTaxable.toFixed(2)}</ar:ImpNeto>
            <ar:ImpOpEx>0.00</ar:ImpOpEx>
            <ar:ImpIVA>${(invoice.total - invoice.netTaxable - invoice.noTaxable).toFixed(2)}</ar:ImpIVA>
            <ar:ImpTrib>0.00</ar:ImpTrib>
            <ar:FchServDesde>${invoice.dateFrom}</ar:FchServDesde>
            <ar:FchServHasta>${invoice.dateTo}</ar:FchServHasta>
            <ar:FchVtoPago>${invoice.dateTo}</ar:FchVtoPago>
            <ar:MonId>PES</ar:MonId>
            <ar:MonCotiz>1</ar:MonCotiz>
            <ar:Iva>${vatXml}</ar:Iva>
          </ar:FECAEDetRequest>
        </ar:FeDetReq>
      </ar:FeCAEReq>
    </ar:FECAESolicitar>`;

    const xml = await soapCall(url, "FECAESolicitar", body);

    const cae = extractValue(xml, "CAE");
    const expiry = extractValue(xml, "CAEFchVto");
    const result = extractValue(xml, "Resultado");

    if (result !== "A" || !cae) {
        const obs = extractValue(xml, "Msg");
        return { cae: "", expiry: "", error: obs || "Error al obtener CAE" };
    }

    return { cae, expiry };
}