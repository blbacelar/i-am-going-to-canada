"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { trackJourneyEvent } from "@/lib/analytics/track";
import { languageNames, localePath, type Locale } from "@/lib/i18n/config";
import { matchConsultants } from "@/lib/matching/match-consultants";
import type { Consultant, Service } from "@/lib/schemas/content";

function ChoiceArrow() {
  return (
    <svg className="choice-arrow" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 14 14 4M7 4h7v7" />
    </svg>
  );
}

export interface ConciergeCopy {
  intro: string;
  languageQuestion: string;
  serviceQuestion: string;
  resultsTitle: string;
  viewProfile: string;
  viewAll: string;
  restart: string;
  back: string;
  step: string;
  noExactMatch: string;
}

export function Concierge({
  locale,
  consultants,
  services,
  copy,
}: {
  locale: Locale;
  consultants: Consultant[];
  services: Service[];
  copy: ConciergeCopy;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (!selectedLanguage || !selectedService) return [];
    return matchConsultants(consultants, selectedLanguage, selectedService);
  }, [consultants, selectedLanguage, selectedService]);

  const results = matches.length ? matches.map((match) => match.consultant) : consultants;

  function chooseLanguage(language: Locale) {
    setSelectedLanguage(language);
    setSelectedService(null);
    setStep(1);
    trackJourneyEvent({ event: "language_selected", locale: language });
    trackJourneyEvent({ event: "concierge_started", locale });
  }

  function chooseService(serviceId: string) {
    setSelectedService(serviceId);
    setStep(2);
    const resultCount = selectedLanguage
      ? matchConsultants(consultants, selectedLanguage, serviceId).length
      : 0;
    trackJourneyEvent({ event: "service_selected", locale, serviceId });
    trackJourneyEvent({ event: "consultant_matches_viewed", locale, serviceId, resultCount });
  }

  function restart() {
    setSelectedLanguage(null);
    setSelectedService(null);
    setStep(0);
  }

  const stepLabel = copy.step.replace("{current}", String(step + 1)).replace("{total}", "3");

  return (
    <div className="concierge" data-step={step}>
      <div className="concierge-topline">
        <p>{stepLabel}</p>
        <div className="concierge-progress" aria-hidden="true">
          {[0, 1, 2].map((value) => <span key={value} className={value <= step ? "is-active" : ""} />)}
        </div>
      </div>
      <p className="concierge-boundary">{copy.intro}</p>

      <div className="concierge-live" aria-live="polite">
        {step === 0 ? (
          <fieldset>
            <legend>{copy.languageQuestion}</legend>
            <div className="choice-list">
              {(["en", "fr", "pt"] as Locale[]).map((language) => (
                <button key={language} type="button" onClick={() => chooseLanguage(language)}>
                  <span>{languageNames[locale][language]}</span><ChoiceArrow />
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset>
            <legend>{copy.serviceQuestion}</legend>
            <div className="choice-list choice-list-services">
              {services.map((service) => (
                <button key={service.id} type="button" onClick={() => chooseService(service.id)}>
                  <span>{service.label[locale]}</span><ChoiceArrow />
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <div className="concierge-results">
            <h3>{copy.resultsTitle}</h3>
            {!matches.length ? <p className="no-match">{copy.noExactMatch}</p> : null}
            <div className="result-list">
              {results.map((consultant) => (
                <article key={consultant.id}>
                  <Image src={consultant.portrait.src} alt={consultant.portrait.alt[locale]} width={144} height={180} />
                  <div>
                    <h4>{consultant.name}</h4>
                    <p>{consultant.role[locale]}</p>
                    <Link href={localePath(locale, `/consultants/${consultant.slug}`)}>{copy.viewProfile} →</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="concierge-controls">
        {step > 0 ? (
          <button type="button" className="text-button" onClick={() => setStep((step - 1) as 0 | 1)}>{copy.back}</button>
        ) : <span />}
        <Link href={localePath(locale, "/consultants")}>{copy.viewAll}</Link>
        {step > 0 ? <button type="button" className="text-button" onClick={restart}>{copy.restart}</button> : <span />}
      </div>
    </div>
  );
}
