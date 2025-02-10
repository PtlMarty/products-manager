# Supply Chain Management System

A modern supply chain management system built with Next.js, TypeScript, and Prisma.

## 📁 Project Structure

```
supply-chain/
├── app/                # Next.js 13+ App Router pages
├── components/         # React components
│   ├── ui/            # UI component library
│   │   ├── atoms/     # Basic UI components
│   │   ├── molecules/ # Compound components
│   │   └── organisms/ # Complex components
│   ├── layouts/       # Layout components
│   └── features/      # Feature-specific components
├── lib/               # Application logic
│   ├── api/          # API-related utilities
│   ├── auth/         # Authentication logic
│   ├── db/           # Database utilities
│   ├── hooks/        # React hooks
│   ├── utils/        # General utilities
│   └── validation/   # Schema validation
├── types/            # TypeScript type definitions
├── public/           # Static assets
└── prisma/           # Database schema and migrations
```

## 🚀 Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Component Documentation](./docs/components/README.md)
- [Setup Guide](./docs/setup/README.md)
- [Contributing Guidelines](./docs/contributing/CONTRIBUTING.md)

## 🔧 Environment Variables

Required environment variables:

- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Your application URL

See `.env.example` for all required variables.

## 🧪 Testing

```bash
pnpm test        # Run all tests
pnpm test:watch  # Run tests in watch mode
```

## 📦 Built With

- Next.js 13+
- TypeScript
- Prisma
- TailwindCSS
- Shadcn UI
- NextAuth.js

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
