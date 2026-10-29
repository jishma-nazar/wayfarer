"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent } from "react";
import { contact, newsletterPhoto } from "@/lib/data";
import { Photo } from "@/components/ui/Photo";
import { useDraft } from "@/lib/store";
import { validateEmail } from "@/lib/validation";

export function Newsletter() {
  const t = useTranslations("home.newsletter");
  const tv = useTranslations("validation");
  const id = useId();
  const [draft, update] = useDraft("newsletter", { email: "", done: false });
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const success = useRef<HTMLDivElement>(null);

  const check = (value: string) => {
    const key = validateEmail(value);
    setError(key ? tv(key) : undefined);
    return !key;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!check(draft.email)) {
      input.current?.focus();
      return;
    }
    update({ done: true });
    requestAnimationFrame(() => success.current?.focus());
  };

  return (
    <section aria-labelledby={`${id}-title`} className="container-x pb-[var(--section-y)]">
      <div className="theme-dark relative isolate grid gap-8 overflow-hidden rounded-[32px] px-6 py-14 sm:px-12 lg:grid-cols-12 lg:items-end lg:px-16 lg:py-24">
        <Photo photo={newsletterPhoto} alt="" sizes="(min-width: 1440px) 1360px, 100vw" className="absolute inset-0 -z-10 h-full" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/85 via-black/55 to-black/20" />
        <h2 id={`${id}-title`} className="t-h1 lg:col-span-7">{t("title")}</h2>
        <div className="lg:col-span-5">
          {draft.done ? (
            <div ref={success} tabIndex={-1} role="status" className="outline-none">
              <p className="flex items-center gap-2 font-display text-2xl">
                <Check size={22} strokeWidth={1.5} className="text-olive" aria-hidden /> {t("successTitle")}
              </p>
              <p className="mt-2 text-ink-muted">{t("successBody", { email: contact.email })}</p>
              <button type="button" onClick={() => update({ done: false, email: "" })} className="mt-3 min-h-11 text-sm font-semibold link-underline">
                {t("again")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor={`${id}-email`} className="field-label">{t("label")}</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  ref={input}
                  id={`${id}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={t("placeholder")}
                  value={draft.email}
                  onChange={(e) => {
                    update({ email: e.target.value });
                    if (touched && error) check(e.target.value);
                  }}
                  onBlur={() => {
                    if (draft.email) {
                      setTouched(true);
                      check(draft.email);
                    }
                  }}
                  aria-invalid={!!error || undefined}
                  aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
                  className="field bg-white/10 backdrop-blur-md sm:flex-1"
                />
                <button type="submit" className="btn btn-primary h-[50px] sm:px-7">{t("submit")}</button>
              </div>
              {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
              <p id={`${id}-hint`} className="mt-2 text-sm text-ink-muted">{t("privacy")}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
