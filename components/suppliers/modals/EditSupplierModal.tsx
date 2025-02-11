"use client";

import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Modal } from "@/components/ui/organisms/modal";
import { Supplier, useSuppliers } from "@/lib/hooks/UseSuppliers";
import { useState } from "react";

interface EditSupplierModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier;
}

export const EditSupplierModal = ({
  open,
  onClose,
  supplier,
}: EditSupplierModalProps) => {
  const { editSupplier } = useSuppliers();
  const [formData, setFormData] = useState({
    name: supplier.name,
    email: supplier.email || "",
    phone: supplier.phone || "",
    address: supplier.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    await editSupplier(supplier.id, formData);
    onClose();
  };

  return (
    <Modal
      title="Edit Supplier"
      description="Edit supplier information"
      isOpen={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Supplier name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Modal>
  );
};
