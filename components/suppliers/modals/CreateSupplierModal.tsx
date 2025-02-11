"use client";

import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Modal } from "@/components/ui/organisms/modal";
import { useSuppliers } from "@/lib/hooks/UseSuppliers";
import { Shop } from "@prisma/client";
import { useState } from "react";

interface CreateSupplierModalProps {
  open: boolean;
  onClose: () => void;
  shops: Shop[];
}

export const CreateSupplierModal = ({
  open,
  onClose,
  shops,
}: CreateSupplierModalProps) => {
  const { addSupplier } = useSuppliers();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shopId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shopId) return;

    await addSupplier(formData);
    setFormData({ name: "", email: "", phone: "", address: "", shopId: "" });
    onClose();
  };

  return (
    <Modal
      title="Create Supplier"
      description="Add a new supplier"
      isOpen={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Shop</label>
          <select
            name="shopId"
            value={formData.shopId}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value="">Select a shop</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>
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
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Modal>
  );
};
