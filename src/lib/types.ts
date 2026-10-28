export const MOODS = ["slow", "food", "coast", "mountains", "culture", "family"] as const;
export type Mood = (typeof MOODS)[number];

export const SEARCH_TABS = ["all", "stays", "experiences", "flights", "packages"] as const;
export type SearchTab = (typeof SEARCH_TABS)[number];

export type ItemKind = "destination" | "stay" | "experience" | "package";

/** An Unsplash photo id plus an optional CSS object-position for art-directed crops. */
export interface Photo {
  id: string;
  focus?: string;
}

export interface Destination {
  id: string;
  lat: number;
  lon: number;
  timeZone: string;
  /** Lowest nightly stay price we sell there, USD. */
  fromPrice: number;
  photo: Photo;
  trending?: boolean;
  /** Order on the map route; omitted = not on the map. */
  mapOrder?: number;
  /** Alternative spellings in any language — used by the typo-tolerant search. */
  aliases: string[];
}

export interface Stay {
  id: string;
  destinationId: string;
  photo: Photo;
  pricePerNight: number;
  rating: number;
  reviews: number;
  freeCancellation: boolean;
  favorite?: boolean;
  editorsPick?: boolean;
}

export interface Experience {
  id: string;
  destinationId: string;
  photo: Photo;
  price: number;
  hours: number;
  moods: Mood[];
  rating: number;
  reviews: number;
  freeCancellation: boolean;
  favorite?: boolean;
}

export interface TripPackage {
  id: string;
  destinationId: string;
  fromCode: string;
  toCode: string;
  nights: number;
  price: number;
  fareCode: string;
  departures: string; // ISO month of next departure, e.g. "2027-03"
  rating: number;
  reviews: number;
}

export interface Story {
  id: string;
  destinationId: string;
  photo: Photo;
  rating: number;
}

export interface Article {
  id: string;
  photo: Photo;
  readMinutes: number;
  date: string; // ISO date
}
