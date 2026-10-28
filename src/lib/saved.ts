"use client";

import { useCallback } from "react";
import type { ItemKind } from "./types";
import { createStore, useStore } from "./store";

export interface SavedItem {
  kind: Exclude<ItemKind, "destination"> | "destination";
  id: string;
  at: number;
}

const EMPTY: SavedItem[] = [];
export const savedStore = createStore<SavedItem[]>("wf:saved", EMPTY);

export function useSaved() {
  const items = useStore(savedStore);
  const isSaved = useCallback(
    (kind: SavedItem["kind"], id: string) => items.some((i) => i.kind === kind && i.id === id),
    [items]
  );
  const toggle = useCallback((kind: SavedItem["kind"], id: string) => {
    savedStore.set((prev) =>
      prev.some((i) => i.kind === kind && i.id === id)
        ? prev.filter((i) => !(i.kind === kind && i.id === id))
        : [{ kind, id, at: Date.now() }, ...prev]
    );
  }, []);
  const restore = useCallback((item: SavedItem) => {
    savedStore.set((prev) => (prev.some((i) => i.kind === item.kind && i.id === item.id) ? prev : [item, ...prev]));
  }, []);
  return { items, isSaved, toggle, restore };
}

export interface TripEnquiry {
  ref: string;
  sentAt: number;
  destination: string;
  interest?: { kind: SavedItem["kind"]; id: string };
  when: string;
  checkIn?: string;
  checkOut?: string;
  adults: number;
  children: number;
  email: string;
}

const NO_TRIPS: TripEnquiry[] = [];
export const tripsStore = createStore<TripEnquiry[]>("wf:trips", NO_TRIPS);

const NO_RECENT: string[] = [];
export const recentStore = createStore<string[]>("wf:recent-searches", NO_RECENT);
export function pushRecent(term: string) {
  const clean = term.trim();
  if (!clean) return;
  recentStore.set((prev) => [clean, ...prev.filter((p) => p.toLowerCase() !== clean.toLowerCase())].slice(0, 5));
}
