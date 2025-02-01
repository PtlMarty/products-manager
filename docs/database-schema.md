# Database Schema Documentation

This document outlines the database structure of the Supply Chain Management System.

## Models

### User

```prisma
model User {
  id        String      @id @default(cuid())
  email     String      @unique
  name      String?
  password  String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  shops     ShopUser[]
  sessions  Session[]
}
```

The User model represents system users with the following fields:

- `id`: Unique identifier
- `email`: User's email address (unique)
- `name`: Optional user's name
- `password`: Hashed password
- `shops`: Relationship to shops through ShopUser
- `sessions`: Active user sessions

### Shop

```prisma
model Shop {
  id        String      @id @default(cuid())
  name      String
  products  Product[]
  users     ShopUser[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
```

The Shop model represents individual stores or locations:

- `id`: Unique identifier
- `name`: Shop name
- `products`: Products associated with the shop
- `users`: Users who have access to the shop

### ShopUser

```prisma
model ShopUser {
  id        String      @id @default(cuid())
  shopId    String
  shop      Shop        @relation(fields: [shopId], references: [id])
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  role      String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
```

Junction table managing the many-to-many relationship between shops and users:

- `id`: Unique identifier
- `shopId`: Reference to the shop
- `userId`: Reference to the user
- `role`: User's role in the shop (e.g., admin, manager, staff)

### Product

```prisma
model Product {
  id         String      @id @default(cuid())
  name       String
  price      Int
  shopId     String
  shop       Shop        @relation(fields: [shopId], references: [id])
  supplierId String
  supplier   Supplier    @relation(fields: [supplierId], references: [id])
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

The Product model represents items sold in shops:

- `id`: Unique identifier
- `name`: Product name
- `price`: Product price in cents
- `shopId`: Reference to the shop selling the product
- `supplierId`: Reference to the product's supplier

### Supplier

```prisma
model Supplier {
  id        String      @id @default(cuid())
  name      String
  products  Product[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
```

The Supplier model represents product suppliers:

- `id`: Unique identifier
- `name`: Supplier name
- `products`: Products supplied by this supplier

### Session

```prisma
model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

The Session model manages user authentication sessions:

- `sessionToken`: Unique session identifier
- `userId`: Reference to the authenticated user
- `expires`: Session expiration timestamp

## Relationships

1. **User <-> Shop** (Many-to-Many)

   - Implemented through the ShopUser junction table
   - Includes role information for each user in a shop

2. **Shop <-> Product** (One-to-Many)

   - A shop can have many products
   - Each product belongs to one shop

3. **Supplier <-> Product** (One-to-Many)

   - A supplier can have many products
   - Each product has one supplier

4. **User <-> Session** (One-to-Many)
   - A user can have multiple active sessions
   - Each session belongs to one user

## Timestamps

All models include:

- `createdAt`: Automatically set when record is created
- `updatedAt`: Automatically updated when record is modified
