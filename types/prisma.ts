// Export types for Prisma models

// Enums
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  BUYER = "BUYER",
  SELLER = "SELLER",
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// Basic model types
export interface User {
  id: string;
  email: string;
  name?: string | null;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  shopId: string;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  shopId: string;
  supplierId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types with relations
export interface OrderWithRelations extends Order {
  user: User;
  shop: Shop;
  supplier: Supplier;
  orderItems: OrderItem[];
}

export interface ProductWithSupplier extends Product {
  supplier: Supplier;
}
