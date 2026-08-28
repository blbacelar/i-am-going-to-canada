import { NextResponse } from "next/server";
import { escapeHtml, isMockBookingEnabled, mockBookingSchema } from "@/lib/test/mock-booking";
import { renderContractEmail } from "@/lib/email/contract-email";

const SIGNWELL_API = "https://www.signwell.com/api/v1/documents";
const RESEND_API = "https://api.resend.com/emails";

function missingConfiguration() {
  return !process.env.SIGNWELL_API_KEY || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL;
}

export async function createContractPdf(input: { name: string; email: string; addressAndPhone: string; preparationNotes: string; fee: string }, consultantName: string, consultantRcic: string, consultantContact: string, language: string) {
  const { chromium } = await import("playwright");
  const fs = await import("node:fs/promises");
  const logo = `data:image/png;base64,${(await fs.readFile(new URL("../../../../../public/brand/marina-ms-logo.png", import.meta.url))).toString("base64")}`;
  const portuguese = "A consulta tem como objetivo analisar a situação migratória ou de cidadania do cliente e fornecer orientações sobre possíveis opções, elegibilidade, riscos e/ou próximos passos. A consulta não inclui preparação ou envio de processos nem representação do cliente. A consultora é licenciada e regulamentada pelo College of Immigration and Citizenship Consultants (CICC), órgão responsável pela regulamentação dos consultores de imigração e cidadania licenciados no Canadá. Ao assinar, o cliente concorda com o objetivo, escopo e valor da consulta.";
  const french = "La consultation a pour objet d’examiner la situation du client en matière d’immigration ou de citoyenneté et de fournir des conseils sur les options disponibles, l’admissibilité, les risques et/ou les prochaines étapes. Elle ne comprend pas la préparation, le dépôt ou la représentation dans le cadre d’une demande ou d’une procédure. La consultante est autorisée et réglementée par le College of Immigration and Citizenship Consultants (CICC), l’organisme chargé de surveiller les consultants autorisés en immigration et citoyenneté au Canada. En signant, le client accepte l’objet, la portée et les honoraires de cette consultation.";
  const english = "The purpose of this consultation is to review the client’s immigration or citizenship situation and provide advice regarding available options, eligibility, risks and/or next steps. The consultation does not include preparation, submission or representation in an application or proceeding. The consultant is licensed and regulated by the College of Immigration and Citizenship Consultants (CICC), the regulatory body responsible for overseeing licensed immigration and citizenship consultants in Canada. By signing, the client agrees to the purpose, scope and fee of this consultation.";
  const spanish = "La consulta tiene como objetivo analizar la situación migratoria o de ciudadanía del cliente y brindar orientación sobre posibles opciones, elegibilidad, riesgos y/o próximos pasos. La consulta no incluye la preparación o presentación de solicitudes ni la representación del cliente. La consultora está autorizada y regulada por el College of Immigration and Citizenship Consultants (CICC), organismo regulador de los consultores autorizados de inmigración y ciudadanía en Canadá. Al firmar, el cliente acepta el propósito, alcance y tarifa de esta consulta.";
  const bilingual = language === "es-fr" || language === "pt-fr";
  const firstLanguage = language === "en" ? english : language === "fr" ? french : language === "es-fr" ? spanish : portuguese;
  const body = bilingual ? `<section>${firstLanguage}</section><section class="second-language"><h2>Version française</h2>${french}</section>` : `<section>${firstLanguage}</section>`;
  const signatureLabels = `<div class="signature-labels"><strong>Client signature</strong><strong style="transform:translateX(-140px)">Date</strong></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#182338;margin:24px;line-height:1.34;font-size:12px}header{display:flex;align-items:center;gap:12px;border-bottom:1.5px solid #b4233a;padding-bottom:7px;margin-bottom:12px}header img{width:54px;height:45px;object-fit:contain}.brand-title{font-size:17px;font-weight:700}.brand-subtitle{font-size:8px;letter-spacing:.12em;color:#b4233a;text-transform:uppercase;margin-top:2px}.address{font-size:10px;color:#4b5563;line-height:1.25}h1{font-size:18px;margin:0 0 12px}h2{font-size:13px;margin:12px 0 6px}p{margin:5px 0}hr{border:0;border-top:1px solid #cdd4df;margin:12px 0}.details{background:#f8fafc;padding:8px 12px;border-left:3px solid #b4233a}.signature-labels{position:fixed;left:0;right:0;bottom:380px;display:grid;grid-template-columns:220px 120px;column-gap:160px;padding-left:30px;font-size:11px}.second-language{padding-top:0}.document-footer{position:fixed;left:0;right:0;bottom:14px;border-top:1.5px solid #b4233a;padding-top:6px;text-align:center;font-size:10px;color:#4b5563}</style></head><body><header><img src="${logo}" alt="I Am Going To Canada"/><div><div class="brand-title">I Am Going To Canada</div><div class="brand-subtitle">by Marina Snyder</div></div></header><h1>[TEST] Consultation agreement</h1><div class="details"><p><strong>Consultant:</strong> ${escapeHtml(consultantName)} | RCIC #${escapeHtml(consultantRcic)}</p><p><strong>Contact:</strong> ${escapeHtml(consultantContact)}</p><p><strong>Client:</strong> ${escapeHtml(input.name)}</p><p><strong>Contact:</strong> ${escapeHtml(input.addressAndPhone)} | ${escapeHtml(input.email)}</p><p><strong>Consultation Fee:</strong> ${escapeHtml(input.fee)}</p></div><hr>${body}${signatureLabels}<footer class="document-footer">533 St-Pierre, Drummondville, QC J2C 6M1, Bureau 205 · (819) 817-5048</footer></body></html>`;
  const browser = await chromium.launch({ headless: true });
  try { const page = await browser.newPage(); await page.setContent(html, { waitUntil: "load" }); return await page.pdf({ format: "Letter", printBackground: true, margin: { top: "0.65in", right: "0.65in", bottom: "0.65in", left: "0.65in" } }); } finally { await browser.close(); }
}

