// import { INestApplication } from "@nestjs/common";
// import { superdeno } from "https://deno.land/x/superdeno@4.9.0/mod.ts";
// // import request from 'npm:supertest';
// import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
// import { Test, TestingModule } from "npm:@nestjs/testing";
// import "@nestjs/platform-express";
// import { ExpressAdapter } from "@nestjs/platform-express";
// import { setTimeout } from "node:timers/promises";
// import { AppModule } from "./src/app.module.ts";

// // Can't get this to work for now
// // error: Promise resolution is still pending but the event loop has already resolved.
// describe.skip("AppController (e2e)", () => {
//     type Server = ReturnType<ExpressAdapter["listen"]>;
//     let app: INestApplication<Server>;

//     beforeEach(async () => {
//         const moduleFixture: TestingModule = await Test.createTestingModule({
//             imports: [AppModule],
//         }).compile();

//         app = moduleFixture.createNestApplication<
//             INestApplication<Server>
//         >();
//         await app.init();
//     });

//     it("/ (GET)", async () => {
//         const server = app.getHttpServer();
//         console.log("SERVER", server);
//         const test = superdeno(server);
//         console.log("test", test);
//         const res = await test
//             .get("/")
//             .expect(200)
//             .expect("Hello Luna!");

//         console.log("RES", res);
//     });

//     afterEach(async () => {
//         await setTimeout(3000);
//         await app.close();
//     });
// });
