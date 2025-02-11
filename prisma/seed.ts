// seed.ts
import { OrderStatus, PrismaClient, Role } from "@prisma/client";
import { saltAndHashPassword } from "../lib/utils/saltAndHash";

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shopSupplier.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.shopUser.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await saltAndHashPassword("admin123");
  const userPassword = await saltAndHashPassword("user123");

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: Role.USER,
    },
  });

  // Create shops
  const shop1 = await prisma.shop.create({
    data: {
      name: "Electronics Store",
      users: {
        create: {
          userId: admin.id,
          role: Role.ADMIN,
        },
      },
    },
  });

  const shop2 = await prisma.shop.create({
    data: {
      name: "Fashion Boutique",
      users: {
        create: {
          userId: user.id,
          role: Role.USER,
        },
      },
    },
  });

  // Create suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Tech Wholesale Co.",
      email: "tech@supplier.com",
      phone: "123-456-7890",
      address: "123 Tech Street",
      shops: {
        create: {
          shopId: shop1.id,
        },
      },
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Fashion Supply Inc.",
      email: "fashion@supplier.com",
      phone: "098-765-4321",
      address: "456 Fashion Avenue",
      shops: {
        create: {
          shopId: shop2.id,
        },
      },
    },
  });

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Smartphone X",
        price: 99900, // $999.00
        stock: 50,
        shopId: shop1.id,
        supplierId: supplier1.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Laptop Pro",
        price: 149900, // $1,499.00
        stock: 30,
        shopId: shop1.id,
        supplierId: supplier1.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Designer Jeans",
        price: 7999, // $79.99
        stock: 100,
        shopId: shop2.id,
        supplierId: supplier2.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Premium T-Shirt",
        price: 2999, // $29.99
        stock: 200,
        shopId: shop2.id,
        supplierId: supplier2.id,
      },
    }),
  ]);

  // Create orders with different statuses and dates
  const orderStatuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  const createOrder = async (
    shopId: string,
    userId: string,
    daysAgo: number,
    status: OrderStatus
  ) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const order = await prisma.order.create({
      data: {
        shopId,
        userId,
        supplierId: shopId === shop1.id ? supplier1.id : supplier2.id,
        status,
        totalAmount: 0, // Will be updated after adding items
        createdAt: date,
        updatedAt: date,
      },
    });

    // Add random products to the order
    const shopProducts = products.filter((p) => p.shopId === shopId);
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    let totalAmount = 0;

    for (let i = 0; i < numItems; i++) {
      const product =
        shopProducts[Math.floor(Math.random() * shopProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity per item
      totalAmount += product.price * quantity;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          price: product.price,
        },
      });
    }

    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount },
    });
  };

  // Create 20 orders with different statuses and dates
  for (let i = 0; i < 20; i++) {
    const status =
      orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const daysAgo = Math.floor(Math.random() * 30); // Orders from last 30 days
    const shopId = Math.random() > 0.5 ? shop1.id : shop2.id;
    const userId = Math.random() > 0.5 ? admin.id : user.id;

    await createOrder(shopId, userId, daysAgo, status);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
