# Supply Chain Management System

A modern web application for managing supply chain operations, built with Next.js, TypeScript, and Prisma.

## Overview

This supply chain management system is a comprehensive solution that enables businesses to:

- Manage multiple shops and their products
- Track inventory and suppliers
- Process and manage orders with different statuses
- Implement role-based access control (RBAC)
- Handle user authentication and authorization
- Maintain real-time product inventory and pricing

## Tech Stack

- **Frontend**:
  - Next.js 14 with App Router
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
- **Backend**:
  - Next.js Server Actions
  - Prisma ORM
  - PostgreSQL
- **Authentication**:
  - Auth.js (NextAuth)
- **Deployment**:
  - Vercel (recommended)
  - PostgreSQL on Vercel

## Project Structure

```
supply-chain/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard routes
│   └── shops/            # Shop management routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── products/         # Product management
│   └── shops/           # Shop management
├── lib/                  # Core functionality
│   ├── actions/         # Server actions
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── prisma/              # Database configuration
│   ├── schema.prisma   # Database schema
│   └── seed.ts        # Seeding script
└── types/               # TypeScript definitions

```

## Key Features

1. **Multi-tenant Architecture**

   - Support for multiple shops with isolated data
   - Role-based access control (Admin, User, Buyer, Seller)
   - Secure user authentication and session management

2. **Product Management**

   - Create, read, update, and delete products
   - Real-time inventory tracking
   - Price management
   - Supplier associations

3. **Order Management**

   - Order creation and processing
   - Multiple order statuses (Pending, Confirmed, Shipped, Delivered, Cancelled)
   - Order history tracking
   - Total amount calculation

4. **Supplier Management**

   - Supplier profile management
   - Product-supplier relationships
   - Shop-supplier associations

5. **User Management**
   - User registration and authentication
   - Role-based permissions
   - Session management
   - Shop-specific user roles

## Database Schema

The system uses a PostgreSQL database with the following core models:

- **User**: Manages user accounts and authentication
- **Shop**: Represents individual shops in the system
- **Product**: Tracks products with inventory and pricing
- **Supplier**: Manages supplier information
- **Order**: Handles order processing and status
- **OrderItem**: Manages individual items within orders
- **ShopUser**: Manages user roles within shops
- **ShopSupplier**: Handles shop-supplier relationships

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Authentication

The system uses Auth.js for authentication with the following features:

- Email/Password authentication
- Secure session management
- Role-based access control
- Protected routes and API endpoints

## API Structure

The application uses Next.js Server Actions for data operations:

- User management actions
- Product CRUD operations
- Order processing
- Supplier management
- Shop operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MARTY License.
