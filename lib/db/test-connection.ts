import { PrismaClient } from "@prisma/client";

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL + "&sslmode=require",
      },
    },
  });

  try {
    // Attempt to connect and perform a simple query
    const result =
      await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("Database connection successful!");
    console.log("Query result:", result);
  } catch (error) {
    console.error("Failed to connect to the database:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
