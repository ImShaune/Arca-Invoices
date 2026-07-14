import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { Invoice, Client, Company, InvoiceItem } from "@/types";
import { formatCurrency, formatDate, formatCuit } from "@/lib/utils";

interface GenerateInvoicePDFParams {
    invoice: Invoice & { items: InvoiceItem[] };
    client: Client;
    company: Company;
}

export async function generateInvoicePDF({
    invoice,
    client,
    company,
}: GenerateInvoicePDFParams): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    const margin = 50;
    const gray = rgb(0.5, 0.5, 0.5);
    const black = rgb(0, 0, 0);
    const white = rgb(1, 1, 1);
    const primary = rgb(0.07, 0.07, 0.07);

    // Header background
    page.drawRectangle({
        x: 0,
        y: height - 120,
        width,
        height: 120,
        color: primary,
    });

    // Título comprobante
    page.drawText(`FACTURA ${invoice.type}`, {
        x: margin,
        y: height - 50,
        size: 24,
        font: fontBold,
        color: white,
    });

    // Número
    page.drawText(
        `N° ${String(invoice.point_of_sale).padStart(4, "0")}-${String(invoice.number).padStart(8, "0")}`,
        {
            x: margin,
            y: height - 75,
            size: 11,
            font: fontRegular,
            color: rgb(0.7, 0.7, 0.7),
        }
    );

    // Fecha
    page.drawText(`Fecha: ${formatDate(invoice.date)}`, {
        x: margin,
        y: height - 95,
        size: 10,
        font: fontRegular,
        color: rgb(0.7, 0.7, 0.7),
    });

    // Empresa (derecha del header)
    page.drawText(company.name, {
        x: width - margin - fontBold.widthOfTextAtSize(company.name, 12),
        y: height - 50,
        size: 12,
        font: fontBold,
        color: white,
    });

    page.drawText(`CUIT: ${formatCuit(company.cuit)}`, {
        x: width - margin - fontRegular.widthOfTextAtSize(`CUIT: ${formatCuit(company.cuit)}`, 10),
        y: height - 68,
        size: 10,
        font: fontRegular,
        color: rgb(0.7, 0.7, 0.7),
    });

    // Datos del cliente
    let y = height - 150;

    page.drawText("FACTURAR A:", {
        x: margin, y, size: 9, font: fontBold, color: gray,
    });
    y -= 18;

    page.drawText(client.name, {
        x: margin, y, size: 12, font: fontBold, color: black,
    });
    y -= 16;

    if (client.cuit) {
        page.drawText(`CUIT: ${formatCuit(client.cuit)}`, {
            x: margin, y, size: 10, font: fontRegular, color: gray,
        });
        y -= 14;
    }

    if (client.address) {
        page.drawText(client.address, {
            x: margin, y, size: 10, font: fontRegular, color: gray,
        });
        y -= 14;
    }

    // Tabla de items
    y -= 20;

    // Header tabla
    page.drawRectangle({
        x: margin, y: y - 4, width: width - margin * 2, height: 22, color: rgb(0.95, 0.95, 0.95),
    });

    const col = {
        desc: margin + 4,
        qty: width - margin - 260,
        price: width - margin - 180,
        vat: width - margin - 100,
        total: width - margin - 40,
    };

    page.drawText("Descripción", { x: col.desc, y: y + 2, size: 9, font: fontBold, color: gray });
    page.drawText("Cant.", { x: col.qty, y: y + 2, size: 9, font: fontBold, color: gray });
    page.drawText("Precio", { x: col.price, y: y + 2, size: 9, font: fontBold, color: gray });
    page.drawText("IVA", { x: col.vat, y: y + 2, size: 9, font: fontBold, color: gray });
    page.drawText("Total", { x: col.total - fontBold.widthOfTextAtSize("Total", 9), y: y + 2, size: 9, font: fontBold, color: gray });

    y -= 20;

    // Filas
    for (const item of invoice.items) {
        const desc = item.description.slice(0, 45);
        page.drawText(desc, { x: col.desc, y, size: 9, font: fontRegular, color: black });
        page.drawText(String(item.quantity), { x: col.qty, y, size: 9, font: fontRegular, color: black });
        page.drawText(formatCurrency(item.unit_price), { x: col.price, y, size: 9, font: fontRegular, color: black });
        page.drawText(`${item.vat_rate}%`, { x: col.vat, y, size: 9, font: fontRegular, color: black });

        const totalStr = formatCurrency(item.total);
        page.drawText(totalStr, {
            x: col.total - fontRegular.widthOfTextAtSize(totalStr, 9),
            y, size: 9, font: fontRegular, color: black,
        });

        y -= 18;

        // Línea separadora
        page.drawLine({
            start: { x: margin, y: y + 4 },
            end: { x: width - margin, y: y + 4 },
            thickness: 0.5,
            color: rgb(0.9, 0.9, 0.9),
        });
    }

    // Totales
    y -= 20;
    const totalsX = width - margin - 200;

    const drawTotal = (label: string, value: string, bold = false) => {
        const font = bold ? fontBold : fontRegular;
        page.drawText(label, { x: totalsX, y, size: 10, font, color: bold ? black : gray });
        page.drawText(value, {
            x: width - margin - font.widthOfTextAtSize(value, 10),
            y, size: 10, font, color: bold ? black : gray,
        });
        y -= 18;
    };

    drawTotal("Subtotal:", formatCurrency(invoice.subtotal));
    drawTotal("IVA:", formatCurrency(invoice.vat_amount));

    // Línea antes del total
    page.drawLine({
        start: { x: totalsX, y: y + 12 },
        end: { x: width - margin, y: y + 12 },
        thickness: 1,
        color: black,
    });

    drawTotal("TOTAL:", formatCurrency(invoice.total), true);

    // CAE si existe
    if (invoice.cae) {
        y -= 20;
        page.drawText(`CAE: ${invoice.cae}`, {
            x: margin, y, size: 9, font: fontRegular, color: gray,
        });
        if (invoice.cae_expiry) {
            page.drawText(`Venc. CAE: ${formatDate(invoice.cae_expiry)}`, {
                x: margin, y: y - 14, size: 9, font: fontRegular, color: gray,
            });
        }
    }

    // Notas
    if (invoice.notes) {
        y -= 40;
        page.drawText("Notas:", { x: margin, y, size: 9, font: fontBold, color: gray });
        page.drawText(invoice.notes.slice(0, 100), {
            x: margin, y: y - 14, size: 9, font: fontRegular, color: gray,
        });
    }

    // Footer
    page.drawText("Documento generado por ARCA Invoices", {
        x: margin,
        y: 30,
        size: 8,
        font: fontRegular,
        color: rgb(0.7, 0.7, 0.7),
    });

    return pdfDoc.save();
}