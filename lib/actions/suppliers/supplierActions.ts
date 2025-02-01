//get suppliers

"use server";
import db from "@/lib/db/db";

export const getSuppliers = async () => {
  const suppliers = await db.supplier.findMany();
  return suppliers;
};
