export type Category = {
  slug: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "gaming", label: "Gaming" },
  { slug: "just-chatting", label: "Just Chatting" },
  { slug: "esports", label: "Esports" },
  { slug: "irl", label: "IRL / Lifestyle" },
  { slug: "music", label: "Music" },
  { slug: "creative", label: "Creative" },
  { slug: "tabletop", label: "Tabletop & Cards" },
  { slug: "sports", label: "Sports" },
  { slug: "other", label: "Other" },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
