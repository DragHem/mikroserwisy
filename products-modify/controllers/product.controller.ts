import "reflect-metadata";
import {
  Param,
  Body,
  Post,
  Put,
  Delete,
  JsonController,
} from "routing-controllers";

import { prisma as prismaClient } from "..";
import { Prisma } from "@prisma/client";
import { ReasonPhrases } from "http-status-codes";
import * as amqp from "amqplib";

@JsonController("/products")
export class ProductController {
  @Post("/")
  async post(@Body() product: Prisma.ProductCreateInput) {
    console.log("🚀 ~ ProductController ~ post ~ product:", product);
    const createdProduct = await prismaClient.product.create({ data: product });

    await addToQueue("POST", createdProduct);

    return createdProduct;
  }

  @Put("/:id")
  async put(
    @Param("id") id: string,
    @Body() product: Prisma.ProductUpdateInput
  ) {
    try {
      const updatedProduct = await prismaClient.product.update({
        where: {
          id,
        },
        data: product,
      });
      await addToQueue("PUT", updatedProduct);
      return updatedProduct;
    } catch (error: any) {
      console.log("🚀 ~ ProductController ~ error:", error);
      return { error: ReasonPhrases.BAD_REQUEST, message: error.meta.cause };
    }
  }

  @Delete("/:id")
  async remove(@Param("id") id: string) {
    try {
      const deletedProduct = await prismaClient.product.delete({
        where: {
          id,
        },
      });
      await addToQueue("DELETE", deletedProduct);
      if (deletedProduct) return ReasonPhrases.OK;
    } catch (error: any) {
      return { error: ReasonPhrases.NOT_FOUND, message: error.meta.cause };
    }
  }
}

const addToQueue = async (method: string, newProduct: object) => {
  const rabbitMqConnection = await amqp.connect("amqp://rabbitmq");
  const channel = await rabbitMqConnection.createChannel();

  const exchangeName = "main_exchange";
  const routingKey = "products";

  await channel.assertExchange(exchangeName, "direct", { durable: false });

  const message = JSON.stringify({
    method: method,
    data: newProduct,
  });
  channel.publish(exchangeName, routingKey, Buffer.from(message));

  console.log(
    `Message sent to exchange ${exchangeName} with routing key ${routingKey}: ${message}`
  );

  await channel.close();
  await rabbitMqConnection.close();
};
