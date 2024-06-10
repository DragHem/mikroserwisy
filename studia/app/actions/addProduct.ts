import { revalidateTag } from "next/cache";

export async function AddProduct(formData: FormData) {
  "use server";

  const product = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
  };

  if (!product.name || !product.description || !product.name || !product.price)
    return;

  await fetch("http://localhost:5001/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  revalidateTag("products");
}
