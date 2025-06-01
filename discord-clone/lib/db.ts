import { PrismaClient } from '@prisma/client';

interface CustomGlobal extends Global {
    prisma?: PrismaClient;
}

const globalPrisma = globalThis as CustomGlobal;

export const db = globalPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalPrisma.prisma = db;
}