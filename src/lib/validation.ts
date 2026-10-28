/** Return a `validation.*` message key, or undefined when valid. */
export function validateEmail(value: string) {
  const v = value.trim();
  if (!v) return "emailRequired" as const;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "emailInvalid" as const;
  return undefined;
}

export function validatePhone(value: string) {
  const v = value.trim();
  if (!v) return undefined; // optional
  if (!/^\+?[\d\s().-]{7,20}$/.test(v) || v.replace(/\D/g, "").length < 7) return "phoneInvalid" as const;
  return undefined;
}

export function validateRequired(value: string, key: "nameRequired" | "destinationRequired") {
  return value.trim() ? undefined : key;
}
