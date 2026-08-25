"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { trackJourneyEvent } from "@/lib/analytics/track";
import { TrackedExternalLink } from "@/components/ui/tracked-link";
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

export interface ConciergeCopy {
  intro: string;
  languageQuestion: string;
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
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<ConsultantLanguage | null>(null);
  const [answers, setAnswers] = useState<Record<PracticeArea, boolean | null>>({ qc: null, sk: null, irb: null });
  const [availability, setAvailability] = useState<Record<string, { firstAvailableAt: string | null; slotCount: number }>>({});
  const [availabilityQuery, setAvailabilityQuery] = useState<string | null>(null);

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
  const stepLabel = copy.step.replace("{current}", String(step + 1)).replace("{total}", "5");

  function chooseLanguage(language: ConsultantLanguage) {
    setSelectedLanguage(language);
    setAnswers({ qc: null, sk: null, irb: null });
    setAvailability({});
    setAvailabilityQuery(null);
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
    setStep(4);
    const selected = practiceQuestions.filter((item) => nextAnswers[item] === true);
    const resultCount = selectedLanguage
      ? matchConsultantsByCriteria(consultants, selectedLanguage, selected).length
      : 0;
    trackJourneyEvent({ event: "consultant_matches_viewed", locale, resultCount });
  }

  function restart() {
    setSelectedLanguage(null);
    setAnswers({ qc: null, sk: null, irb: null });
    setAvailability({});
    setAvailabilityQuery(null);
    setStep(0);
  }

  const questionArea = practiceQuestions[step - 1];
  const resultIds = matches.map((consultant) => consultant.id).join(",");
  const sortedMatches = useMemo(() => [...matches].toSorted((a, b) => {
    const aAvailability = availability[a.id]?.firstAvailableAt;
    const bAvailability = availability[b.id]?.firstAvailableAt;
    if (aAvailability && bAvailability) return aAvailability.localeCompare(bAvailability);
    if (aAvailability) return -1;
    if (bAvailability) return 1;
    return a.order - b.order;
  }), [availability, matches]);

  useEffect(() => {
    if (step !== 4 || !resultIds) return;
    let cancelled = false;
    fetch(`/api/calendly/availability?consultantIds=${encodeURIComponent(resultIds)}`)
      .then((response) => response.ok ? response.json() as Promise<{ availability?: typeof availability }> : null)
      .then((body) => {
        if (!cancelled) {
          if (body?.availability) setAvailability(body.availability);
          setAvailabilityQuery(resultIds);
        }
      })
      .catch(() => {
        if (!cancelled) setAvailabilityQuery(resultIds);
      });
    return () => { cancelled = true; };
  }, [resultIds, step]);

  const availableMatches = sortedMatches.filter((consultant) => availability[consultant.id]?.firstAvailableAt);
  const assignedConsultant = availableMatches[0];

  return (
    <div className="concierge" data-step={step}>
      <div className="concierge-topline">
        <p>{stepLabel}</p>
        <div className="concierge-progress" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((value) => <span key={value} className={value <= step ? "is-active" : ""} />)}
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
          <div className="concierge-results">
            {!matches.length ? <p className="no-match">{copy.noExactMatch}</p> : null}
            {matches.length && availabilityQuery !== resultIds ? <p className="concierge-availability-note">{copy.availabilityLoading}</p> : null}
            {matches.length && availabilityQuery === resultIds && assignedConsultant ? (
              <div className="concierge-assignment">
                <p className="concierge-availability-note">{copy.availabilityNote}</p>
                {assignedConsultant.calendlyUrl !== "TODO_CONTENT" ? (
                  <TrackedExternalLink
                    className="button"
                    href={assignedConsultant.calendlyUrl}
                    event={{ event: "booking_clicked", locale, consultantId: assignedConsultant.id }}
                  >
                    {copy.continueToBooking}
                  </TrackedExternalLink>
                ) : null}
              </div>
            ) : null}
            {matches.length && availabilityQuery === resultIds && !assignedConsultant ? <p className="no-match">{copy.noAvailability}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="concierge-controls">
        {step > 0 ? (
          <button type="button" className="text-button" onClick={() => setStep((step - 1) as 0 | 1 | 2 | 3)}>{copy.back}</button>
        ) : <span />}
        <Link href={localePath(locale, "/consultants")}>{copy.viewAll}</Link>
        {step > 0 ? <button type="button" className="text-button" onClick={restart}>{copy.restart}</button> : <span />}
      </div>
    </div>
  );
}
