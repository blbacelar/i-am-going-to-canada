"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackJourneyEvent } from "@/lib/analytics/track";
import { resolveBookingBaseUrl } from "@/lib/booking/routing";
import { languageNames, localePath, type ConsultantLanguage, type Locale } from "@/lib/i18n/config";
import { matchConsultantsByCriteria, type PracticeArea } from "@/lib/matching/match-consultants";
import type { Consultant } from "@/lib/schemas/content";

function ChoiceArrow() {
  return (
    <svg className="choice-arrow" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 14 14 4M7 4h7v7" />
    </svg>
  );
}

const practiceQuestions: PracticeArea[] = ["qc", "sk", "irb"];
const calendlyWidgetScript = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

function CalendlyInlineEmbed({ url, fallbackLabel }: { url: string; fallbackLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const initialize = () => {
      if (cancelled || !containerRef.current || !window.Calendly) return;
      containerRef.current.replaceChildren();
      window.Calendly.initInlineWidget({ url, parentElement: containerRef.current });
    };
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${calendlyWidgetScript}"]`);
    if (window.Calendly) {
      initialize();
    } else if (existingScript) {
      existingScript.addEventListener("load", initialize, { once: true });
      existingScript.addEventListener("error", () => setScriptFailed(true), { once: true });
    } else {
      const script = document.createElement("script");
      script.src = calendlyWidgetScript;
      script.async = true;
      script.addEventListener("load", initialize, { once: true });
      script.addEventListener("error", () => setScriptFailed(true), { once: true });
      document.body.appendChild(script);
    }
    return () => { cancelled = true; };
  }, [url]);

  if (scriptFailed) {
    return <iframe className="calendly-inline-fallback" src={url} title={fallbackLabel} />;
  }
  return <div className="calendly-inline-embed" ref={containerRef} aria-label={fallbackLabel} />;
}

export interface ConciergeCopy {
  intro: string;
  languageQuestion: string;
  durationQuestion: string;
  qcQuestion: string;
  skQuestion: string;
  irbQuestion: string;
  yes: string;
  no: string;
  availabilityNote: string;
  availabilityLoading: string;
  noAvailability: string;
  continueToBooking: string;
  viewAll: string;
  restart: string;
  back: string;
  step: string;
  noExactMatch: string;
}

