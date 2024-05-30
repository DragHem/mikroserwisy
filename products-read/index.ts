import { createExpressServer } from "routing-controllers";
import { ProductController } from "./controllers/product.controller";
import { PrismaClient } from "@prisma/client";
import * as amqp from 'amqplib';

export const prisma = new PrismaClient();

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [ProductController],
});

app.listen(3001, async () => {
  console.log("Server running at PORT: http://localhost:3001/api");
  await waitForRabbitMQToStart();
  startRabbitMQConsumer();
});

async function startRabbitMQConsumer() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const queue = 'products';

    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg: amqp.ConsumeMessage | null) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        const method = content.method;
        const data = content.data;
        const id = content.data.id;
        console.log(`Received content: ${JSON.stringify(content)}`);

        try {
          let newProduct;
          if (method === "POST") {
            newProduct = await prisma.product.create({ data });
          }
          else if (method === "PUT") {
            newProduct = await prisma.product.update({
              where: {
                id,
              },
              data,
            });

          }
          else if (method === "DELETE") {
            newProduct = await prisma.product.delete({
              where: {
                id,
              },
            });

          }
          console.log(`Product ${method}ed in database: ${JSON.stringify(newProduct)}`);
          channel.ack(msg);
        } catch (error) {
          console.error(`Failed to ${method} product in database: `, error);
          channel.nack(msg);
        }
      }
    }, {
      noAck: false
    });
    console.log(`Waiting for messages in queue: ${queue}`);
  } catch (error) {
    console.error('Failed to start RabbitMQ consumer:', error);
  }
}

async function waitForRabbitMQToStart(): Promise<void> {
  const MAX_RETRIES = 10;
  const RETRY_INTERVAL_MS = 3000;

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      await fetch('http://rabbitmq:15672');
      console.log('RabbitMQ is ready!');
      return;
    } catch (error) {
      console.log('RabbitMQ is not ready yet. Retrying...');
      retries++;
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }

  throw new Error('Failed to connect to RabbitMQ after maximum retries.');
}