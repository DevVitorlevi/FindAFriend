import { prisma } from "@/lib/prisma.js";

export async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE
      "pet_images",
      "pets",
      "orgs"
    RESTART IDENTITY CASCADE;
  `);
}
