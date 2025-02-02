// seed.ts

import { saltAndHashPassword } from "@/lib/saltAndHash";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create users
  const user1 = await db.user.create({
    data: {
      email: "user1@example.com",
      name: "User One",
      password: await saltAndHashPassword("password1"), // Use hashed passwords in real implementations
    },
  });

  const user2 = await db.user.create({
    data: {
      email: "user2@example.com",
      name: "User Two",
      password: await saltAndHashPassword("password2"),
    },
  });

  // Create 10 shops
  const shops = await Promise.all(
    [
      "TechHub Electronics",
      "Fresh Foods Market",
      "Fashion Forward",
      "Home Essentials",
      "Sports World",
      "Garden Center",
      "Pet Paradise",
      "Office Supplies Co",
      "Beauty & Beyond",
      "Auto Parts Plus",
    ].map((shopName) =>
      db.shop.create({
        data: { name: shopName },
      })
    )
  );

  // Create 10 suppliers
  const suppliers = await Promise.all(
    [
      "Global Electronics Ltd",
      "Fresh Produce Co",
      "Textile Industries",
      "Home Goods Manufacturing",
      "Sports Equipment Inc",
      "Garden Supplies Direct",
      "Pet Products International",
      "Office Solutions Corp",
      "Beauty Products Ltd",
      "Auto Parts Manufacturing",
    ].map((supplierName) =>
      db.supplier.create({
        data: { name: supplierName },
      })
    )
  );

  // Link users and shops (ShopUser) - giving each user some shops to manage
  const shopUserData = shops.map((shop, index) => ({
    shopId: shop.id,
    userId: index < 5 ? user1.id : user2.id,
    role: index % 3 === 0 ? "Owner" : "Manager",
  }));

  await db.shopUser.createMany({
    data: shopUserData,
  });

  // Create products with realistic names and prices
  const productsData = [
    { name: "4K Smart TV", price: 69999, category: "Electronics" },
    { name: "Organic Bananas (1lb)", price: 299, category: "Groceries" },
    { name: "Designer Jeans", price: 7999, category: "Fashion" },
    { name: "Memory Foam Pillow", price: 2999, category: "Home" },
    { name: "Basketball", price: 2499, category: "Sports" },
    { name: "Garden Tools Set", price: 4999, category: "Garden" },
    { name: "Premium Dog Food", price: 3999, category: "Pets" },
    { name: "Ergonomic Office Chair", price: 19999, category: "Office" },
    { name: "Luxury Face Cream", price: 5999, category: "Beauty" },
    { name: "Car Battery", price: 12999, category: "Auto" },
  ];

  // Create multiple products for each shop with different suppliers
  for (const shop of shops) {
    await db.product.createMany({
      data: productsData.map((product, index) => ({
        name: `${product.name} - ${shop.name}`,
        price: product.price,
        shopId: shop.id,
        supplierId: suppliers[index].id,
      })),
    });
  }

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
