import { auth, signIn, signOut } from "@/auth";
import { sendLoggedInMessage } from "./messageBroker/messageBroker";
import { GetProducts } from "./actions/getProduct";
import { AddProduct } from "./actions/addProduct";
import ProductList from "@/components/ProductList";
import { Product } from "@/types";
import { useState } from "react";

export default async function Page() {
  const session = await auth();
  const products = await GetProducts();

  if (!session?.user)
    return (
      <>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button>Sign In</button>
        </form>
        <ProductList products={products} session={session} />
      </>
    );
  sendLoggedInMessage(session?.user?.name);

  return (
    <div className="space-y-2">
      <p>{session.user.name}</p>
      <p> {session.user.email}</p>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button>Sign Out</button>
      </form>

      <ProductList products={products} session={session} />

      <form action={AddProduct}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <label>
          Price:
          <input type="number" min={0} name="price" />
        </label>

        <button>Submit</button>
      </form>
    </div>
  );
}
