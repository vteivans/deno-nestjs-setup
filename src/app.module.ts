import { Module } from '@nestjs/common';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { DbLogger } from "./db.logger.ts";
import { prismaProvider } from "./prisma-factory.provider.ts";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [DbLogger, AppService, prismaProvider],
})
export class AppModule {}
