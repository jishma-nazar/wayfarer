"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny persisted store on top of Web Storage, read through useSyncExternalStore so
 * the server render uses the fallback and the client picks up saved state without a
 * hydration mismatch. Tabs stay in sync via the `storage` event.
 */
export interface Store<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  fallback: T;
}

const registry = new Map<string, Store<unknown>>();

export function createStore<T>(key: string, fallback: T, area: "local" | "session" = "local"): Store<T> {
  const existing = registry.get(key);
  if (existing) return existing as Store<T>;

  let raw: string | null | undefined;
  let cache: T = fallback;
  const listeners = new Set<() => void>();
  const storage = () => (area === "local" ? window.localStorage : window.sessionStorage);

  const get = () => {
    try {
      const next = storage().getItem(key);
      if (next !== raw) {
        raw = next;
        cache = next ? (JSON.parse(next) as T) : fallback;
      }
    } catch {
      /* private mode or blocked storage: stay in memory */
    }
    return cache;
  };

  const set: Store<T>["set"] = (next) => {
    const value = typeof next === "function" ? (next as (p: T) => T)(get()) : next;
    cache = value;
    try {
      raw = JSON.stringify(value);
      storage().setItem(key, raw);
    } catch {
      /* ignore quota / privacy errors */
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => e.key === key && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const store: Store<T> = { get, set, subscribe, fallback };
  registry.set(key, store as Store<unknown>);
  return store;
}

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get, () => store.fallback);
}

/**
 * Form state that survives a language/theme switch or an accidental reload
 * (sessionStorage, scoped to the tab).
 */
export function useDraft<T extends object>(key: string, initial: T) {
  const store = createStore<T>(`wf:draft:${key}`, initial, "session");
  const value = useStore(store);
  const update = useCallback(
    (patch: Partial<T> | ((prev: T) => Partial<T>)) =>
      store.set((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) })),
    [store]
  );
  const clear = useCallback(() => store.set(initial), [store, initial]);
  return [value, update, clear] as const;
}
