"use client";

import { FormEvent, useState } from "react";

export function MockCalendlyForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setStatus(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/test/mock-booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ testMode: true, name: form.get("name"), email: form.get("email"), addressAndPhone: form.get("addressAndPhone"), preparationNotes: form.get("preparationNotes"), language: form.get("language"), consultationType: "30-minutes", fee: "TEST — no charge", consent: form.get("consent") === "on" }) });
    const body = await response.json().catch(() => null) as { error?: string } | null;
    setLoading(false); setStatus(response.ok ? "Teste concluído: o e-mail com o link de assinatura foi enviado." : body?.error ?? "Não foi possível concluir o teste.");
  }
  return <form className="mock-booking-form" onSubmit={submit}>
    <label>Nome *<input name="name" required maxLength={120} /></label>
    <label>E-mail *<input name="email" type="email" required maxLength={254} /></label>
    <label>Endereço completo e telefone *<textarea name="addressAndPhone" required maxLength={500} /></label>
    <label>O que ajudaria a preparar nossa reunião? *<textarea name="preparationNotes" required maxLength={2000} /></label>
    <label>Idioma do contrato *<select name="language" defaultValue="pt-fr"><option value="en">English</option><option value="fr">Français</option><option value="pt-fr">Português + Français</option><option value="es-fr">Español + Français</option></select></label>
    <label className="mock-consent"><input type="checkbox" name="consent" required /> Confirmo que este é um teste e não haverá cobrança real.</label>
    <button className="button button-maple" type="submit" disabled={loading}>{loading ? "Enviando…" : "Confirmar pagamento de teste"}</button>
    {status ? <p role="status">{status}</p> : null}
  </form>;
}
