import { createProduct } from "@/lib/actions/products/productsActions";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  supplierId: z.string().min(1).optional(),
  shopId: z.string().min(1),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const validatedProduct = productSchema.parse(req.body);
      const newProduct = await createProduct({
        ...validatedProduct,
        id: "", // Let Prisma handle ID generation
        createdAt: new Date(), // Ensure createdAt is provided
        updatedAt: new Date(), // Ensure updatedAt is provided
        supplierId: validatedProduct.supplierId || "", // Ensure supplierId is a string
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error in API route:", error); // Log the error
      res.status(400).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
