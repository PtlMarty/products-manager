// seed.ts

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create users
  const user1 = await db.user.create({
    data: {
      email: "user1@example.com",
      name: "User One",
      password: "hashed_password1", // Use hashed passwords in real implementations
    },
  });

  const user2 = await db.user.create({
    data: {
      email: "user2@example.com",
      name: "User Two",
      password: "hashed_password2",
    },
  });

  // Create shops
  const shop1 = await db.shop.create({
    data: {
      name: "Shop One",
    },
  });

  const shop2 = await db.shop.create({
    data: {
      name: "Shop Two",
    },
  });

  // Link users and shops (ShopUser)
  await db.shopUser.createMany({
    data: [
      { shopId: shop1.id, userId: user1.id, role: "Owner" },
      { shopId: shop1.id, userId: user2.id, role: "Manager" },
      { shopId: shop2.id, userId: user2.id, role: "Owner" },
    ],
  });

  // Create suppliers
  const supplier1 = await db.supplier.create({
    data: {
      name: "Supplier One",
    },
  });

  const supplier2 = await db.supplier.create({
    data: {
      name: "Supplier Two",
    },
  });

  // Create products for Shop One
  await db.product.createMany({
    data: [
      {
        name: "Product 1 for Shop One",
        price: 1000, // In cents (for example, $10.00)
        shopId: shop1.id,
        supplierId: supplier1.id,
      },
      {
        name: "Product 2 for Shop One",
        price: 1500, // $15.00
        shopId: shop1.id,
        supplierId: supplier2.id,
      },
    ],
  });

  // Create products for Shop Two
  await db.product.createMany({
    data: [
      {
        name: "Product 1 for Shop Two",
        price: 2000, // $20.00
        shopId: shop2.id,
        supplierId: supplier1.id,
      },
    ],
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
