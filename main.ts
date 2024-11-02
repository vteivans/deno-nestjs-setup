import { Logger } from "@nestjs/common";
import { AbstractHttpAdapter, NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { DenoConsoleLogger } from "./deno-console.logger.ts";
import { AppModule } from "./src/app.module.ts";

// import process from 'node:process'

async function bootstrap() {
  const port = Deno.env.get("PORT");
  if (!port) {
    throw new Error("PORT env variable missing");
  }
  const logger = new DenoConsoleLogger();
  Logger.overrideLogger(logger);

  const expressAdapter = new ExpressAdapter(express());

  const app = await NestFactory.create(
    AppModule,
    expressAdapter as unknown as AbstractHttpAdapter,
    {
      logger,
    },
  );

  logger.log(`Listening on port: ${port}`, "Bootstrap");
  await app.listen(port);
}
bootstrap();
