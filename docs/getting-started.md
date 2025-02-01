# Getting Started

This guide will help you set up and run the Supply Chain Management System locally.

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- pnpm package manager
- Git

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd supply-chain
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/supply_chain"
DIRECT_URL="postgresql://user:password@localhost:5432/supply_chain"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

## Development

1. Start the development server:

```bash
pnpm dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

### Key Directories

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/lib`: Backend utilities and server actions
- `/prisma`: Database schema and migrations
- `/types`: TypeScript type definitions
- `/utils`: Utility functions

### Important Files

- `package.json`: Project dependencies and scripts
- `prisma/schema.prisma`: Database schema
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `.env`: Environment variables

## Development Workflow

1. **Database Changes**

   - Edit `prisma/schema.prisma`
   - Run `pnpm prisma generate`
   - Run `pnpm prisma db push`

2. **Adding New Features**

   - Create new components in `/components`
   - Add server actions in `/lib/actions`
   - Update types in `/types`
   - Add new routes in `/app`

3. **Testing**
   - Write tests for new features
   - Run tests with `pnpm test`

### Build Errors

1. Clear `.next` directory
2. Remove `node_modules`
3. Run `pnpm install`
4. Rebuild with `pnpm build`

## Next Steps

- Read the [Architecture Documentation](./architecture.md)
- Explore the [Database Schema](./database-schema.md)
- Review the [API Documentation](./api-documentation.md)
