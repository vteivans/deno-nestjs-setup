// @deno-types="../generated/client/index.d.ts"
import { PrismaClient } from "../generated/client/index.cjs";

// https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy
export const prismaProvider = {
    provide: PrismaClient,
    useFactory: () => {
        return new PrismaClient();
    }
}