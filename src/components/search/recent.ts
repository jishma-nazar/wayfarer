"use client";

import { recentStore } from "@/lib/saved";
import { useStore } from "@/lib/store";

export { recentStore };
export const useSavedRecent = () => useStore(recentStore);
