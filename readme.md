# Deno project

## 1. Set up NestJS

Manually Install the dependencies of NestJS. Deno seems to detect types automatically.

```sh
deno add npm:@nestjs/common npm:@nestjs/core npm:@nestjs/platform-express npm:reflect-metadata npm:rxjs
```

- [ ] TODO: Check if `platform-express` could be replaced with Hono.
- [x] TODO: Figure out how to manage Dev Dependencies. Primarily for Testing
- [ ] TODO: Set up Docker container
- [ ] TODO: Inspect post install scripts for `prisma`, `@nest/core`. What do they do, why are they necessary?

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

To limit which packages can run scripts:

```
--allow-scripts[=<PACKAGE>...]
```

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

Prisma client can't be generated in Deno project. That breaks `process` super global. So this won't work:

```prisma
generator client {
  // ...
  // When Prisma is compiled in DENO project location, it breaks process global.
  output = "./prisma-deno"
}
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

## Dev Dependencies

The main point I see for Dev dependencies in Deno project are tests. Tests depend on such things as `@std/testing` and `@nestjs/testing`. None of these should be present in production. Both to reduce bundle size and not to have any redundant code that can be potentially executed when it shouldn't be.

Additionally it is easier to manage the versions of all the dependencies in one location.

The best way I see to manage "Dev dependencies" in Deno 2 at the moment is dedicated import map + `--cached-only` flag.

### Import maps

Deno install command and others support `--import-map` parameter. By which a JSON file containing dependencies and their locations can be specified. Looks the same as `imports` in `deno.json`.

E.G.: `dev.json`

```json
{
    "imports": {
        "@std/testing": "jsr:@std/testing@^1.0.4"
    }
}
```

The problem with this approach (at least for now) is that the Language server doesn't seem to understand imports from other import maps. Only from `deno.json`.

The packages installed from the import map seems to be added to the `deno.lock` file. The behaviour of `deno install` needs to be tested with this, to ensure no unnecessary packages are installed.

#### The catch

The catch is that the import map needs to be written manually as `deno add` does not support import maps. Passing the package to `deno install` next to an import map will still result in it being added to `deno.json`.

This can be simplified a bit in 2 way:

- Execute the `deno add` as normal. Copy the dependency to `dev.json`. Then `deno remove` the package.
- If tests have been executed without cache limitation, hovering over the import in a test file will reveal the installed version.


### No Cache while testing

To prevent automatic install when it's undeseired use `--cached-only`.

As Deno 2 Language server does not recongise packages installed through import maps other than `deno.json`, the import has to happen from full path.

This will not work (if the package is not in `deno.json`):

```ts
import { beforeEach, describe, it } from "@std/testing/bdd";
```

However imports like this will cause automatic install even if it's undesired:

```ts
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
```

To prevent automatic install while running tests install the dependencies first:

```sh
deno install --import-map=dev.json
```

then run the tests from cache:

```sh
deno test --cached-only
```

## Permissions

Deno allows limits the process access to system resources like files, environment variables etc... However there are some challenges to this.

- Accessing FFI files relative to deno cache location. Prisma needs this `libquery_engine-debian-openssl-3.0.x.so.node` which is located deep in the cache, but the cache is located in different places for different environments. Also the library location depends on it's version.