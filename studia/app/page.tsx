import { auth, signIn, signOut } from "@/auth";
import { sendLoggedInMessage } from "./messageBroker/messageBroker";
import { GetProducts } from "./actions/getProduct";
import { AddProduct } from "./actions/addProduct";
import ProductList from "@/components/ProductList";

export default async function Page() {
  const session = await auth();

  if (!session?.user)
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button>Sign In</button>
      </form>
    );
  sendLoggedInMessage(session?.user?.name);

  const products = await GetProducts();

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

      <ProductList products={products} />

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
