"use client";
import { DeleteProduct } from "@/app/actions/deleteProduct";
import type { Product } from "../types/index";
import { useState } from "react";
import { UpdateProduct } from "@/app/actions/updateProduct";

export default function ProductList({ products, session }: Props) {
  const [product, setProduct] = useState<Product | null>();

  return (
    <>
      {session?.user && (
        <div className="border p-2">
          <h1>Update Product</h1>
          <form action={UpdateProduct}>
            <label>
              <input
                type="text"
                defaultValue={product ? product.id : ""}
                name="id"
                hidden
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                defaultValue={product ? product.name : ""}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                defaultValue={product ? product.description : ""}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                min={0}
                name="price"
                defaultValue={product ? product.price : ""}
              />
            </label>

            <button>Submit</button>
          </form>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {products.map(({ id, description, name, price }) => (
          <div
            key={id}
            className="border p-2"
            onClick={() => setProduct({ id, description, name, price })}
          >
            {session?.user && (
              <button
                className="border hover:bg-slate-400"
                onClick={() => DeleteProduct(id)}
              >
                Delete product
              </button>
            )}
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
    </>
  );
}

type Props = {
  products: Product[];
  session?: any;
};
