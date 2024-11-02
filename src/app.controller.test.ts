import { Test, TestingModule } from "npm:@nestjs/testing";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { AppController } from "./app.controller.ts";
import { AppService } from "./app.service.ts";
import { DbLogger } from "./db.logger.ts";
import p from "@prisma/client";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, DbLogger, {
        provide: p.PrismaClient,
        useValue: {
          log: {
            create: () => Promise.resolve(),
          },
        },
      }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("Calling root route", () => {
    it('should return "Hello Luna!"', () => {
      const req = new Request("http://test.host/");
      expect(appController.getHello(req)).resolves.toBe("Hello Luna!");
    });
  });
});
