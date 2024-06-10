"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function UpdateProduct(formData: FormData) {
  const product = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
  };

  if (!product.name || !product.description || !product.name || !product.price)
    return;

  await fetch(`http://localhost:5001/products/${formData.get("id")}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  revalidateTag("products");
}
