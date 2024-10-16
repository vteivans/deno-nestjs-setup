import p from "@prisma/client";

// https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy
export const prismaProvider = {
    provide: p.PrismaClient,
    useFactory: () => {
        return new p.PrismaClient();
    }
}