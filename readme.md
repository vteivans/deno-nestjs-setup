# Deno project

## 1. Set up NestJS

Manually Install the dependencies of NestJS. Deno seems to detect types automatically.

```sh
deno add npm:@nestjs/common npm:@nestjs/core npm:@nestjs/platform-express npm:reflect-metadata npm:rxjs
```

- [x] TODO: Unit / Integration tests using Nest.
- [ ] TODO: Check if `platform-express` could be replaced with Hono.
- [ ] TODO: Figure out how to manage Dev Dependencies. Primarily for Testing
- [x] TODO: Set up Docker container
- [x] TODO: Inspect post install scripts for `prisma`, `@nest/core`. What do they do, why are they necessary?
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

### References

- [Issue regarding Prisma ESM Support](https://github.com/prisma/prisma/issues/5030)

   > This one is still in Progress. [There is an intermediate solution with a script](https://gist.github.com/shepherdjerred/c2b75b3b49ac9a1e0be0b2dd647d8253)

- [My Comment on Prisma ESM Support](https://github.com/prisma/prisma/issues/5030#issuecomment-2423004304)

## Docker

- [x] Create a docker image from official Deno base
- [x] Inspect the layers to understand the installation

Official base image: `FROM denoland/deno:2.1.4`

### Deno install

Adding a task for deno install executes the install 2x for some reason. Once without the scripts and once with the scripts.

Error when scripts can't run:

```
Warning The following packages contained npm lifecycle scripts (preinstall/install/postinstall) that were not executed:
┠─ npm:@nestjs/core@10.4.4
┠─ npm:prisma@5.21.0
┠─ npm:@prisma/client@5.21.0
┠─ npm:@prisma/engines@5.21.0
┃
┠─ This may cause the packages to not work correctly.
┖─ To run lifecycle scripts, use the `--allow-scripts` flag with `deno install`:
   deno install --allow-scripts=npm:@nestjs/core@10.4.4,npm:prisma@5.21.0,npm:@prisma/client@5.21.0,npm:@prisma/engines@5.21.0
```

### Debugging docker setup

Rebuild with no-cache

```
docker build --progress=plain --no-cache -t deno-nestjs-setup .
```

Currently having issues with `prisma push`. Prisma is complaining about `openssl`, but I shouldn't need it as I'm using SQLite.

Run the image:
```
docker run -p 3000:3000 deno-nestjs-setup
```

Without Openssl deno couldn't start anyway. So added the install to the Dockerfile. That fixed the `prisma push` and `deno task start`.

### Inspecting image

To inspect docker image layers and which file is created in which layer I used [dive](https://github.com/wagoodman/dive)

### References

- [Deno Docker](https://github.com/denoland/deno_docker)

## Dev Dependencies

Executing `deno install` without specifying import map (that should use `deno.json`). I got `@nestjs/testing` package installed. Even though it is only present in the `dev.json` import map.

- [ ] Remove `@nestjs/testing` from `deno.lock`, see if it gets installed anyway.
- [ ] Are `node_modules` required though?


## Post install scripts

- `docker-dev.sh` will create the docker image.
- `extract-docker-image.sh` will extract the image content for exploration.
- `dive` helps to find the right layer to explore

### @nestjs/core

Unclear. Seams to have generated an empty file `.scripts-run` in it's `node_modules` folder.

### @prisma/client

Seems to have generated some kind of base in it's `node_modules` folder.

Further inspection necessary.

### @prisma/engines

Downloaded the relevant engine files for the given OS.

### prisma

Unclear. Seams to have generated an empty file `.scripts-run` in it's `node_modules` folder.

### Import Map - storage

To store Dev Dependencies another import map outside of `deno.json` can be used.

```sh
deno install --import-map=./dev.json npm:@nestjs/testing
```

It doesn't seem possible to manage dev-dependencies without `package.json` at the moment. Using import map is tricky.

- Dependencies can be installed from it, but Deno language server does not always recongnise them.
- Dependencies from `--import-map` can't be uninstalled as far as I can see. Trying to uninstall one results in Deno suggesting it's not installed in the first place.

## How do I manage Deno permissions?

- [x] Is it possibler to list all permissions required when using the `-A` flag?

   > No native support in Deno for this. But there is a script.

- Topic in GitHub: [Ability to log all runtime granted permissions, e.g. when running with `-A`](https://github.com/denoland/deno/issues/20228)
   - A script that can potentially solve it: [Minimize-Deno](https://github.com/sigmaSd/Minimize-Deno)