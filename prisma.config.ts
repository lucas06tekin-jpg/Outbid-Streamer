import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // CLI-kommandon (migrate, studio, db seed) pratar direkt mot Postgres,
  // förbi Supabases connection pooler. Appen i körtid (lib/prisma.ts) använder
  // istället den poolade DATABASE_URL via driver-adaptern.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
