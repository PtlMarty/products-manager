//dialog to edit a product with a filled form and a dialog to confirm the changes

import { Product } from "@prisma/client";

interface EditProductProps {
  product: Product;
  onUpdate: (product: Product) => void;
}

export const EditProduct = ({ product }: EditProductProps) => {
  return <div>{product.name}</div>;
};

export default EditProduct;
