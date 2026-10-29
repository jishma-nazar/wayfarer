"use client";

import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useDraft } from "@/lib/store";
import { validateEmail, validateRequired } from "@/lib/validation";
import { cn } from "@/lib/cn";

type Mode = "signIn" | "signUp" | "forgot";
type Field = "name" | "email" | "password" | "terms";

/** 0–4: length, a number, mixed case, a symbol. */
function strength(pw: string) {
  if (!pw) return 0;
  let s = pw.length >= 8 ? 1 : 0;
  if (/\d/.test(pw)) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.max(1, s);
}

/**
 * Sign in / create account / reset password — UI only. Submitting validates, pauses briefly
 * and shows the success state; no account is created. Name and email survive a language
 * switch (session draft); the password never leaves component state.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations("auth");
  const tm = useTranslations(`auth.${mode}`);
  const tv = useTranslations("validation");
  const id = useId();
  const [draft, update] = useDraft(`auth-${mode}`, { name: "", email: "", remember: true, news: false, terms: false });
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  const fields: Field[] = mode === "signUp" ? ["name", "email", "password", "terms"] : mode === "signIn" ? ["email", "password"] : ["email"];

  const validate = (f: Field, value?: string | boolean): string | undefined => {
    if (f === "name") {
      const k = validateRequired(String(value ?? draft.name), "nameRequired");
      return k ? tv(k) : undefined;
    }
    if (f === "email") {
      const k = validateEmail(String(value ?? draft.email));
      return k ? tv(k) : undefined;
    }
    if (f === "password") {
      const pw = String(value ?? password);
      if (!pw) return t("errors.passwordRequired");
      if (mode === "signUp" && (pw.length < 8 || !/\d/.test(pw))) return t("errors.passwordShort");
      return undefined;
    }
    return (value ?? draft.terms) ? undefined : t("errors.termsRequired");
  };
  const blur = (f: Field) => setErrors((e) => ({ ...e, [f]: validate(f) }));
  const recheck = (f: Field, v: string | boolean) => errors[f] && setErrors((e) => ({ ...e, [f]: validate(f, v) }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = Object.fromEntries(fields.map((f) => [f, validate(f)])) as Partial<Record<Field, string>>;
    setErrors(found);
    const bad = fields.find((f) => found[f]);
    if (bad) {
      document.getElementById(`${id}-${bad}`)?.focus();
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setDone(true);
      setPassword("");
      requestAnimationFrame(() => heading.current?.focus());
    }, 700);
  };

  const firstName = draft.name.trim().split(" ")[0] || draft.email.split("@")[0];

  if (done) {
    return (
      <div className="fade-up" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-ink">
          <Check size={26} strokeWidth={2} aria-hidden />
        </span>
        <h1 ref={heading} tabIndex={-1} className="t-h2 mt-8 outline-none">{tm("successTitle", { name: firstName })}</h1>
        <p className="t-lead mt-4 text-ink-muted">{tm("successBody", { name: firstName, email: draft.email })}</p>
        <p className="mt-6 rounded-[14px] bg-paper-2 px-4 py-3 text-sm text-ink-muted">{t("demo")}</p>
        <Link href={mode === "forgot" ? "/sign-in" : "/"} className="btn btn-primary mt-8">
          {mode === "forgot" ? tm("back") : t("continue")} <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    );
  }

  const err = (f: Field) => errors[f] && <p id={`${id}-${f}-err`} className="field-error">{errors[f]}</p>;
  const level = strength(password);
  const levelName = (["weak", "weak", "fair", "good", "strong"] as const)[level];

  return (
    <div>
      <h1 className="t-h1">{tm("title")}</h1>
      <p className="t-lead mt-4 text-ink-muted">{tm("dek")}</p>

      {mode !== "forgot" && (
        <>
          <div className="mt-8 grid gap-3">
            <SocialButton label={t("google")} icon={<GoogleMark />} />
            <SocialButton label={t("apple")} icon={<AppleMark />} />
          </div>
          <div className="my-7 flex items-center gap-4 text-sm text-ink-faint">
            <span aria-hidden className="h-px flex-1 bg-hairline" />
            {t("or")}
            <span aria-hidden className="h-px flex-1 bg-hairline" />
          </div>
        </>
      )}

      <form onSubmit={submit} noValidate className={cn("space-y-5", mode === "forgot" && "mt-8")}>
        {mode === "signUp" && (
          <div>
            <label htmlFor={`${id}-name`} className="field-label">{t("name")}</label>
            <input id={`${id}-name`} type="text" autoComplete="name" autoCapitalize="words" value={draft.name}
              onChange={(e) => { update({ name: e.target.value }); recheck("name", e.target.value); }} onBlur={() => blur("name")}
              aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? `${id}-name-err` : undefined} className="field" />
            {err("name")}
          </div>
        )}
        <div>
          <label htmlFor={`${id}-email`} className="field-label">{t("email")}</label>
          <input id={`${id}-email`} type="email" inputMode="email" autoComplete={mode === "signUp" ? "email" : "username"} autoCapitalize="none" spellCheck={false} value={draft.email}
            onChange={(e) => { update({ email: e.target.value }); recheck("email", e.target.value); }} onBlur={() => draft.email && blur("email")}
            aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? `${id}-email-err` : undefined} className="field" />
          {err("email")}
        </div>
        {mode !== "forgot" && (
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={`${id}-password`} className="field-label">{t("password")}</label>
              {mode === "signIn" && (
                <Link href="/forgot-password" className="text-sm font-medium text-accent-strong link-underline">{tm("forgot")}</Link>
              )}
            </div>
            <div className="relative">
              <input id={`${id}-password`} type={showPw ? "text" : "password"} autoComplete={mode === "signUp" ? "new-password" : "current-password"} value={password}
                onChange={(e) => { setPassword(e.target.value); recheck("password", e.target.value); }} onBlur={() => password && blur("password")}
                aria-invalid={!!errors.password || undefined}
                aria-describedby={[mode === "signUp" ? `${id}-pw-hint` : "", errors.password ? `${id}-password-err` : ""].filter(Boolean).join(" ") || undefined}
                className="field pr-14" />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-pressed={showPw}
                className="absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-paper hover:text-ink">
                {showPw ? <EyeOff size={18} strokeWidth={1.75} aria-hidden /> : <Eye size={18} strokeWidth={1.75} aria-hidden />}
                <span className="sr-only">{showPw ? t("hide") : t("show")}</span>
              </button>
            </div>
            {mode === "signUp" && (
              <>
                <div aria-hidden className="mt-3 grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={cn("h-1.5 rounded-full transition-colors duration-300", password && i <= level ? (level <= 1 ? "bg-[#e5484d]" : level === 2 ? "bg-[#f5a524]" : "bg-olive") : "bg-hairline")} />
                  ))}
                </div>
                <p id={`${id}-pw-hint`} className="mt-2 text-sm text-ink-muted">
                  {password ? <span aria-live="polite">{t("strength.label", { level: t(`strength.${levelName}`) })} · </span> : null}
                  {t("passwordHint")}
                </p>
              </>
            )}
            {err("password")}
          </div>
        )}

        {mode === "signIn" && <Checkbox checked={draft.remember} onChange={(v) => update({ remember: v })} label={tm("remember")} />}
        {mode === "signUp" && (
          <div className="space-y-2">
            <Checkbox
              id={`${id}-terms`}
              checked={draft.terms}
              onChange={(v) => { update({ terms: v }); recheck("terms", v); }}
              invalid={!!errors.terms}
              describedBy={errors.terms ? `${id}-terms-err` : undefined}
              label={tm.rich("terms", {
                terms: (c) => <Link href="/journal" className="font-medium underline underline-offset-2">{c}</Link>,
                privacy: (c) => <Link href="/journal" className="font-medium underline underline-offset-2">{c}</Link>,
              })}
            />
            {err("terms")}
            <Checkbox checked={draft.news} onChange={(v) => update({ news: v })} label={tm("news")} />
          </div>
        )}

        <button type="submit" disabled={sending} className="btn btn-primary h-[52px] w-full text-base disabled:opacity-70">
          {sending ? t("sending") : tm("submit")}
          {!sending && <ArrowRight size={17} strokeWidth={1.75} aria-hidden />}
        </button>
      </form>

      <p className="mt-8 text-center text-ink-muted">
        {mode === "forgot" ? (
          <Link href="/sign-in" className="font-semibold text-ink link-underline">{tm("back")}</Link>
        ) : (
          <>
            {tm("switch")}{" "}
            <Link href={mode === "signIn" ? "/sign-up" : "/sign-in"} className="font-semibold text-ink link-underline">{tm("switchLink")}</Link>
          </>
        )}
      </p>
    </div>
  );
}

function Checkbox({ checked, onChange, label, id, invalid, describedBy }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; id?: string; invalid?: boolean; describedBy?: string }) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-start gap-3 py-1 text-[0.9375rem]">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={invalid || undefined} aria-describedby={describedBy} className="peer sr-only" />
      <span aria-hidden className={cn(
        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
        checked ? "border-accent bg-accent text-accent-ink" : invalid ? "border-accent-strong" : "border-hairline-strong group-hover:border-ink"
      )}>
        {checked && <Check size={13} strokeWidth={2.5} />}
      </span>
      <span className="text-ink-muted">{label}</span>
    </label>
  );
}

function SocialButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button type="button" className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full border border-hairline-strong bg-surface px-4 text-[0.9375rem] font-semibold transition-colors hover:border-ink">
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8.1z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8C3.9 20.5 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9s-2.1-.9-3.4-.9c-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8 2.3-1.3 3.1-2.6c1-1.5 1.4-2.9 1.4-3-.1 0-2.8-1.1-2.8-4.2zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z" />
    </svg>
  );
}
