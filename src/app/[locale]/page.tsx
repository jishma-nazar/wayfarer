import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Suspense } from "react";
import { contact } from "@/lib/data";
import { SITE_URL, alternatesFor } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Trending } from "@/components/sections/Trending";
import { EditorsPicks } from "@/components/sections/EditorsPicks";
import { ExperiencesByMood } from "@/components/sections/ExperiencesByMood";
import { Packages } from "@/components/sections/Packages";
import { MapMoment } from "@/components/sections/MapMoment";
import { WhyUs } from "@/components/sections/WhyUs";
import { Stories } from "@/components/sections/Stories";
import { JournalTeaser } from "@/components/sections/JournalTeaser";
import { Faq } from "@/components/sections/Faq";
import { Newsletter } from "@/components/sections/Newsletter";
import { Marquee } from "@/components/sections/Marquee";
import { Gallery } from "@/components/sections/Gallery";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternatesFor(await rootLocale(), "/") };
}

export default async function HomePage() {
  const locale = await rootLocale();
  const t = await getTranslations("meta");
  const tf = await getTranslations("footer");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: t("siteName"),
    description: t("description"),
    url: `${SITE_URL}/${locale}`,
    telephone: contact.phone,
    email: contact.email,
    address: { "@type": "PostalAddress", streetAddress: tf("address") },
    aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, reviewCount: 3214 },
    openingHours: "Mo-Su 00:00-23:59",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      {/* Each Suspense boundary is a separate hydration unit: React hydrates the hero first and
          the rest in small interruptible chunks, keeping the main thread responsive on phones. */}
      <Marquee />
      <Suspense><Trending /></Suspense>
      <Suspense><EditorsPicks /></Suspense>
      <Suspense><ExperiencesByMood /></Suspense>
      <Suspense><Packages /></Suspense>
      <Suspense><MapMoment /></Suspense>
      <WhyUs />
      <Suspense><Gallery /></Suspense>
      <Suspense><Stories /></Suspense>
      <JournalTeaser />
      <Faq />
      <Suspense><Newsletter /></Suspense>
    </>
  );
}
