# Deno project

## 1. Set up NestJS

Manually Install the dependencies of NestJS. Deno seems to detect types automatically.

```sh
deno add npm:@nestjs/common npm:@nestjs/core npm:@nestjs/platform-express npm:reflect-metadata npm:rxjs
```

- [ ] TODO: Check if `platform-express` could be replaced with Hono.
- [ ] TODO: Figure out how to manage Dev Dependencies. Primarily for Testing
- [ ] TODO: Set up Docker container

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

## 2. Set up Prisma