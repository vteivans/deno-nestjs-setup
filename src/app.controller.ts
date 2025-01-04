import { Controller, Get, Req, Res } from "@nestjs/common";
import { AppService } from "./app.service.ts";
import type { ExpressRequest, ExpressResponse } from "./type.helper.ts";

function JSONStringifyError(error: Error): string {
  // deno-lint-ignore no-explicit-any
  const obj: Record<keyof any, unknown> = {};
  for (const prop of Object.getOwnPropertyNames(error)) {
    obj[prop] = error[prop as keyof Error];
  }
  return JSON.stringify(obj);
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() request: Request): Promise<string> {
    await this.appService.logRequest(request);
    return this.appService.getHello();
  }

  @Get("/error")
  getError(@Res() res: ExpressResponse, @Req() request: ExpressRequest): void {
    res.set("Content-Type", "application/json");
    try {
      this.appService.triggerError(request);
    } catch (err) {
      console.log(err);
      const errStr = err instanceof Error ? JSONStringifyError(err) : JSON.stringify(err);
      console.log(JSON.stringify(err.cause));
      console.log(errStr);
      res.send(errStr);
      return;
    }
    res.send("{}");
  }
}
