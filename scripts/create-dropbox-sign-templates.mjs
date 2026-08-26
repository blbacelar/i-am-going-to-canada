import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const apiKey = process.env.DROPBOX_SIGN_API_KEY;
const clientId = process.env.DROPBOX_SIGN_CLIENT_ID;
if (!apiKey || !clientId) throw new Error("DROPBOX_SIGN_API_KEY and DROPBOX_SIGN_CLIENT_ID are required");

const merge = (name) => `[text-merge|req|sender|${name}]`;
const fields = `
<p><strong>Consultant:</strong> ${merge("consultant_name")} | RCIC #${merge("consultant_rcic")}</p>
<p><strong>Contact:</strong> ${merge("consultant_contact")}</p>
<p><strong>Client:</strong> ${merge("client_name")}</p>
<p><strong>Contact:</strong> ${merge("client_contact")}</p>
<p><strong>Consultation Fee:</strong> ${merge("consultation_fee")}</p>`;
const signatureBlock = `<div class="signature"><p><strong>Client signature:</strong></p><p><strong>Date:</strong></p></div>`;
const english = `The purpose of this consultation is to review the client’s immigration or citizenship situation and provide advice regarding available options, eligibility, risks and/or next steps. The consultation does not include preparation, submission or representation in an application or proceeding.<br><br>The consultant is licensed and regulated by the <strong>College of Immigration and Citizenship Consultants (CICC)</strong>, the regulatory body responsible for overseeing licensed immigration and citizenship consultants in Canada.<br><br>By signing, the client agrees to the purpose, scope and fee of this consultation.`;
const french = `La consultation a pour objet d’examiner la situation du client en matière d’immigration ou de citoyenneté et de fournir des conseils sur les options disponibles, l’admissibilité, les risques et/ou les prochaines étapes. Elle ne comprend pas la préparation, le dépôt ou la représentation dans le cadre d’une demande ou d’une procédure.<br><br>La consultante est autorisée et réglementée par le <strong>College of Immigration and Citizenship Consultants (CICC)</strong>, l’organisme chargé de surveiller les consultants autorisés en immigration et citoyenneté au Canada.<br><br>En signant, le client accepte l’objet, la portée et les honoraires de cette consultation.`;
const portuguese = `A consulta tem como objetivo analisar a situação migratória ou de cidadania do cliente e fornecer orientações sobre possíveis opções, elegibilidade, riscos e/ou próximos passos. A consulta não inclui preparação ou envio de processos nem representação do cliente.<br><br>A consultora é licenciada e regulamentada pelo <strong>College of Immigration and Citizenship Consultants (CICC)</strong>, órgão responsável pela regulamentação dos consultores de imigração e cidadania licenciados no Canadá.<br><br>Ao assinar, o cliente concorda com o objetivo, escopo e valor da consulta.`;
const spanish = `La consulta tiene como objetivo analizar la situación migratoria o de ciudadanía del cliente y brindar orientación sobre posibles opciones, elegibilidad, riesgos y/o próximos pasos. La consulta no incluye la preparación o presentación de solicitudes ni la representación del cliente.<br><br>La consultora está autorizada y regulada por el <strong>College of Immigration and Citizenship Consultants (CICC)</strong>, organismo regulador de los consultores autorizados de inmigración y ciudadanía en Canadá.<br><br>Al firmar, el cliente acepta el propósito, alcance y tarifa de esta consulta.`;

const allTemplates = [
  ["EN", "Consultation Agreement — English", english],
  ["FR", "Convention de consultation — Français", french],
  ["PT-FR", "Contrato de consulta — Português + Français", `${portuguese}<hr>${french}`],
  ["ES-FR", "Acuerdo de consulta — Español + Français", `${spanish}<hr>${french}`],
];
const requestedCodes = process.env.DROPBOX_SIGN_TEMPLATE_CODES?.split(",").filter(Boolean);
const templates = requestedCodes?.length ? allTemplates.filter(([code]) => requestedCodes.includes(code)) : allTemplates;

function documentHtml(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#182338;margin:52px;line-height:1.5;font-size:14px}h1{font-size:24px;margin:0 0 28px;border-bottom:2px solid #b4233a;padding-bottom:12px}p{margin:10px 0}hr{border:0;border-top:1px solid #cdd4df;margin:28px 0}.signature{margin-top:42px;padding-top:18px;border-top:1px solid #182338}</style></head><body><h1>${title}</h1>${fields}<hr><p>${body}</p>${signatureBlock}</body></html>`;
}

const browser = await chromium.launch({ headless: true });
const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "iagc-contracts-"));
const created = [];
try {
  for (const [code, title, body] of templates) {
    const page = await browser.newPage();
    await page.setContent(documentHtml(`[TEST] ${title}`, body), { waitUntil: "load" });
    const pdfPath = path.join(outputDir, `${code}.pdf`);
    await page.pdf({ path: pdfPath, format: "Letter", printBackground: true, margin: { top: "0.65in", right: "0.65in", bottom: "0.65in", left: "0.65in" } });
    await page.close();

    const form = new FormData();
    form.append("client_id", clientId);
    form.append("files[0]", new Blob([await fs.readFile(pdfPath)], { type: "application/pdf" }), `${code}.pdf`);
    form.append("title", `[TEST] ${title}`);
    form.append("subject", "Please review and sign this consultation agreement");
    form.append("message", "This is a test template. Please do not use it for a real client until the content is approved.");
    form.append("signer_roles[0][name]", "Client");
    form.append("signer_roles[0][order]", "0");
    const formFields = [
      ["signature", "client_signature", "true", "0", "72", "690", "220", "32"],
      ["date_signed", "signed_date", "true", "0", "330", "690", "120", "32"],
    ];
    formFields.forEach(([type, name, required, signer, x, y, width, height], index) => {
      form.append(`form_fields_per_document[0][${index}][type]`, type);
      form.append(`form_fields_per_document[0][${index}][name]`, name);
      form.append(`form_fields_per_document[0][${index}][api_id]`, name);
      form.append(`form_fields_per_document[0][${index}][required]`, required);
      form.append(`form_fields_per_document[0][${index}][signer]`, signer);
      form.append(`form_fields_per_document[0][${index}][x]`, x);
      form.append(`form_fields_per_document[0][${index}][y]`, y);
      form.append(`form_fields_per_document[0][${index}][width]`, width);
      form.append(`form_fields_per_document[0][${index}][height]`, height);
      form.append(`form_fields_per_document[0][${index}][page]`, "1");
    });
    form.append("use_text_tags", "1");
    form.append("test_mode", "1");
    const response = await fetch("https://api.hellosign.com/v3/template/create", { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}` }, body: form });
    const payload = await response.json();
    if (!response.ok) throw new Error(`${code}: ${JSON.stringify(payload)}`);
    created.push({ code, templateId: payload.template?.template_id, title: payload.template?.title });
  }
} finally {
  await browser.close();
  await fs.rm(outputDir, { recursive: true, force: true });
}
console.log(JSON.stringify(created, null, 2));
