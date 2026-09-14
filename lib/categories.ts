export type Category = {
  slug: string;
  sv: string;
  en: string;
};

export const CATEGORIES: Category[] = [
  { slug: "gaming", sv: "Gaming", en: "Gaming" },
  { slug: "just-chatting", sv: "Just Chatting", en: "Just Chatting" },
  { slug: "esport", sv: "Esport", en: "Esports" },
  { slug: "irl", sv: "IRL / Livsstil", en: "IRL / Lifestyle" },
  { slug: "musik", sv: "Musik", en: "Music" },
  { slug: "kreativt", sv: "Kreativt", en: "Creative" },
  { slug: "bordsspel", sv: "Bord- & kortspel", en: "Tabletop & Cards" },
  { slug: "sport", sv: "Sport", en: "Sports" },
  { slug: "ovrigt", sv: "Övrigt", en: "Other" },
];

export function categoryLabel(slug: string, locale: string): string {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return slug;
  return locale === "en" ? cat.en : cat.sv;
}
