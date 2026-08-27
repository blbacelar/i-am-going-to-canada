import type { Metadata } from "next";
import { MockCalendlyForm } from "./mock-form";

export const metadata: Metadata = { title: "Mock Calendly", robots: { index: false, follow: false } };

export default function MockCalendlyPage() {
  return <main className="page-shell mock-booking-page"><p className="eyebrow">TEST MODE</p><h1>Mock do Calendly</h1><p className="lede">Esta tela simula os dados preenchidos no Calendly. Nenhum pagamento real é processado.</p><MockCalendlyForm /></main>;
}
