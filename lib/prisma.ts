import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();

    // Add shutdown hook
    process.on("beforeExit", async () => {
      await global.prisma?.$disconnect();
    });
  }
  prisma = global.prisma;
}

export default prisma;
