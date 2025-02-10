# API Documentation

This document outlines the API endpoints and server actions available in the Supply Chain Management System.

## Authentication

Authentication is handled through NextAuth.js. All protected routes require a valid session token.

### Authentication Endpoints

- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `GET /api/auth/session`

## Server Actions

### Products

```typescript
// Create a new product
createProduct(data: CreateProductInput): Promise<Product>

// Update an existing product
updateProduct(id: string, data: UpdateProductInput): Promise<Product>

// Delete a product
deleteProduct(id: string): Promise<void>

// Get product by ID
getProduct(id: string): Promise<Product>

// List products with pagination
getProducts(params: ProductListParams): Promise<PaginatedProducts>
```

### Suppliers

```typescript
// Create a new supplier
createSupplier(data: CreateSupplierInput): Promise<Supplier>

// Update an existing supplier
updateSupplier(id: string, data: UpdateSupplierInput): Promise<Supplier>

// Delete a supplier
deleteSupplier(id: string): Promise<void>

// Get supplier by ID
getSupplier(id: string): Promise<Supplier>

// List suppliers with pagination
getSuppliers(params: SupplierListParams): Promise<PaginatedSuppliers>
```

### Shops

```typescript
// Create a new shop
createShop(data: CreateShopInput): Promise<Shop>

// Update an existing shop
updateShop(id: string, data: UpdateShopInput): Promise<Shop>

// Delete a shop
deleteShop(id: string): Promise<void>

// Get shop by ID
getShop(id: string): Promise<Shop>

// List shops with pagination
getShops(params: ShopListParams): Promise<PaginatedShops>
```

## Data Types

### Common Types

```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Product Types

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  supplierId: string;
  shopId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  supplierId: string;
  shopId: string;
}
```

### Supplier Types

```typescript
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateSupplierInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}
```

## Error Handling

All API endpoints and server actions follow a consistent error handling pattern:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

Common error codes:

- `UNAUTHORIZED`: User is not authenticated
- `FORBIDDEN`: User lacks required permissions
- `NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Limits are as follows:

- Authentication endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute per user

## Versioning

The API follows semantic versioning. The current version is v1.
