import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.DATABASE_URL
            : process.env.DIRECT_URL,
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;

export default db;
