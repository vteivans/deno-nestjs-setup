import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module.ts";

async function bootstrap() {
  const port = Deno.env.get("PORT");
  if (!port) {
    throw new Error("PORT env variable missing");
  }
  const app = await NestFactory.create(AppModule);

  Logger.log(`Listening on port: ${port}`, "Bootstrap");
  await app.listen(port);
}
bootstrap();
