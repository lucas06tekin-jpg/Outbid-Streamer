import { platformLabel, platformBadgeColors } from "@/lib/platforms";

export default function PlatformBadge({
  platform,
  className = "",
}: {
  platform: string;
  className?: string;
}) {
  const colors = platformBadgeColors(platform);

  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        colors ? "" : "bg-surface-2 text-muted"
      } ${className}`}
      style={colors ? { backgroundColor: colors.bg, color: colors.text } : undefined}
    >
      {platformLabel(platform)}
    </span>
  );
}
