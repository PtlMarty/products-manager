"use client";

import { Button } from "@/components/ui/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/molecules/card";
import { Supplier } from "@/lib/hooks/UseSuppliers";
import { Shop } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateSupplierModal } from "../suppliers/modals/CreateSupplierModal";
import { SupplierCard } from "./SupplierCard";

interface DashboardSuppliersProps {
  suppliers: Supplier[];
  shops: Shop[];
  onDelete: (id: string) => Promise<boolean>;
  onSubmit: (data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    shopId: string;
  }) => Promise<Supplier | null>;
}

export const DashboardSuppliers = ({
  suppliers,
  shops,
  onDelete,
}: DashboardSuppliersProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Suppliers</CardTitle>
            <CardDescription>
              Manage your suppliers and their information
            </CardDescription>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onDelete={onDelete}
            />
          ))}
          {suppliers.length === 0 && (
            <div className="col-span-full text-center py-6 text-muted-foreground">
              No suppliers found. Add one to get started!
            </div>
          )}
        </CardContent>
      </Card>
      <CreateSupplierModal
        open={open}
        onClose={() => setOpen(false)}
        shops={shops}
      />
    </>
  );
};
