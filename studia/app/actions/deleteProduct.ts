"use server";
import { revalidateTag } from "next/cache";

export async function DeleteProduct(id: string) {
  await fetch(`http://localhost:5001/products/${id}`, {
    method: "DELETE",
  });

  revalidateTag("products");
}
