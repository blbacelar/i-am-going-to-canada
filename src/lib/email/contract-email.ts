import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { escapeHtml } from "@/lib/test/mock-booking";

type ContractEmailLanguage = "en" | "fr" | "pt" | "pt-fr" | "es-fr";

const copy = {
  en: {
    subject: "Your consultation agreement",
    greeting: "Hello",
    intro: "Your consultation has been scheduled. Please review and sign the agreement:",
    cta: "Review and sign the agreement",
    questionnaire: "Complete the initial questionnaire",
    questionnaireIntro: "Before your consultation, you can complete the initial questionnaire:",
    automated: "This message was sent automatically by I Am Going To Canada.",
    test: "This is a test message; no payment was processed and the document is not legally binding.",
  },
  fr: {
    subject: "Votre entente de consultation",
    greeting: "Bonjour",
    intro: "Votre consultation est planifiée. Veuillez examiner et signer l’entente :",
    cta: "Examiner et signer l’entente",
    questionnaire: "Remplir le questionnaire initial",
    questionnaireIntro: "Avant votre consultation, vous pouvez remplir le questionnaire initial :",
    automated: "Ce message a été envoyé automatiquement par I Am Going To Canada.",
    test: "Il s’agit d’un message de test; aucun paiement n’a été traité et le document n’est pas juridiquement contraignant.",
  },
  pt: {
    subject: "Seu contrato de consulta",
    greeting: "Olá",
    intro: "Sua consulta foi agendada. Revise e assine o contrato:",
    cta: "Revisar e assinar o contrato",
    questionnaire: "Preencher o questionário inicial",
    questionnaireIntro: "Antes da consulta, você pode preencher o questionário inicial:",
    automated: "Esta mensagem foi enviada automaticamente pela I Am Going To Canada.",
    test: "Esta é uma mensagem de teste; nenhum pagamento foi processado e o documento não tem validade jurídica.",
  },
  "pt-fr": {
    subject: "Seu contrato de consulta / Votre entente de consultation",
    greeting: "Olá / Bonjour",
    intro: "Sua consulta foi agendada. Revise e assine o contrato. / Votre consultation est planifiée. Veuillez examiner et signer l’entente.",
    cta: "Revisar e assinar / Examiner et signer",
    questionnaire: "Preencher o questionário / Remplir le questionnaire",
    questionnaireIntro: "Antes da consulta, você pode preencher o questionário inicial. / Avant votre consultation, vous pouvez remplir le questionnaire initial.",
    automated: "Mensagem automática da I Am Going To Canada. / Message automatique de I Am Going To Canada.",
    test: "Teste: nenhum pagamento foi processado e o documento não tem validade jurídica. / Test : aucun paiement n’a été traité et le document n’est pas juridiquement contraignant.",
  },
  "es-fr": {
    subject: "Su contrato de consulta / Votre entente de consultation",
    greeting: "Hola / Bonjour",
    intro: "Su consulta está programada. Revise y firme el contrato. / Votre consultation est planifiée. Veuillez examiner et signer l’entente.",
    cta: "Revisar y firmar / Examiner et signer",
    questionnaire: "Completar el cuestionario / Remplir le questionnaire",
    questionnaireIntro: "Antes de la consulta, puede completar el cuestionario inicial. / Avant votre consultation, vous pouvez remplir le questionnaire initial.",
    automated: "Mensaje automático de I Am Going To Canada. / Message automatique de I Am Going To Canada.",
    test: "Prueba: no se procesó ningún pago y el documento no es jurídicamente vinculante. / Test : aucun paiement n’a été traité et le document n’est pas juridiquement contraignant.",
  },
} satisfies Record<ContractEmailLanguage, Record<string, string>>;

export async function renderContractEmail(input: {
  name: string;
  signingUrl: string;
  questionnaireUrl?: string;
  language: string;
  testMode?: boolean;
}) {
  const language = (input.language in copy ? input.language : "pt-fr") as ContractEmailLanguage;
  const text = copy[language];
  const logoPath = join(process.cwd(), "public", "brand", "marina-ms-logo.png");
  const logo = (await readFile(logoPath)).toString("base64");
  const questionnaire = input.questionnaireUrl
    ? `<tr><td style="padding:0 32px 22px"><p style="margin:0 0 10px">${text.questionnaireIntro}</p><a href="${escapeHtml(input.questionnaireUrl)}" style="color:#b4233a;font-weight:700">${text.questionnaire} &rarr;</a></td></tr>`
    : "";
  const testNote = input.testMode ? `<p style="margin:18px 0 0;color:#6b7280;font-size:12px">${text.test}</p>` : "";
  return {
    subject: text.subject,
    html: `<!doctype html><html><body style="margin:0;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#182338"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f6f8;padding:28px 12px"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border:1px solid #e3e6eb"><tr><td style="padding:22px 32px 18px;border-bottom:3px solid #b4233a"><img src="cid:iagc-brand-logo" width="54" height="45" alt="I Am Going To Canada" style="display:inline-block;vertical-align:middle;object-fit:contain"><span style="display:inline-block;vertical-align:middle;margin-left:12px;font-size:19px;font-weight:700">I Am Going To Canada<br><small style="font-size:9px;letter-spacing:2px;color:#b4233a">BY MARINA SNYDER</small></span></td></tr><tr><td style="padding:30px 32px 8px"><p style="margin:0 0 14px;font-size:17px;font-weight:700">${text.greeting} ${escapeHtml(input.name)},</p><p style="margin:0;line-height:1.6">${text.intro}</p></td></tr><tr><td style="padding:18px 32px 24px"><a href="${escapeHtml(input.signingUrl)}" style="display:inline-block;background:#b4233a;color:#fff;text-decoration:none;font-weight:700;padding:13px 20px;border-radius:4px">${text.cta}</a>${testNote}</td></tr>${questionnaire}<tr><td style="padding:22px 32px;border-top:1px solid #e3e6eb;color:#6b7280;font-size:12px;line-height:1.5">${text.automated}<br>533 St-Pierre, Drummondville, QC J2C 6M1, Bureau 205 · (819) 817-5048</td></tr></table></td></tr></table></body></html>`,
    attachments: [{ filename: "iagc-brand-logo.png", content: logo, content_id: "iagc-brand-logo" }],
  };
}
