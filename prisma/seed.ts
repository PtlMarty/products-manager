// seed.ts
import { saltAndHashPassword } from "@/lib/saltAndHash";
import { PrismaClient } from "@prisma/client";

const seedClient = new PrismaClient({
  log: ["error", "warn"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Seeding database...");

  // Clean up existing data
  console.log("Cleaning up existing data...");
  await seedClient.orderItem.deleteMany({});
  await seedClient.order.deleteMany({});
  await seedClient.product.deleteMany({});
  await seedClient.shopSupplier.deleteMany({});
  await seedClient.shopUser.deleteMany({});
  await seedClient.supplier.deleteMany({});
  await seedClient.shop.deleteMany({});
  await seedClient.session.deleteMany({});
  await seedClient.user.deleteMany({});
  console.log("Cleanup completed.");

  // Create users with different roles
  const admin = await seedClient.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: await saltAndHashPassword("admin123"),
      role: "ADMIN",
    },
  });

  const seller = await seedClient.user.create({
    data: {
      email: "seller@example.com",
      name: "Seller User",
      password: await saltAndHashPassword("seller123"),
      role: "SELLER",
    },
  });

  const buyer = await seedClient.user.create({
    data: {
      email: "buyer@example.com",
      name: "Buyer User",
      password: await saltAndHashPassword("buyer123"),
      role: "BUYER",
    },
  });

  // Create shops
  const shops = await Promise.all(
    [
      "TechHub Electronics",
      "Fresh Foods Market",
      "Fashion Forward",
      "Home Essentials",
      "Sports World",
    ].map((shopName) =>
      seedClient.shop.create({
        data: { name: shopName },
      })
    )
  );

  // Create suppliers with complete information
  const suppliers = await Promise.all(
    [
      {
        name: "Global Electronics Ltd",
        email: "contact@globalelectronics.com",
        phone: "+1-555-0123",
        address: "123 Tech Street, Silicon Valley, CA",
      },
      {
        name: "Fresh Produce Co",
        email: "info@freshproduce.com",
        phone: "+1-555-0124",
        address: "456 Farm Road, Agricultural District",
      },
      {
        name: "Textile Industries",
        email: "contact@textileind.com",
        phone: "+1-555-0125",
        address: "789 Fashion Ave, Design District",
      },
      {
        name: "Home Goods Manufacturing",
        email: "sales@homegoods.com",
        phone: "+1-555-0126",
        address: "321 Industrial Park",
      },
      {
        name: "Sports Equipment Inc",
        email: "info@sportsequip.com",
        phone: "+1-555-0127",
        address: "654 Stadium Drive",
      },
    ].map((supplierData) =>
      seedClient.supplier.create({
        data: supplierData,
      })
    )
  );

  // Link shops with suppliers
  for (const shop of shops) {
    // Each shop gets 2-3 suppliers
    const shopSuppliers = suppliers.slice(0, Math.floor(Math.random() * 2) + 2);
    await Promise.all(
      shopSuppliers.map((supplier) =>
        seedClient.shopSupplier.create({
          data: {
            shopId: shop.id,
            supplierId: supplier.id,
          },
        })
      )
    );
  }

  // Link users and shops with proper roles
  await Promise.all([
    // Admin gets access to all shops
    ...shops.map((shop) =>
      seedClient.shopUser.create({
        data: {
          shopId: shop.id,
          userId: admin.id,
          role: "ADMIN",
        },
      })
    ),
    // Seller gets access to first 3 shops
    ...shops.slice(0, 3).map((shop) =>
      seedClient.shopUser.create({
        data: {
          shopId: shop.id,
          userId: seller.id,
          role: "SELLER",
        },
      })
    ),
    // Buyer gets access to all shops
    ...shops.map((shop) =>
      seedClient.shopUser.create({
        data: {
          shopId: shop.id,
          userId: buyer.id,
          role: "BUYER",
        },
      })
    ),
  ]);

  // Create products with stock
  const productsData = [
    { name: "4K Smart TV", price: 69999, stock: 10, category: "Electronics" },
    { name: "Organic Bananas", price: 299, stock: 100, category: "Groceries" },
    { name: "Designer Jeans", price: 7999, stock: 50, category: "Fashion" },
    { name: "Memory Foam Pillow", price: 2999, stock: 30, category: "Home" },
    { name: "Basketball", price: 2499, stock: 25, category: "Sports" },
  ];

  // Create products for each shop with different suppliers
  const createdProducts = await Promise.all(
    shops.flatMap((shop) =>
      productsData.map((product, index) =>
        seedClient.product.create({
          data: {
            name: `${product.name} - ${shop.name}`,
            price: product.price,
            stock: product.stock,
            shopId: shop.id,
            supplierId: suppliers[index % suppliers.length].id,
          },
        })
      )
    )
  );

  // Create sample orders
  const orderStatuses = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
  ] as const;

  // Create 5 sample orders
  for (let i = 0; i < 5; i++) {
    const shop = shops[i % shops.length];
    const supplier = suppliers[i % suppliers.length];
    const shopProducts = createdProducts.filter((p) => p.shopId === shop.id);

    // Create order
    const order = await seedClient.order.create({
      data: {
        shopId: shop.id,
        supplierId: supplier.id,
        userId: buyer.id,
        status: orderStatuses[i % orderStatuses.length],
        totalAmount: 0, // Will be updated after adding items
      },
    });

    // Add 2-3 products to each order
    const orderItems = await Promise.all(
      shopProducts.slice(0, 2 + (i % 2)).map((product) =>
        seedClient.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: 1 + Math.floor(Math.random() * 5),
            price: product.price,
          },
        })
      )
    );

    // Calculate and update total amount
    const totalAmount = orderItems.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    await seedClient.order.update({
      where: { id: order.id },
      data: { totalAmount },
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
    await seedClient.$disconnect();
  });
