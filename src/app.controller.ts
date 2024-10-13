import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service.ts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() request: Request): Promise<string> {
    await this.appService.logRequest(request);
    return this.appService.getHello();
  }
}
