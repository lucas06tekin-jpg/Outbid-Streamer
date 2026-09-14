import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // CLI commands (migrate, studio, db seed) talk directly to Postgres,
  // bypassing Supabase's connection pooler. The app at runtime (lib/prisma.ts)
  // instead uses the pooled DATABASE_URL via the driver adapter.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
