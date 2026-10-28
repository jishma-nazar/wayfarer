"use client";

import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { byId, contact } from "@/lib/data";
import type { DatePreset } from "@/lib/dates";
import { tripsStore, type SavedItem } from "@/lib/saved";
import { useDraft } from "@/lib/store";
import { validateEmail, validatePhone, validateRequired } from "@/lib/validation";
import { cn } from "@/lib/cn";
import { GuestsPanel, useWhenSummary, WhenPanel } from "@/components/search/fields";
import { Photo } from "@/components/ui/Photo";

type Budget = "under1k" | "1to2k" | "2to5k" | "over5k" | "unsure";
type Contact = "email" | "whatsapp" | "phone";

interface Draft {
  interest?: { kind: SavedItem["kind"]; id: string };
  destination: string;
  when: DatePreset;
  checkIn?: string;
  checkOut?: string;
  adults: number;
  children: number;
  budget: Budget;
  notes: string;
  name: string;
  email: string;
  phone: string;
  contactPref: Contact;
  step: number;
  sentRef?: string;
}

const EMPTY: Draft = { destination: "", when: "flexible", adults: 2, children: 0, budget: "unsure", notes: "", name: "", email: "", phone: "", contactPref: "email", step: 0 };
const STEPS = 3;
type Field = "destination" | "name" | "email" | "phone";

