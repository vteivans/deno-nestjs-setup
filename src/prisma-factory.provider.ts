import p from "@prisma/client";
// Compiling Prisma in Deno project location, breaks `process` global.
// import { PrismaClient } from '../prisma/prisma-deno/deno/edge.ts';

// https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy
// https://github.com/prisma/prisma/releases/tag/4.5.0
// This could be useful for mono repo: https://github.com/denoland/deno/pull/26149
export const prismaProvider = {
    provide: p.PrismaClient,
    useFactory: () => {
        return new p.PrismaClient();
    }
}