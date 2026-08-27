import { z } from "zod";

export const mockBookingSchema = z.object({
  testMode: z.literal(true),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  addressAndPhone: z.string().trim().min(5).max(500),
  preparationNotes: z.string().trim().min(2).max(2000),
  language: z.enum(["en", "fr", "pt-fr", "es-fr"]),
  consultationType: z.literal("30-minutes"),
  fee: z.string().trim().max(40).default("TEST — no charge"),
  consent: z.literal(true),
});

export type MockBookingInput = z.infer<typeof mockBookingSchema>;

export function isMockBookingEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ENABLE_MOCK_BOOKING_FLOW === "true";
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}
