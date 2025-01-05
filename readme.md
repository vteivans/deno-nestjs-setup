# Deno project

## 1. Set up NestJS

Manually Install the dependencies of NestJS. Deno seems to detect types automatically.

```sh
deno add npm:@nestjs/common npm:@nestjs/core npm:@nestjs/platform-express npm:reflect-metadata npm:rxjs
```

- [x] TODO: Unit / Integration tests using Nest.
- [ ] TODO: Check if `platform-express` could be replaced with Hono.
- [ ] TODO: Figure out how to manage Dev Dependencies. Primarily for Testing
- [ ] TODO: Set up Docker container
- [ ] TODO: Inspect post install scripts for `prisma`, `@nest/core`. What do they do, why are they necessary?
- [ ] TODO: How to manage Deno permissions outside of CLI params?
- [ ] TODO: Can I see all deno permissions requested when using `-A` flag?

### 1.1 Set up NestJS testing

Current solution does not include the test requirements in any single place. Not sure how this would work with deployment as there are no separate "dev dependencies".

I use Deno built in testing capability for testing Nest. For this to work test files must end with `_test.ts` or `.test.ts`.

```sh
deno test
```

The tests are adapted from NestJS starter (`nest new project-name`). To get the same test structure with `describe` and `it` I added Deno std lib packages:

```ts
import { describe, it, beforeEach } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
```

All testing dependencies are included directly in to the test files. They are also not versioned. This is probably not scalable.

NestJS Testing module added like this:

```ts
import { Test, TestingModule } from 'npm:@nestjs/testing';
```

#### E2E tests

Can't get e2e tests working at the moment.


## 2. Set up Prisma

Running NPM scripts: https://docs.deno.com/runtime/fundamentals/node/

Install prisma as usual, just using deno:

```
deno add -A npm:prisma@latest npm:@prisma/client@latest
```

To properly install prisma `"nodeModulesDir": "auto",` is required in `deno.json`. And the scripts must be allowed to run after the install (`--allow-scripts`).

Specific packages can be specified for scrips: `deno install --allow-scripts=npm:prisma`.

To run node scripts use `npm:[script]`. So to execute prisma Generate:

```sh
deno run -A npm:prisma generate
deno run -A npm:prisma db push
```

> The `-A` option allows all the requested permissions. Prisma generate needs quite a few.

Prisma needs ffi permission `--allow-ffi`.

### Notes on Prisma Generation

Prisma client and prisma versions must match, otherwise generation will not work.

Using a specific directory in the the project for Generation output (`"generator client".output` in `schema.prisma` file) does not work as expected. Prisma generates "commonjs" code. Deno does not allow to import commonjs from inside the project without some adjustments.

#### Prisma client

`PrismaClient` can't be imported as named import from `@prisma/client`. That results in error:

> error: Uncaught SyntaxError: The requested module '@prisma/client' does not provide an export named 'PrismaClient'

Instead it can be used as a property on `default` export:

```ts
import p from "@prisma/client";
p.PrismaClient();
```

### Common JS imports

https://docs.deno.com/runtime/fundamentals/node/

Deno does not like CommonJS exports in JS files. This is what prisma generates though.

To work around this, change the file names from `.js` to `.cjs` and update the relevant imports in generated files.

Deno does not look for `type` field in `package.json` to determine the type of the package.

### Package.json

Running prisma scripts adds package.json files. They can be removed and are not required for prisma to function.

### Notes on Prisma

Prisma might not be an optimal tool to use with Deno. Drizzle might be a more optimal choice as it doesn't generate stuff. However Prisma is what's mostly used for production.

Still have to check, how does this function inside of a monorepo. Is it possible to have a package that contains "commonjs" "automatically"? So that I could export prisma generated files?