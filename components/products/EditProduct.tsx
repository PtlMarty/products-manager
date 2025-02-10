//dialog to edit a product with a filled form and a dialog to confirm the changes

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/organisms/dialog";
import { Product, Supplier } from "@prisma/client";
import { Edit } from "lucide-react";
import { useState } from "react";
import { ProductForm } from "./ProductForm";

interface EditProductProps {
  product: Product;
  suppliers: Supplier[];
  onUpdate: (
    product: Product
  ) => Promise<{ success: boolean; data?: Product; error?: Error }>;
}

export const EditProduct = ({
  product,
  suppliers,
  onUpdate,
}: EditProductProps) => {
  const [open, setOpen] = useState(false);

  const handleUpdate = async (updatedProduct: Partial<Product>) => {
    const result = await onUpdate({ ...product, ...updatedProduct } as Product);
    if (result.success) {
      setOpen(false);
    }
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Edit className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="sr-only">
          <DialogTitle>Edit Product</DialogTitle>
        </div>
        <ProductForm
          shopId={product.shopId}
          suppliers={suppliers}
          onSubmit={handleUpdate}
          title="Edit Product"
          initialData={product}
          standalone={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