export async function POST(request: Request) {
  if (!isMockBookingEnabled()) return NextResponse.json({ error: "Mock booking is disabled" }, { status: 404 });
  if (missingConfiguration()) return NextResponse.json({ error: "Test integrations are not configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const parsed = mockBookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Confira os campos obrigatórios do teste." }, { status: 400 });

  const input = parsed.data;
  const consultantName = process.env.MOCK_CONSULTANT_NAME || "TODO_CONTENT — assigned consultant";
  const consultantRcic = process.env.MOCK_CONSULTANT_RCIC || "TODO_CONTENT";
  const consultantContact = process.env.MOCK_CONSULTANT_CONTACT || "TODO_CONTENT";
  const pdf = await createContractPdf(input, consultantName, consultantRcic, consultantContact, input.language);
  const signwellBody = {
    test_mode: process.env.SIGNWELL_TEST_MODE !== "false",
    files: [{ name: "consultation-agreement-test.pdf", file_base64: Buffer.from(pdf).toString("base64") }],
    name: `IAGC test consultation agreement — ${input.name}`,
    subject: "Your consultation agreement — test mode",
    message: "This is a test signature request. It is not legally binding.",
    recipients: [{ id: "1", name: input.name, email: process.env.SIGNWELL_TEST_RECIPIENT || input.email }],
    fields: [[
      { type: "signature", api_id: "client_signature", required: true, recipient_id: "1", page: 1, x: 72, y: 620, width: 220, height: 32 },
      { type: "date", api_id: "signed_date", required: true, recipient_id: "1", page: 1, x: 330, y: 620, width: 120, height: 32 },
    ]],
    metadata: { mock_booking: "true" },
    language: input.language === "pt-fr" ? "pt" : input.language === "es-fr" ? "es" : input.language,
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
