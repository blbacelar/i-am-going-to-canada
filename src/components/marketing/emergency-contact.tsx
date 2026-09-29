"use client";

import { useState, type FormEvent } from "react";

type EmergencyContactCopy = {
  title: string;
  body: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  messageHint: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
};

export function EmergencyContact({ copy }: { copy: EmergencyContactCopy }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function sendEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          website: form.get("website"),
        }),
      });
      if (!response.ok) throw new Error("Unable to send emergency contact email");
      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="emergency-contact" aria-labelledby="emergency-contact-title">
      <div className="emergency-contact-copy">
        <p id="emergency-contact-title" className="eyebrow">{copy.title}</p>
        <p>{copy.body}</p>
      </div>
      <form onSubmit={sendEmail} className="emergency-contact-form">
        <label>
          {copy.nameLabel}
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          {copy.emailLabel}
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="emergency-contact-message">
          {copy.messageLabel}
          <textarea name="message" required maxLength={1000} rows={3} />
          <span>{copy.messageHint}</span>
        </label>
        <input className="emergency-contact-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button type="submit" className="button button-maple emergency-contact-submit" disabled={status === "sending"}>
          {status === "sending" ? copy.sending : copy.submit}
        </button>
        {status !== "idle" ? <p className="emergency-contact-status" role="status">{status === "success" ? copy.success : status === "error" ? copy.error : null}</p> : null}
      </form>
    </aside>
  );
}
