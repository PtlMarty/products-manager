"use client";

import { Product } from "@prisma/client";
import React, { useState } from "react";

interface NewProductProps {
  handleCreateProduct: (product: Product) => void;
  shopId: string;
}

const initialProductState = {
  name: "",
  price: 0,
  supplierId: "cm6dgtcho0007uuvltyyw15zu",
  shopId: "",
};

const NewProduct: React.FC<NewProductProps> = ({
  handleCreateProduct,
  shopId,
}) => {
  const [product, setProduct] = useState({ ...initialProductState, shopId });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateProduct(product as Product);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === "price" ? parseFloat(value) || 0 : value;
    setProduct((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
        className="border p-2 rounded"
      />
      <input
        name="price"
        type="number"
        value={product.price}
        onChange={handleChange}
        placeholder="Price"
        required
        className="border p-2 rounded"
      />
      <input
        hidden
        name="supplierId"
        value={product.supplierId}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Create Product
      </button>
    </form>
  );
};

export default NewProduct;
