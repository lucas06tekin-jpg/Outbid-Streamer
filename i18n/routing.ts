import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sv"],
  defaultLocale: "sv",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
