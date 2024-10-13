import { Injectable, LoggerService } from "@nestjs/common";
// @deno-types="../generated/client/index.d.ts"
import { PrismaClient } from "../generated/client/index.cjs";

@Injectable()
export class DbLogger implements LoggerService {
    constructor(
        protected readonly prisma: PrismaClient,
    ) {}

    async log(
        message: string,
        context?: string,
        data?: Record<string, unknown>,
    ) {
        await this.prisma.log.create({
            data: {
                level: "Info",
                message: context ? `[${context}] ${message}` : message,
                meta: data ? JSON.stringify(data) : "",
            },
        });
    }
    error(message: string, context?: string, data?: Record<string, unknown>) {
        console.error(message, context, data);
    }
    warn(message: string, context?: string, data?: Record<string, unknown>) {
        console.warn(message, context, data);
    }
}
