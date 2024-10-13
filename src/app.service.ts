import { Injectable } from "@nestjs/common";
import { DbLogger } from "./db.logger.ts";

@Injectable()
export class AppService {
  constructor(private readonly dbLogger: DbLogger) {}

  getHello(): string {
    return "Hello Luna!";
  }

  async logRequest(request: Request) {
    await this.dbLogger.log(request.url, request.method, {headers: request.headers})
  }
}
