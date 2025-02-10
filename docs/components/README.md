# Component Documentation

This document provides an overview of the components available in the Supply Chain Management System.

## Component Structure

Our components are organized following the Atomic Design methodology:

```
components/
├── ui/              # Reusable UI components
│   ├── atoms/       # Basic components
│   ├── molecules/   # Compound components
│   └── organisms/   # Complex components
├── layouts/         # Layout components
└── features/        # Feature-specific components
```

## UI Components

### Atoms

Basic building blocks of the interface.

#### Button

```typescript
import { Button } from '@/components/ui/atoms/button'

<Button
  variant="default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size="default" | "sm" | "lg" | "icon"
  onClick={() => {}}
>
  Click me
</Button>
```

#### Input

```typescript
import { Input } from '@/components/ui/atoms/input'

<Input
  type="text" | "password" | "email" | "number"
  placeholder="Enter value..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### Label

```typescript
import { Label } from "@/components/ui/atoms/label";

<Label htmlFor="email">Email address</Label>;
```

### Molecules

#### Card

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/molecules/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>;
```

#### Tabs

```typescript
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/molecules/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>;
```

### Organisms

#### Modal

```typescript
import { Modal } from "@/components/ui/organisms/modal";

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
  Modal content goes here
</Modal>;
```

#### Dialog

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/organisms/dialog";

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
    Content goes here
  </DialogContent>
</Dialog>;
```

## Feature Components

### Products

#### ProductsTable

```typescript
import { ProductsTable } from "@/components/products/ProductsTable";

<ProductsTable
  data={products}
  onEdit={(product) => {}}
  onDelete={(product) => {}}
/>;
```

#### ProductForm

```typescript
import { ProductForm } from "@/components/products/ProductForm";

<ProductForm initialData={product} onSubmit={(data) => {}} />;
```

### Dashboard

#### MetricCard

```typescript
import { MetricCard } from "@/components/dashboard/MetricCard";

<MetricCard
  title="Total Sales"
  value={totalSales}
  icon={<TrendingUpIcon />}
  trend={10}
/>;
```

#### SupplierCard

```typescript
import { SupplierCard } from "@/components/dashboard/SupplierCard";

<SupplierCard supplier={supplier} onContact={() => {}} />;
```

## Layout Components

### NavBar

```typescript
import { NavBar } from "@/components/layouts/NavBar";

<NavBar user={user} />;
```

### Footer

```typescript
import { Footer } from "@/components/layouts/Footer";

<Footer />;
```

## Best Practices

1. **Component Props**

   - Always define prop types using TypeScript interfaces
   - Use descriptive prop names
   - Provide default props where appropriate

2. **Component State**

   - Use React hooks for state management
   - Keep state as close to where it's needed as possible
   - Consider using context for global state

3. **Performance**

   - Memoize callbacks with useCallback
   - Memoize expensive computations with useMemo
   - Use React.memo for pure components

4. **Accessibility**

   - Include proper ARIA attributes
   - Ensure keyboard navigation works
   - Maintain proper heading hierarchy

5. **Testing**
   - Write unit tests for components
   - Include integration tests for complex interactions
   - Test accessibility with appropriate tools

## Contributing

When creating new components:

1. Follow the existing file structure
2. Include TypeScript types
3. Add appropriate documentation
4. Include tests
5. Ensure accessibility compliance
