import { prisma } from '@/lib/prisma.js'

export async function resetDatabase() {
  await prisma.petImage.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.org.deleteMany()
}

export async function closeDatabase() {
  await prisma.$disconnect()
}