import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|go|admin|_next|icon|apple-icon|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
