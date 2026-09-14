function lastPathSegment(url: string): string {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    return "";
  }
}

export type EmbedInfo = { kind: "twitch" | "kick" | "youtube"; src: string } | { kind: "none" };

/** Best-effort live embed for a streamer's channel URL. Twitch/Kick can be embedded
 *  from just the channel slug in the URL. YouTube's live-by-channel embed needs the
 *  raw channel ID (UC...), which a plain @handle URL doesn't give us - falls back to
 *  "none" when we can't resolve one. TikTok has no public live-embed iframe. */
export function getEmbedInfo(platform: string, url: string, parentHost: string): EmbedInfo {
  if (platform === "twitch") {
    const channel = lastPathSegment(url);
    if (!channel) return { kind: "none" };
    return {
      kind: "twitch",
      src: `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parentHost)}&muted=true`,
    };
  }

  if (platform === "kick") {
    const channel = lastPathSegment(url);
    if (!channel) return { kind: "none" };
    return {
      kind: "kick",
      src: `https://player.kick.com/${encodeURIComponent(channel)}?autoplay=true&muted=true`,
    };
  }

  if (platform === "youtube") {
    const match = url.match(/\/channel\/(UC[\w-]{10,})/);
    if (!match) return { kind: "none" };
    return {
      kind: "youtube",
      src: `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(match[1])}&autoplay=1&mute=1`,
    };
  }

  return { kind: "none" };
}

/** Live chat embed, when the platform publicly supports one. Twitch's chat embed
 *  needs only the channel slug and the same "parent" domain as the video embed.
 *  Kick/YouTube/TikTok have no equivalent public chat-only iframe, so this
 *  returns null for them rather than guessing at an undocumented URL. */
export function getChatEmbedInfo(platform: string, url: string, parentHost: string): string | null {
  if (platform === "twitch") {
    const channel = lastPathSegment(url);
    if (!channel) return null;
    return `https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat?parent=${encodeURIComponent(parentHost)}`;
  }

  return null;
}
