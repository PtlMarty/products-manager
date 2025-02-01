# Supply Chain Management System

A modern web application for managing supply chain operations, built with Next.js, TypeScript, and Prisma.

## Overview

This supply chain management system allows businesses to:

- Manage multiple shops and their products
- Track suppliers and their associated products
- Handle user authentication and role-based access control
- Maintain product inventory and pricing

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Authjs

## Project Structure

```
supply-chain/
├── app/                    # Next.js app directory (pages and routing)
├── components/            # React components
│   ├── dashboard/        # Dashboard-related components
│   ├── products/         # Product management components
│   ├── shop/            # Shop management components
│   └── ...
├── lib/                  # Backend utilities and actions
│   ├── actions/         # Server actions
│   └── db/             # Database configuration
├── prisma/              # Database schema and migrations
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Documentation Structure

- [Getting Started](./getting-started.md) - Setup and installation guide
- [Architecture](./architecture.md) - System architecture and design
- [Database Schema](./database-schema.md) - Database structure and relationships
- [API Documentation](./api-documentation.md) - API endpoints and usage
- [Authentication](./authentication.md) - Authentication system details
- [Deployment](./deployment.md) - Deployment guide and considerations

## Key Features

1. **Multi-tenant Architecture**

   - Support for multiple shops
   - Role-based access control
   - User management

2. **Product Management**

   - Product creation and editing
   - Price management
   - Supplier association

3. **Supplier Management**

   - Supplier tracking
   - Product-supplier relationships

4. **User Management**
   - User authentication
   - Session management
   - Role-based permissions
