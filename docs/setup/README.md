# Setup Guide

This guide will help you set up the Supply Chain Management System for development.

## Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- PostgreSQL (v14 or later)
- Git

## Installation Steps

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/supply-chain.git
cd supply-chain
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Environment Setup**

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/supply_chain"
DIRECT_URL="postgresql://user:password@localhost:5432/supply_chain"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Other Configuration
NODE_ENV="development"
```

4. **Database Setup**

```bash
# Run database migrations
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate

# (Optional) Seed the database
pnpm prisma db seed
```

5. **Start Development Server**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Development Tools

### Code Quality Tools

The project uses several tools to maintain code quality:

```bash
# Run ESLint
pnpm lint

# Run Prettier
pnpm format

# Run TypeScript type checking
pnpm type-check

# Run all checks
pnpm check-all
```

### Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e
```

## Project Structure

```
supply-chain/
├── app/                # Next.js pages
├── components/         # React components
├── lib/               # Core functionality
├── prisma/            # Database configuration
├── public/            # Static assets
└── types/             # TypeScript types
```

## Database Management

### Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name your_migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset
```

### Database GUI

You can use Prisma Studio to manage your database:

```bash
pnpm prisma studio
```

## Deployment

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Deployment Platforms

The application can be deployed to:

1. **Vercel** (Recommended)

   - Connect your GitHub repository
   - Vercel will automatically detect Next.js
   - Add environment variables in Vercel dashboard

2. **Docker**

   ```bash
   # Build Docker image
   docker build -t supply-chain .

   # Run container
   docker run -p 3000:3000 supply-chain
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Build Errors**

   - Clear .next directory: `rm -rf .next`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `pnpm install`

3. **Type Errors**
   - Run `pnpm type-check`
   - Ensure Prisma types are generated
   - Check for missing type definitions

### Getting Help

- Check existing GitHub issues
- Create a new issue
- Consult the documentation
- Contact the maintainers

## Next Steps

- Review the [API Documentation](../api/README.md)
- Explore the [Component Documentation](../components/README.md)
- Read the [Contributing Guidelines](../contributing/CONTRIBUTING.md)
