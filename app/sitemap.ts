import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const staticPaths = [
    "",
    "/buda",
    "/kategorier",
    "/om",
    "/villkor",
    "/integritetspolicy",
    "/cookies",
    "/kontakt",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}${locale === routing.defaultLocale ? "" : `/${locale}`}${path}`,
      changeFrequency: path === "" ? "hourly" : "monthly",
      priority: path === "" ? 1 : 0.5,
    }))
  );

  const streamers = await prisma.streamer.findMany({
    where: { status: "PAID" },
    select: { slug: true, updatedAt: true },
  });

  const streamerEntries: MetadataRoute.Sitemap = streamers.flatMap((s) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}${locale === routing.defaultLocale ? "" : `/${locale}`}/kanal/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...streamerEntries];
}
