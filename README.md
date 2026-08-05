# Backend e-commerce for portfolio

A Node.js + TypeScript backend prototype designed to demonstrate DDD, Clean Architecture, SOLID, TDD, DIP and strong boundary separation.

## What this project is

This repository is a modular monolith proof of concept for an e-commerce backend.
The architecture is intentionally built around:

- domain-first design with no framework or ORM imports inside `modules/*/domain`
- explicit dependency inversion through ports and adapters
- a `Shared Kernel` for foundational abstractions like `Entity`, `ValueObject`, `Either` and `DomainError`
- module boundaries for `Identity & Access`, `Catalog`, `Cart`, `Ordering`, and `Payment`
- Fastify + manual composition root for HTTP and dependency wiring
- Prisma + PostgreSQL behind repository adapters
- `Either`-based error handling in domain and use cases

## Current status

- project scaffolding and architecture documentation are present
- package scripts and TypeScript configuration are defined
- source entrypoint exists at `src/index.ts`
- domain and application implementation work is planned in `docs/architecture.md`

> Note: this repository is currently an initial project setup with design documentation. Implementation should follow the architecture plan in `docs/architecture.md`.

## Getting started

### Prerequisites

- Node.js 20+ or compatible runtime
- pnpm 11+

### Install dependencies

```bash
pnpm install
```

### Local development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint and format

```bash
pnpm lint
pnpm lint:fix
pnpm format
```

### Validate

```bash
pnpm validate
```

## Project structure

```text
src/
  shared/                # shared kernel, application ports, infra bootstrapping
  modules/               # domain modules and their application/infra layers
  main/                  # composition root, routes, server entrypoint

docs/                    # architecture and design documentation

package.json
pnpm-lock.yaml
tsconfig.json
vitest.config.ts
biome.json
```

## Architecture docs

The main design reference is `docs/architecture.md`.
It describes the intended module order, architectural decisions, error rules, test strategy, and scope for each bounded context.

## Notes

- `CLAUDE.md` contains assistant instructions and project collaboration guidelines.
- The architecture emphasizes inside-out delivery: complete each module from domain to HTTP before moving to the next.
- The current repository state is mostly scaffolding and planning; implementation is expected to align with the documented architecture.

## Recommended next step

Continue implementation by following `docs/architecture.md`:

1. build the Shared Kernel abstractions
2. implement Identity & Access domain and use cases
3. add Catalog, Cart, Ordering, and Payment modules in sequence
4. wire Fastify and Prisma in the composition root
5. add tests for domain, use cases, infra adapters, and HTTP routes
