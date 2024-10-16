import { Injectable, LoggerService } from "@nestjs/common";
import p from "@prisma/client";

@Injectable()
export class DbLogger implements LoggerService {
    constructor(
        protected readonly prisma: p.PrismaClient,
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
