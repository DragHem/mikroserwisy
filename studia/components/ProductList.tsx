"use client";
import { DeleteProduct } from "@/app/actions/deleteProduct";
import type { Product } from "../types/index";

export default function ProductList({ products }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {products.map(({ id, description, name, price }) => (
        <div key={id} className="border p-2">
          <button
            className="border hover:bg-slate-400"
            onClick={() => DeleteProduct(id)}
          >
            Delete product
          </button>
          {name && (
            <p>
              <span className="font-bold">Product name:</span> {name}
            </p>
          )}

          {description && (
            <p>
              <span className="font-bold">Product description:</span>
              {description}
            </p>
          )}

          {price && (
            <p>
              <span className="font-bold">Product price:</span> {price}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

type Props = {
  products: Product[];
};
