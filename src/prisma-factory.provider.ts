import p from "@prisma/client";

// https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy
// https://github.com/prisma/prisma/releases/tag/4.5.0
export const prismaProvider = {
    provide: p.PrismaClient,
    useFactory: () => {
        return new p.PrismaClient();
    }
}