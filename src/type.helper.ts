import { NestExpressApplication } from '@nestjs/platform-express';

type ExpressAdapter = ReturnType<NestExpressApplication['getHttpAdapter']>;
type ExpressReqHandlerFn = Parameters<ExpressAdapter['all']>[0];
type ReqHandlerArgs = Parameters<ExpressReqHandlerFn>;

export type ExpressRequest = ReqHandlerArgs[0];
export type ExpressResponse = ReqHandlerArgs[1];