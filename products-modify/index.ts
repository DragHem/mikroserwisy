import { createExpressServer } from "routing-controllers";
import { ProductController } from "./controllers/product.controller";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [ProductController],
});

app.listen(3000, () => {
  console.log("Server running at PORT: http://localhost:3000/api");
});
