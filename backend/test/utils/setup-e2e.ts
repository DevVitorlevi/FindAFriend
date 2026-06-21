import { app } from "@/app.js";
import { prisma } from "@/lib/prisma.js";
import { resetDatabase } from "./reset-database.js";

let isSetup = false;
export async function setupE2E() {
  if (!isSetup) {
    await app.ready();
    isSetup = true;
  }

  await resetDatabase();
  return app;
}

export async function teardownE2E() {
  await prisma.$disconnect();
  await app.close();
}
