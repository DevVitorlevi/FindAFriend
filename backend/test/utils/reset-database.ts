import { prisma } from "@/lib/prisma.js";

export async function resetDatabase() {
  try {
    await prisma.$executeRaw`TRUNCATE TABLE "pet_images" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "pets" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "orgs" RESTART IDENTITY CASCADE;`;

    await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  }
}

export async function closeDatabase() {
  await prisma.$disconnect();
}
