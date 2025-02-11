//here all zod schemas are defined

import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
});

export const OrderFormSchema = z.object({
  totalAmount: z
    .number()
    .min(0, "Total amount must be greater than or equal to 0"),
  status: z.nativeEnum(OrderStatus),
  shopId: z.string().min(1, "Shop is required"),
  userId: z.string().min(1, "User ID is required"),
  shop: z.object({
    connect: z.object({
      id: z.string().min(1, "Shop ID is required"),
    }),
  }),
  orderItems: z.object({
    create: z
      .array(OrderItemSchema)
      .min(1, "At least one order item is required"),
  }),
});

export type Schema = z.infer<typeof schema>;
export type OrderFormSchema = z.infer<typeof OrderFormSchema>;
export type OrderItemSchema = z.infer<typeof OrderItemSchema>;
