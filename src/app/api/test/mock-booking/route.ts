import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isMockBookingEnabled, mockBookingSchema } from "@/lib/test/mock-booking";
import { renderContractEmail } from "@/lib/email/contract-email";
import type { ContractConsultant } from "@/lib/contracts/consultant-assignment";

const SIGNWELL_API = "https://www.signwell.com/api/v1/documents";
const RESEND_API = "https://api.resend.com/emails";

export type ContractSignatureField = {
  type: "signature" | "date";
  api_id: "client_signature" | "signed_date";
  required: true;
  recipient_id: "1";
  page: 1;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ContractPdf = {
  pdf: Buffer;
  signatureFields: ContractSignatureField[];
};

/**
 * Wrap contract text only at whitespace. In particular, an email address is
 * one token, so it is never split at `@`, a dot, or any other character.
 * A single token that is wider than the available space is returned on its
 * own line; the renderer will reduce that line's font size if needed.
 */
export function wrapContractText(
  text: string,
  maxWidth: number,
  measure: (value: string) => number,
): string[] {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const token of tokens) {
    const candidate = line ? `${line} ${token}` : token;
    if (line && measure(candidate) > maxWidth) {
      lines.push(line);
      line = token;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

async function loadBrandAsset(assetOrigin: string, assetPath: string): Promise<Buffer> {
  const response = await fetch(new URL(assetPath, assetOrigin));
  if (!response.ok) throw new Error(`Unable to load contract asset: ${assetPath}`);
  return Buffer.from(await response.arrayBuffer());
}

function missingConfiguration() {
  return !process.env.SIGNWELL_API_KEY || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL;
}

export async function createContractPdf(input: { name: string; email: string; addressAndPhone: string; preparationNotes: string; fee?: string }, consultant: ContractConsultant, language: string, assetOrigin: string, options: { testMode?: boolean } = {}): Promise<ContractPdf> {
  const french = "La consultation a pour objet d’examiner la situation du client en matière d’immigration ou de citoyenneté et de fournir des conseils sur les options disponibles, l’admissibilité, les risques et/ou les prochaines étapes. Elle ne comprend pas la préparation, le dépôt ou la représentation dans le cadre d’une demande ou d’une procédure. La consultante est autorisée et réglementée par le College of Immigration and Citizenship Consultants (CICC), l’organisme chargé de surveiller les consultants autorisés en immigration et citoyenneté au Canada. En signant, le client accepte l’objet, la portée et les honoraires de cette consultation.";
  const english = "The purpose of this consultation is to review the client’s immigration or citizenship situation and provide advice regarding available options, eligibility, risks and/or next steps. The consultation does not include preparation, submission or representation in an application or proceeding. The consultant is licensed and regulated by the College of Immigration and Citizenship Consultants (CICC), the regulatory body responsible for overseeing licensed immigration and citizenship consultants in Canada. By signing, the client agrees to the purpose, scope and fee of this consultation.";
  const spanish = "La consulta tiene como objetivo analizar la situación migratoria o de ciudadanía del cliente y brindar orientación sobre posibles opciones, elegibilidad, riesgos y/o próximos pasos. La consulta no incluye la preparación o presentación de solicitudes ni la representación del cliente. La consultora está autorizada y regulada por el College of Immigration and Citizenship Consultants (CICC), organismo regulador de los consultores autorizados de inmigración y ciudadanía en Canadá. Al firmar, el cliente acepta el propósito, alcance y tarifa de esta consulta.";
  const portuguese = "A consulta tem como objetivo analisar a situação migratória ou de cidadania do cliente e fornecer orientações sobre possíveis opções, elegibilidade, riscos e/ou próximos passos. A consulta não inclui preparação ou envio de processos nem representação do cliente. A consultora é licenciada e regulamentada pelo College of Immigration and Citizenship Consultants (CICC), órgão responsável pela regulamentação dos consultores de imigração e cidadania licenciados no Canadá. Ao assinar, o cliente concorda com o objetivo, escopo e valor da consulta.";
  const firstLanguage = language === "en" ? english : language === "fr" ? french : language === "es" ? spanish : portuguese;
  const hasFrenchVersion = false;
  const pdf = await PDFDocument.create(); const page = pdf.addPage([612, 792]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.09, 0.14, 0.22), red = rgb(0.70, 0.14, 0.23); let y = 748;
  const [logoBytes, consultantSignatureBytes] = await Promise.all([
    loadBrandAsset(assetOrigin, "/brand/marina-ms-logo.png"),
    loadBrandAsset(assetOrigin, consultant.signatureAssetPath),
  ]);
  const logo = await pdf.embedPng(logoBytes);
  const consultantSignature = consultant.signatureAssetPath.endsWith(".png")
    ? await pdf.embedPng(consultantSignatureBytes)
    : await pdf.embedJpg(consultantSignatureBytes);
  page.drawImage(logo, { x: 64, y: y - 9, width: 42, height: 36 });
  page.drawText("I Am Going To Canada", { x: 116, y: y + 2, size: 17, font: bold, color: navy }); page.drawText("by Marina Snyder", { x: 116, y: y - 14, size: 8, font: regular, color: red });
  page.drawLine({ start: { x: 50, y: y - 28 }, end: { x: 562, y: y - 28 }, thickness: 1.5, color: red }); y -= 62;
  page.drawText(`${options.testMode ? "[TEST] " : ""}Consultation agreement`, { x: 50, y, size: 18, font: bold, color: navy });
  page.drawText("Marina Snyder Immigration Consulting Inc.", { x: 334, y: y + 2, size: 6.5, font: regular, color: navy });
  page.drawText("Marina Snyder Consultation en Immigration Inc.", { x: 334, y: y - 8, size: 6.5, font: regular, color: navy });
  y -= 30;
  const contactFontSize = 11;
  const contactBlockX = 50;
  const contactBlockWidth = 512;
  const contactTextX = contactBlockX + 6;
  const contactTextWidth = contactBlockWidth - 12;
  const contactFields = [
    `Consultant: ${consultant.name} | ${consultant.credentialLabel} #${consultant.credentialValue}`,
    `Contact: ${consultant.contact}`,
    `Client: ${input.name}`,
    `Contact: ${input.addressAndPhone}`,
    `Email: ${input.email}`,
  ];
  if (input.fee?.trim()) contactFields.push(`Consultation Fee: ${input.fee.trim()}`);
  const contactLines = contactFields.flatMap((field) =>
    wrapContractText(field, contactTextWidth, (value) => regular.widthOfTextAtSize(value, contactFontSize)),
  );
  const contactLineHeight = 15;
  const contactBlockHeight = contactLines.length * contactLineHeight + 30;
  const contactBlockBottom = y + 10 - contactBlockHeight;
  page.drawRectangle({ x: contactBlockX, y: contactBlockBottom, width: contactBlockWidth, height: contactBlockHeight, color: rgb(0.97,0.98,0.99) });
  page.drawRectangle({ x: contactBlockX, y: contactBlockBottom, width: 3, height: contactBlockHeight, color: red });
  contactLines.forEach((line, i) => {
    const lineWidth = regular.widthOfTextAtSize(line, contactFontSize);
    const safeFontSize = Math.min(contactFontSize, contactFontSize * (contactTextWidth / lineWidth));
    page.drawText(line, { x: contactTextX, y: y - 6 - i * contactLineHeight, size: safeFontSize, font: regular, color: navy });
  });
  y = contactBlockBottom - 22;
  const bodyFontSize = hasFrenchVersion ? 9.2 : 10.5;
  const bodyLineHeight = hasFrenchVersion ? 11.2 : 15;
  const wrap = (text: string, max = hasFrenchVersion ? 106 : 92) => text.match(new RegExp(`.{1,${max}}(?:\\s|$)`, "g"))?.map((line) => line.trim()) ?? [text];
  const drawParagraph = (text: string) => {
    for (const line of wrap(text)) {
      page.drawText(line, { x: 50, y, size: bodyFontSize, font: regular, color: navy });
      y -= bodyLineHeight;
    }
  };

  drawParagraph(firstLanguage);

  if (hasFrenchVersion) {
    y -= 6;
    page.drawLine({ start: { x: 50, y }, end: { x: 562, y }, thickness: 0.8, color: rgb(0.8, 0.83, 0.88) });
    y -= 16;
    page.drawText("Version française", { x: 50, y, size: 10.5, font: bold, color: navy });
    y -= 13;
    drawParagraph(french);
  }
  const consultantIdentityTopY = Math.min(410, y - 8);
  const clientSignatureLabelY = consultantIdentityTopY;
  // SignWell's coordinate system uses a top-origin page canvas. Keep its fields
  // tied to the same delta as the consultant's signature rather than a fixed page position.
  const signwellFieldY = 550 + (410 - consultantIdentityTopY);
  page.drawText("Client signature", { x: 72, y: clientSignatureLabelY, size: 11, font: bold, color: navy });
  const signatureScale = Math.min(118 / consultantSignature.width, 59 / consultantSignature.height);
  const signatureWidth = consultantSignature.width * signatureScale;
  const signatureHeight = consultantSignature.height * signatureScale;
  const identityMaxWidth = 118;
  const identityLineHeight = 10;
  const wrapIdentityText = (text: string, font: typeof regular) => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(candidate, 8) > identityMaxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  const identityLines = [
    ...wrapIdentityText(consultant.name, bold).map((text) => ({ text, font: bold })),
    ...wrapIdentityText(`${consultant.credentialLabel} ${consultant.credentialValue}`, regular).map((text) => ({ text, font: regular })),
  ];
  identityLines.forEach(({ text, font }, index) => {
    page.drawText(text, { x: 300, y: consultantIdentityTopY - index * identityLineHeight, size: 8, font, color: navy });
  });
  const identityBottomY = consultantIdentityTopY - (identityLines.length - 1) * identityLineHeight;
  const signatureGap = 8;
  const consultantSignatureY = identityBottomY - signatureGap - signatureHeight;
  page.drawImage(consultantSignature, { x: 359 - signatureWidth / 2, y: consultantSignatureY, width: signatureWidth, height: signatureHeight });
  page.drawText("Date", { x: 440, y: clientSignatureLabelY, size: 11, font: bold, color: navy });
  page.drawLine({ start:{x:50,y:42}, end:{x:562,y:42}, thickness:1.5, color:red }); page.drawText("533 St-Pierre, Drummondville, QC J2C 6M1, Bureau 205 · (819) 817-5048",{x:150,y:27,size:8,font:regular,color:rgb(.3,.34,.4)});
  return {
    pdf: Buffer.from(await pdf.save()),
    signatureFields: [
      { type: "signature", api_id: "client_signature", required: true, recipient_id: "1", page: 1, x: 96, y: signwellFieldY, width: 220, height: 32 },
      { type: "date", api_id: "signed_date", required: true, recipient_id: "1", page: 1, x: 590, y: signwellFieldY, width: 120, height: 32 },
    ],
  };
}

export async function POST(request: Request) {
  if (!isMockBookingEnabled()) return NextResponse.json({ error: "Mock booking is disabled" }, { status: 404 });
  if (missingConfiguration()) return NextResponse.json({ error: "Test integrations are not configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const parsed = mockBookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Confira os campos obrigatórios do teste." }, { status: 400 });

  const input = parsed.data;
  const consultant: ContractConsultant = {
    id: "mock-consultant",
    name: process.env.MOCK_CONSULTANT_NAME || "TODO_CONTENT — assigned consultant",
    credentialLabel: "RCIC",
    credentialValue: process.env.MOCK_CONSULTANT_RCIC || "TODO_CONTENT",
    contact: process.env.MOCK_CONSULTANT_CONTACT || "TODO_CONTENT",
    signatureAssetPath: "/brand/marina-signature-transparent.png",
  };
  const contract = await createContractPdf(input, consultant, input.language, new URL(request.url).origin, { testMode: true });
  const signwellBody = {
    test_mode: process.env.SIGNWELL_TEST_MODE !== "false",
    files: [{ name: "consultation-agreement-test.pdf", file_base64: contract.pdf.toString("base64") }],
    name: `IAGC test consultation agreement — ${input.name}`,
    subject: "Your consultation agreement — test mode",
    message: "This is a test signature request. It is not legally binding.",
    recipients: [{ id: "1", name: input.name, email: process.env.SIGNWELL_TEST_RECIPIENT || input.email }],
    fields: [contract.signatureFields],
    metadata: { mock_booking: "true" },
    language: input.language,
  };
  const signwellResponse = await fetch(SIGNWELL_API, { method: "POST", headers: { "X-Api-Key": process.env.SIGNWELL_API_KEY!, "Content-Type": "application/json" }, body: JSON.stringify(signwellBody) });
  const signwellResult = await signwellResponse.json().catch(() => null) as { id?: string; recipients?: Array<{ signing_url?: string; embedded_signing_url?: string }> ; error?: string; errors?: unknown } | null;
  const signingUrl = signwellResult?.recipients?.[0]?.signing_url || signwellResult?.recipients?.[0]?.embedded_signing_url;
  if (!signwellResponse.ok || !signwellResult?.id || !signingUrl) {
    console.error("Mock SignWell request failed", { status: signwellResponse.status, response: signwellResult });
    return NextResponse.json({ error: signwellResult?.error ?? "Não foi possível criar o contrato de teste." }, { status: 502 });
  }
  const questionnaireUrl = process.env.INITIAL_QUESTIONNAIRE_URL;
  const emailCopy = await renderContractEmail({ name: input.name, signingUrl, questionnaireUrl, language: input.language, testMode: true });
  const resendResponse = await fetch(RESEND_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [process.env.RESEND_TEST_RECIPIENT || input.email], subject: emailCopy.subject, html: emailCopy.html, attachments: emailCopy.attachments }),
  });
  const resendBody = await resendResponse.json().catch(() => null) as { id?: string; message?: string; name?: string } | null;
  if (!resendResponse.ok) {
    console.error("Mock Resend email failed", { status: resendResponse.status, documentId: signwellResult.id });
    return NextResponse.json({ error: resendBody?.message ?? "Contrato criado, mas o e-mail de teste não foi enviado." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, testMode: true, documentId: signwellResult.id, emailId: resendBody?.id ?? null });
}
