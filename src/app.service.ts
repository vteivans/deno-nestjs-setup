import { Injectable } from "@nestjs/common";
import { DbLogger } from "./db.logger.ts";

export class ExampleError extends Error {
  constructor(message: string, input: unknown[], error?: unknown) {
    super(message, {
      cause: {
        input,
        error,
      },
    });
  }
}

@Injectable()
export class AppService {
  constructor(private readonly dbLogger: DbLogger) {}

  getHello(): string {
    return "Hello Luna!";
  }

  async logRequest(request: Request) {
    await this.dbLogger.log(request.url, request.method, {
      headers: request.headers,
    });
  }

  triggerError(request: Request) {
    // throw new Error("Request failed", { cause: request });
    throw new ExampleError("Request failed", [{
      name: request.constructor.name,
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
    }]);
  }
}