export function EnquiryFlow() {
  const t = useTranslations("enquire");
  const tv = useTranslations("validation");
  const tc = useTranslations("content");
  const th = useTranslations("help");
  const ts = useTranslations("search");
  const params = useSearchParams();
  const id = useId();
  const [draft, update, clear] = useDraft<Draft>("enquiry", EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [summary, setSummary] = useState<string>();
  const [sending, setSending] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const whenSummary = useWhenSummary();
  const steps = t.raw("steps") as string[];

  // Pre-fill from the link that brought the visitor here (?stay=…, ?experience=…, ?package=…, ?destination=…).
  const paramKey = params.toString();
  useEffect(() => {
    const kinds = ["stay", "experience", "package"] as const;
    for (const kind of kinds) {
      const value = params.get(kind);
      if (value && byId[kind](value)) {
        const destId = byId[kind](value)!.destinationId;
        update({ interest: { kind, id: value }, destination: tc(`destinations.${destId}.name`), step: 0, sentRef: undefined });
        return;
      }
    }
    const dest = params.get("destination");
    if (dest) update({ destination: dest, step: 0, sentRef: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey]);

  const interestName = (i: NonNullable<Draft["interest"]>) =>
    i.kind === "stay" ? tc(`stays.${i.id}.name`) : i.kind === "experience" ? tc(`experiences.${i.id}.title`) : i.kind === "package" ? tc(`packages.${i.id}.title`) : tc(`destinations.${i.id}.name`);
  const interestPhoto = (i: NonNullable<Draft["interest"]>) => {
    if (i.kind === "stay") return byId.stay(i.id)?.photo;
    if (i.kind === "experience") return byId.experience(i.id)?.photo;
    const pkg = i.kind === "package" ? byId.package(i.id) : undefined;
    return byId.destination(pkg?.destinationId ?? i.id)?.photo;
  };

  const validate = (field: Field, value = draft[field]): string | undefined => {
    const key =
      field === "destination" ? validateRequired(value, "destinationRequired") :
      field === "name" ? validateRequired(value, "nameRequired") :
      field === "email" ? validateEmail(value) :
      validatePhone(value);
    return key ? tv(key) : undefined;
  };
  const blur = (field: Field) => setErrors((e) => ({ ...e, [field]: validate(field) }));
  const change = (field: Field, value: string) => {
    update({ [field]: value } as Partial<Draft>);
    if (errors[field]) setErrors((e) => ({ ...e, [field]: validate(field, value) }));
  };

  const goTo = (step: number) => {
    update({ step });
    setSummary(undefined);
    requestAnimationFrame(() => heading.current?.focus());
  };

  const fieldsFor = (step: number): Field[] => (step === 0 ? ["destination"] : step === 1 ? ["name", "email", "phone"] : []);

  const next = (e: FormEvent) => {
    e.preventDefault();
    const fields = fieldsFor(draft.step);
    const found = Object.fromEntries(fields.map((f) => [f, validate(f)])) as Partial<Record<Field, string>>;
    setErrors((prev) => ({ ...prev, ...found }));
    const bad = fields.filter((f) => found[f]);
    if (bad.length) {
      setSummary(tv("fixErrors", { count: bad.length }));
      document.getElementById(`${id}-${bad[0]}`)?.focus();
      return;
    }
    if (draft.step < STEPS - 1) return goTo(draft.step + 1);
    send();
  };

  const send = () => {
    setSending(true);
    // No backend: simulate a short round-trip, then record the enquiry on this device.
    window.setTimeout(() => {
      const ref = `WF-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      tripsStore.set((prev) => [
        { ref, sentAt: Date.now(), destination: draft.destination, interest: draft.interest, when: draft.when, checkIn: draft.checkIn, checkOut: draft.checkOut, adults: draft.adults, children: draft.children, email: draft.email },
        ...prev,
      ]);
      update({ sentRef: ref });
      setSending(false);
      requestAnimationFrame(() => heading.current?.focus());
    }, 700);
  };

  if (draft.sentRef) {
    const nextSteps = t.raw("next") as string[];
    return (
      <div className="container-x pb-24">
        <div className="max-w-2xl rounded-lg border border-hairline bg-surface p-6 sm:p-10">
          <span className="grid size-12 place-items-center rounded-full bg-olive text-on-olive dark:text-paper">
            <Check size={24} strokeWidth={1.5} aria-hidden />
          </span>
          <h2 ref={heading} tabIndex={-1} className="t-h2 mt-6 outline-none">{t("successTitle")}</h2>
          <p className="t-lead mt-3 text-ink-muted" role="status">
            {t("successBody", { ref: draft.sentRef, email: draft.email })}
          </p>
          <h3 className="eyebrow mt-10 text-ink-muted">{t("nextTitle")}</h3>
          <ol className="mt-4 space-y-4">
            {nextSteps.map((s, i) => (
              <li key={s} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="num font-mono text-sm text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/trips" onClick={() => clear()} className="btn btn-primary">{t("seeTrips")}</Link>
            <Link href="/" onClick={() => clear()} className="btn btn-ghost">{t("backHome")}</Link>
          </div>
        </div>
      </div>
    );
  }

  const fieldError = (f: Field) =>
    errors[f] && (
      <p id={`${id}-${f}-err`} className="field-error">
        {errors[f]}
      </p>
    );
  const described = (f: Field, hint?: boolean) => [hint ? `${id}-${f}-hint` : "", errors[f] ? `${id}-${f}-err` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div className="container-x pb-24">
      {/* Progress */}
      <nav aria-label={t("progressLabel")} className="mb-10">
        <p className="mb-3 text-sm text-ink-muted">{t("step", { current: draft.step + 1, total: STEPS })}</p>
        <ol className="grid grid-cols-3 gap-2">
          {steps.map((label, i) => {
            const done = i < draft.step;
            const current = i === draft.step;
            return (
              <li key={label} aria-current={current ? "step" : undefined}>
                <div className="h-[3px] overflow-hidden rounded-full bg-hairline">
                  <m.div className="h-full bg-accent" initial={false} animate={{ width: done || current ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                </div>
                {done ? (
                  <button type="button" onClick={() => goTo(i)} className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-left text-sm font-medium text-ink link-underline">
                    <Check size={14} strokeWidth={1.5} aria-hidden /> {label}
                  </button>
                ) : (
                  <p className={cn("mt-2 min-h-11 pt-2.5 text-sm", current ? "font-semibold text-ink" : "text-ink-faint")}>{label}</p>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-12">
        <form onSubmit={next} noValidate className="min-w-0 lg:col-span-7">
          <h2 ref={heading} tabIndex={-1} className="t-h2 outline-none">{steps[draft.step]}</h2>
          {summary && (
            <p role="alert" className="mt-4 rounded-sm border border-accent-strong/40 bg-accent-soft px-4 py-3 text-sm font-medium text-ink">
              {summary}
            </p>
          )}

          {draft.step === 0 && (
            <div className="mt-8 space-y-8">
              {draft.interest && (
                <div className="flex items-center gap-4 rounded-lg border border-hairline bg-surface p-3">
                  {interestPhoto(draft.interest) && <Photo photo={interestPhoto(draft.interest)!} alt="" sizes="80px" className="aspect-square w-16 shrink-0 rounded-sm" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink-muted">{t("interest")}</p>
                    <p className="truncate font-semibold">{interestName(draft.interest)}</p>
                  </div>
                  <button type="button" onClick={() => update({ interest: undefined })} className="inline-flex min-h-11 items-center gap-1 rounded-sm px-2 text-sm font-medium text-ink-muted hover:text-ink">
                    <X size={16} strokeWidth={1.5} aria-hidden /> {t("removeInterest")}
                  </button>
                </div>
              )}
              <div>
                <label htmlFor={`${id}-destination`} className="field-label">{t("destination")}</label>
                <p id={`${id}-destination-hint`} className="-mt-0.5 mb-2 text-sm text-ink-muted">{t("destinationHint")}</p>
                <input id={`${id}-destination`} type="text" autoComplete="off" value={draft.destination} onChange={(e) => change("destination", e.target.value)} onBlur={() => blur("destination")} aria-invalid={!!errors.destination || undefined} aria-describedby={described("destination", true)} className="field" />
                {fieldError("destination")}
              </div>
              <WhenPanel value={draft} onChange={(v) => update(v)} />
              <GuestsPanel adults={draft.adults} childCount={draft.children} onChange={(v) => update(v)} />
              <fieldset>
                <legend className="field-label">{t("budget")}</legend>
                <p className="-mt-0.5 mb-3 text-sm text-ink-muted">{t("budgetHint")}</p>
                <div className="flex flex-wrap gap-2">
                  {(["under1k", "1to2k", "2to5k", "over5k", "unsure"] as Budget[]).map((b) => (
                    <label key={b} className={cn("inline-flex min-h-11 cursor-pointer items-center rounded-sm border px-3.5 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)]", draft.budget === b ? "border-ink bg-ink text-paper" : "border-hairline-strong hover:border-ink")}>
                      <input type="radio" name={`${id}-budget`} value={b} checked={draft.budget === b} onChange={() => update({ budget: b })} className="sr-only" />
                      <span className="num">{t(`budgets.${b}`)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor={`${id}-notes`} className="field-label">
                  {t("notes")} <span className="font-normal text-ink-muted">({t("optional")})</span>
                </label>
                <textarea id={`${id}-notes`} rows={4} value={draft.notes} onChange={(e) => update({ notes: e.target.value })} placeholder={t("notesPlaceholder")} className="field resize-y" />
              </div>
            </div>
          )}

          {draft.step === 1 && (
            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor={`${id}-name`} className="field-label">{t("name")}</label>
                <input id={`${id}-name`} type="text" autoComplete="name" autoCapitalize="words" value={draft.name} onChange={(e) => change("name", e.target.value)} onBlur={() => blur("name")} aria-invalid={!!errors.name || undefined} aria-describedby={described("name")} className="field" />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor={`${id}-email`} className="field-label">{t("email")}</label>
                <p id={`${id}-email-hint`} className="-mt-0.5 mb-2 text-sm text-ink-muted">{t("emailHint")}</p>
                <input id={`${id}-email`} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={draft.email} onChange={(e) => change("email", e.target.value)} onBlur={() => blur("email")} aria-invalid={!!errors.email || undefined} aria-describedby={described("email", true)} className="field" />
                {fieldError("email")}
              </div>
              <div>
                <label htmlFor={`${id}-phone`} className="field-label">
                  {t("phone")} <span className="font-normal text-ink-muted">({t("optional")})</span>
                </label>
                <p id={`${id}-phone-hint`} className="-mt-0.5 mb-2 text-sm text-ink-muted">{t("phoneHint")}</p>
                <input id={`${id}-phone`} type="tel" inputMode="tel" autoComplete="tel" value={draft.phone} onChange={(e) => change("phone", e.target.value)} onBlur={() => blur("phone")} aria-invalid={!!errors.phone || undefined} aria-describedby={described("phone", true)} className="field num" />
                {fieldError("phone")}
              </div>
              <fieldset>
                <legend className="field-label">{t("contactPref")}</legend>
                <div className="flex flex-wrap gap-2">
                  {(["email", "whatsapp", "phone"] as Contact[]).map((c) => (
                    <label key={c} className={cn("inline-flex min-h-11 cursor-pointer items-center rounded-sm border px-3.5 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)]", draft.contactPref === c ? "border-ink bg-ink text-paper" : "border-hairline-strong hover:border-ink")}>
                      <input type="radio" name={`${id}-contact`} value={c} checked={draft.contactPref === c} onChange={() => update({ contactPref: c })} className="sr-only" />
                      {t(`contactOptions.${c}`)}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {draft.step === 2 && (
            <div className="mt-8">
              <p className="text-ink-muted">{t("reviewTitle")}</p>
              <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
                {[
                  { step: 0, label: t("destination"), value: [draft.interest && interestName(draft.interest), draft.destination].filter(Boolean).join(" — ") },
                  { step: 0, label: t("when"), value: whenSummary(draft) },
                  { step: 0, label: t("travellers"), value: ts("guestsSummary", { adults: draft.adults, children: draft.children }) },
                  { step: 0, label: t("budget"), value: t(`budgets.${draft.budget}`) },
                  { step: 0, label: t("notes"), value: draft.notes || t("notProvided") },
                  { step: 1, label: t("name"), value: draft.name },
                  { step: 1, label: t("email"), value: draft.email },
                  { step: 1, label: t("phone"), value: draft.phone || t("notProvided") },
                  { step: 1, label: t("contactPref"), value: t(`contactOptions.${draft.contactPref}`) },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[1fr_auto] gap-x-4 py-4 sm:grid-cols-[12rem_1fr_auto]">
                    <dt className="text-sm text-ink-muted">{row.label}</dt>
                    <dd className="col-start-1 row-start-2 break-words sm:col-start-2 sm:row-start-1">{row.value}</dd>
                    <dd className="row-span-2 sm:row-span-1">
                      <button type="button" onClick={() => goTo(row.step)} className="min-h-11 px-1 text-sm font-semibold link-underline">
                        {t("edit")}<span className="sr-only">: {row.label}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {draft.step > 0 && (
              <button type="button" onClick={() => goTo(draft.step - 1)} className="btn btn-ghost">
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> {t("back")}
              </button>
            )}
            <button type="submit" disabled={sending} className="btn btn-primary min-w-40 disabled:opacity-70">
              {draft.step === STEPS - 1 ? (sending ? t("sending") : t("send")) : t("continue")}
              {draft.step < STEPS - 1 && <ArrowRight size={16} strokeWidth={1.5} aria-hidden />}
            </button>
          </div>
          <p className="mt-4 text-sm text-ink-muted">{t("trust")}</p>
        </form>

        <aside className="min-w-0 lg:col-span-4 lg:col-start-9">
          <div className="rounded-lg border border-hairline p-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="font-display text-xl">{th("title")}</p>
            <p className="mt-2 text-sm text-ink-muted">{th("body")}</p>
            <ul className="mt-5 space-y-2 border-t border-hairline pt-5 text-sm">
              <li><a href={contact.whatsapp} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center font-semibold link-underline">WhatsApp</a></li>
              <li><a href={contact.phoneHref} className="num inline-flex min-h-10 items-center font-semibold link-underline">{contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`} className="inline-flex min-h-10 items-center break-all font-semibold link-underline">{contact.email}</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