export function Concierge({
  locale,
  consultants,
  copy,
}: {
  locale: Locale;
  consultants: Consultant[];
  copy: ConciergeCopy;
}) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<ConsultantLanguage | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<"30" | "60" | null>(null);
  const [answers, setAnswers] = useState<Record<PracticeArea, boolean | null>>({ qc: null, sk: null, irb: null });
  const [availability, setAvailability] = useState<Record<string, { firstAvailableAt: string | null; slotCount: number }>>({});
  const [availabilityQuery, setAvailabilityQuery] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(false);
  const localMockMode = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ENABLE_MOCK_BOOKING_FLOW === "true";

  const selectedAreas = practiceQuestions.filter((area) => answers[area] === true);
  const matches = useMemo(
    () => selectedLanguage ? matchConsultantsByCriteria(consultants, selectedLanguage, selectedAreas) : [],
    [consultants, selectedAreas, selectedLanguage],
  );

  const questionCopy: Record<PracticeArea, string> = {
    qc: copy.qcQuestion,
    sk: copy.skQuestion,
    irb: copy.irbQuestion,
  };
  const hasIrbMatter = selectedAreas.includes("irb");
  const totalSteps = hasIrbMatter ? 5 : 6;
  const currentStep = hasIrbMatter && step === 5 ? 5 : step + 1;
  const stepLabel = copy.step.replace("{current}", String(currentStep)).replace("{total}", String(totalSteps));

  function chooseLanguage(language: ConsultantLanguage) {
    setSelectedLanguage(language);
    setSelectedDuration(null);
    setAnswers({ qc: null, sk: null, irb: null });
    setAvailability({});
    setAvailabilityQuery(null);
    setMockMode(false);
    setStep(1);
    trackJourneyEvent({ event: "language_selected", locale });
    trackJourneyEvent({ event: "concierge_started", locale });
  }

  function choosePracticeArea(area: PracticeArea, answer: boolean) {
    const nextAnswers = { ...answers, [area]: answer };
    setAnswers(nextAnswers);
    trackJourneyEvent({ event: "practice_area_selected", locale, practiceArea: area, answer });
    const nextStep = step + 1;
    if (nextStep < 4) {
      setStep(nextStep as 1 | 2 | 3);
      return;
    }
    const selected = practiceQuestions.filter((item) => nextAnswers[item] === true);
    const resultCount = selectedLanguage
      ? matchConsultantsByCriteria(consultants, selectedLanguage, selected).length
      : 0;
    trackJourneyEvent({ event: "consultant_matches_viewed", locale, resultCount });
    setStep(selected.includes("irb") ? 5 : 4);
  }

  function chooseDuration(duration: "30" | "60") {
    setSelectedDuration(duration);
    setAvailability({});
    setAvailabilityQuery(null);
    setMockMode(false);
    setStep(5);
  }

  function restart() {
    setSelectedLanguage(null);
    setSelectedDuration(null);
    setAnswers({ qc: null, sk: null, irb: null });
    setAvailability({});
    setAvailabilityQuery(null);
    setMockMode(false);
    setStep(0);
  }

  const questionArea = practiceQuestions[step - 1];
  const durationMatches = useMemo(
    () => selectedDuration ? matches.filter((consultant) => consultant.calendlyAppointments[selectedDuration]?.url !== "TODO_CONTENT") : [],
    [matches, selectedDuration],
  );
  const availableDurations = useMemo(
    () => (["30", "60"] as const).filter((duration) => matches.some((consultant) => consultant.calendlyAppointments[duration]?.url !== "TODO_CONTENT")),
    [matches],
  );
  const resultIds = durationMatches.map((consultant) => consultant.id).join(",");
  const sortedMatches = useMemo(() => [...durationMatches].toSorted((a, b) => {
    const aAvailability = availability[a.id]?.firstAvailableAt;
    const bAvailability = availability[b.id]?.firstAvailableAt;
    if (aAvailability && bAvailability) return aAvailability.localeCompare(bAvailability);
    if (aAvailability) return -1;
    if (bAvailability) return 1;
    return a.order - b.order;
  }), [availability, durationMatches]);

  useEffect(() => {
    if (step !== 5 || !resultIds || !selectedDuration) return;
    let cancelled = false;
    fetch(`/api/calendly/availability?consultantIds=${encodeURIComponent(resultIds)}&duration=${selectedDuration}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<{ availability?: typeof availability; mockMode?: boolean }> : null)
      .then((body) => {
        if (!cancelled) {
          if (body?.availability) setAvailability(body.availability);
          setMockMode(body?.mockMode === true);
          setAvailabilityQuery(resultIds);
        }
      })
      .catch(() => {
        if (!cancelled) setAvailabilityQuery(resultIds);
      });
    return () => { cancelled = true; };
  }, [resultIds, selectedDuration, step]);

  const availableMatches = sortedMatches.filter((consultant) => availability[consultant.id]?.firstAvailableAt);
  const isMockMode = mockMode || localMockMode;
  // Keep the shared test calendar active while the client validates the flow.
  const testCalendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_TEST_EVENT_URL;
  const isTestCalendlyMode = Boolean(testCalendlyUrl);
  // The test calendar intentionally bypasses consultant matching during validation.
  const assignedConsultant = hasIrbMatter
    ? matches.find((consultant) => consultant.id === "marina-snyder")
    : isMockMode || isTestCalendlyMode ? (matches[0] ?? consultants[0]) : availableMatches[0];
  const bookingUrl = useMemo(() => {
    const baseUrl = resolveBookingBaseUrl({
      hasIrbMatter,
      testCalendlyUrl,
      assignedConsultantUrl: selectedDuration ? assignedConsultant?.calendlyAppointments[selectedDuration]?.url : undefined,
      irbCalendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_IRB_EVENT_URL,
    });
    if (!baseUrl || baseUrl === "TODO_CONTENT" || !selectedLanguage) return baseUrl;
    const url = new URL(baseUrl);
    if (typeof window !== "undefined") {
      url.searchParams.set("embed_domain", window.location.hostname);
    }
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("utm_content", selectedLanguage);
    return url.toString();
  }, [assignedConsultant, hasIrbMatter, selectedDuration, selectedLanguage, testCalendlyUrl]);

  return (
    <div className="concierge" data-step={step}>
      <div className="concierge-topline">
        <p>{stepLabel}</p>
        <div className="concierge-progress" aria-hidden="true">
          {Array.from({ length: totalSteps }, (_, value) => <span key={value} className={value < currentStep ? "is-active" : ""} />)}
        </div>
      </div>
      <p className="concierge-boundary">{copy.intro}</p>

      <div className="concierge-live" aria-live="polite">
        {step === 0 ? (
          <fieldset>
            <legend>{copy.languageQuestion}</legend>
            <div className="choice-list">
              {(["en", "fr", "es", "pt"] as ConsultantLanguage[]).map((language) => (
                <button key={language} type="button" onClick={() => chooseLanguage(language)}>
                  <span>{languageNames[locale][language]}</span><ChoiceArrow />
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step > 0 && step < 4 && questionArea ? (
          <fieldset>
            <legend>{questionCopy[questionArea]}</legend>
            <div className="choice-list">
              <button type="button" onClick={() => choosePracticeArea(questionArea, true)}>
                <span>{copy.yes}</span><ChoiceArrow />
              </button>
              <button type="button" onClick={() => choosePracticeArea(questionArea, false)}>
                <span>{copy.no}</span><ChoiceArrow />
              </button>
            </div>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset>
            <legend>{copy.durationQuestion}</legend>
            <div className="choice-list">
              {availableDurations.map((duration) => (
                <button key={duration} type="button" onClick={() => chooseDuration(duration)}>
                  <span>{duration} minutes</span><ChoiceArrow />
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 5 ? (
          <div className="concierge-results">
            {!matches.length && !isTestCalendlyMode ? <p className="no-match">{copy.noExactMatch}</p> : null}
            {matches.length && !hasIrbMatter && !isMockMode && !isTestCalendlyMode && availabilityQuery !== resultIds ? <p className="concierge-availability-note">{copy.availabilityLoading}</p> : null}
            {(matches.length || isTestCalendlyMode) && (hasIrbMatter || isMockMode || isTestCalendlyMode || availabilityQuery === resultIds) && assignedConsultant ? (
              <div className="concierge-assignment">
                {!hasIrbMatter ? <p className="concierge-availability-note">{copy.availabilityNote}</p> : null}
                {bookingUrl && (isTestCalendlyMode || !mockMode) ? (
                  <CalendlyInlineEmbed url={bookingUrl} fallbackLabel={copy.continueToBooking} />
                ) : mockMode ? (
                  <Link className="button" href={localePath(locale, "/mock-calendly")}>{copy.continueToBooking}</Link>
                ) : null}
              </div>
            ) : null}
            {matches.length && !hasIrbMatter && !isMockMode && !isTestCalendlyMode && availabilityQuery === resultIds && !assignedConsultant ? <p className="no-match">{copy.noAvailability}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="concierge-controls">
        {step > 0 ? (
          <button
            type="button"
            className="text-button"
            onClick={() => setStep(step === 5 && hasIrbMatter ? 3 : (step - 1) as 0 | 1 | 2 | 3 | 4)}
          >
            {copy.back}
          </button>
        ) : <span />}
        <Link href={localePath(locale, "/consultants")}>{copy.viewAll}</Link>
        {step > 0 ? <button type="button" className="text-button" onClick={restart}>{copy.restart}</button> : <span />}
      </div>
    </div>
  );
}
