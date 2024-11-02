import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DenoConsoleLogger } from "./deno-console.logger.ts";
import { AppModule } from "./src/app.module.ts";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

// import process from 'node:process'

async function bootstrap() {
  const port = Deno.env.get("PORT");
  if (!port) {
    throw new Error("PORT env variable missing");
  }
  const logger = new DenoConsoleLogger();
  Logger.overrideLogger(logger);

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express()),
    {
      logger,
    },
  );

  logger.log(`Listening on port: ${port}`, "Bootstrap");
  await app.listen(port);
}
bootstrap();
