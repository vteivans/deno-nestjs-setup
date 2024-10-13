import { Test, TestingModule } from 'npm:@nestjs/testing';
import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Calling root route', () => {
    it('should return "Hello Luna!"', () => {
      expect(appController.getHello()).toBe('Hello Luna!');
    });
  });
});