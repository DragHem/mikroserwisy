import "reflect-metadata";
import { Param, Get, JsonController } from "routing-controllers";

import { prisma as prismaClient } from "..";
import { ReasonPhrases } from "http-status-codes";

@JsonController("/products")
export class ProductController {
  @Get("/")
  async getAll() {
    const products = await prismaClient.product.findMany();

    return products;
  }

  @Get("/:id")
  async getOne(@Param("id") id: string) {
    const product = await prismaClient.product.findUnique({
      where: {
        id,
      },
    });

    if (product) return product;

    return { message: ReasonPhrases.NOT_FOUND };
  }
}
