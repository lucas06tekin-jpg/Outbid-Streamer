export type Platform = {
  slug: string;
  label: string;
};

export const PLATFORMS: Platform[] = [
  { slug: "twitch", label: "Twitch" },
  { slug: "youtube", label: "YouTube" },
  { slug: "kick", label: "Kick" },
  { slug: "tiktok", label: "TikTok" },
  { slug: "other", label: "Other platform" },
];

export function platformLabel(slug: string): string {
  return PLATFORMS.find((p) => p.slug === slug)?.label ?? slug;
}
