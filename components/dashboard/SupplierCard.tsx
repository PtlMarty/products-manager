"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/molecules/card";
import { Supplier } from "@/lib/hooks/UseSuppliers";
import { Edit, Mail, Phone, Trash } from "lucide-react";
import { useState } from "react";
import { EditSupplierModal } from "../suppliers/modals/EditSupplierModal";

interface SupplierCardProps {
  supplier: Supplier;
  onDelete: (id: string) => Promise<boolean>;
}

export const SupplierCard = ({ supplier, onDelete }: SupplierCardProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await onDelete(supplier.id);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />
      <EditSupplierModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        supplier={supplier}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{supplier.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {supplier.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              {supplier.email}
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              {supplier.phone}
            </div>
          )}
          {supplier.address && (
            <div className="text-sm text-muted-foreground">
              {supplier.address}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Added on {new Date(supplier.createdAt).toLocaleDateString()}
        </CardFooter>
      </Card>
    </>
  );
};
