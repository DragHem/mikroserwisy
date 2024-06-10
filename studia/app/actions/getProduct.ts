import type { Product } from "../../types/product.type";

export async function GetProducts() {
  "use server";

  const resp = await fetch("http://localhost:5001/products", {
    next: { tags: ["products"] },
  });
  const data = (await resp.json()) as Product[];

  return data;
}
