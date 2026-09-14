export type Platform = {
  slug: string;
  label: string;
  badgeBg?: string;
  badgeText?: string;
};

export const PLATFORMS: Platform[] = [
  { slug: "twitch", label: "Twitch", badgeBg: "#9147FF", badgeText: "#ffffff" },
  { slug: "youtube", label: "YouTube", badgeBg: "#FF0000", badgeText: "#ffffff" },
  { slug: "kick", label: "Kick", badgeBg: "#53FC18", badgeText: "#0a0a0a" },
  { slug: "tiktok", label: "TikTok", badgeBg: "#FE2C55", badgeText: "#ffffff" },
  { slug: "other", label: "Other platform" },
];

export function platformLabel(slug: string): string {
  return PLATFORMS.find((p) => p.slug === slug)?.label ?? slug;
}

/** Brand-colored badge styling for a platform, or null for platforms without one
 *  (falls back to the neutral badge style). */
export function platformBadgeColors(slug: string): { bg: string; text: string } | null {
  const platform = PLATFORMS.find((p) => p.slug === slug);
  if (!platform?.badgeBg || !platform.badgeText) return null;
  return { bg: platform.badgeBg, text: platform.badgeText };
}
