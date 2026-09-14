import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const streamers = [
  {
    slug: "nordicgaming",
    name: "NordicGaming",
    platform: "twitch",
    url: "https://twitch.tv/example-nordicgaming",
    description: "Dagliga FPS-strömmar och ranked-grind med svensk chatt.",
    category: "gaming",
    imageUrl: null,
    email: "demo@nordicgaming.example",
    currentBid: 129900,
    status: "PAID",
    clicks: 342,
  },
  {
    slug: "kaffeprat",
    name: "Kaffeprat",
    platform: "kick",
    url: "https://kick.com/example-kaffeprat",
    description: "Avslappnad Just Chatting över en kopp kaffe varje kväll.",
    category: "just-chatting",
    imageUrl: null,
    email: "demo@kaffeprat.example",
    currentBid: 89900,
    status: "PAID",
    clicks: 198,
  },
  {
    slug: "melodimakarn",
    name: "Melodimakarn",
    platform: "youtube",
    url: "https://youtube.com/@example-melodimakarn/live",
    description: "Livemusik, låtskrivande och publikens önskelåtar.",
    category: "musik",
    imageUrl: null,
    email: "demo@melodimakarn.example",
    currentBid: 54900,
    status: "PAID",
    clicks: 87,
  },
  {
    slug: "irlsverige",
    name: "IRL Sverige",
    platform: "tiktok",
    url: "https://tiktok.com/@example-irlsverige/live",
    description: "Utforskar svenska städer live, en promenad i taget.",
    category: "irl",
    imageUrl: null,
    email: "demo@irlsverige.example",
    currentBid: 19900,
    status: "PAID",
    clicks: 22,
  },
];

async function main() {
  for (const streamer of streamers) {
    await prisma.streamer.upsert({
      where: { slug: streamer.slug },
      update: {},
      create: streamer,
    });
  }
  console.log(`Seedade ${streamers.length} streamers.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
