# Backend e-commerce for portfolio — Design

**Date:** 2026-08-05
**Status:** approved for planning

## 1. Goal

Build from scratch a Node.js + TypeScript backend that demonstrates, in executable code, mastery of DDD, SOLID, TDD, DIP and Clean Architecture. The sample domain is an online store that initially sells a single product: cart with quantities, checkout, payment, authentication and permission-based access control.

Quality is not measured by feature count but by the ability to demonstrate boundaries: an evaluator must be able to open the domain layer and not find a single import of framework, ORM or HTTP library.

## 2. Architectural decisions

| Decision | Choice | Why |
|---|---|---|
| Topology | Modular monolith (one repo, one process) | Demonstrates DDD and Clean Architecture without distributed-infra noise; runs with `docker compose up` |
| HTTP + DI | Fastify + manual composition root | No magical decorators: reading the code makes it evident the domain does not know the framework |
| Persistence | Prisma + PostgreSQL behind repositories with explicit `Mapper` | Manual entity↔record mapping proves the domain is independent from the ORM |
| Authentication | Short-lived access JWT (~15 min) + rotating refresh token with reuse detection | Allows real logout and produces a genuinely critical domain rule |
| Authorization | RBAC + ownership | Covers real e-commerce cases without becoming a policy engine |
| Payment | `PaymentGateway` port + fake adapter; real gateway as future plugin | Central DIP demonstration without pulling external infra at the start |
| Inter-module integration | In-process domain events + transactional Unit of Work | Strong consistency with zero queue infra; migrating to a queue later is swapping the dispatcher |
| Errors | `Either` in the domain and in use cases | Possible failures are visible in the signature, with the compiler enforcing handling |

**Rejected alternatives.** NestJS (framework would dictate structure and architectural value would become its configuration). TypeORM (real risk of coupling domain entity to ORM entity — the most common trap in "Clean Architecture" portfolios). Microservices (would dilute tactical DDD focus and multiply infra work, the opposite of inside-out). Outbox/eventual consistency (correct for distributed systems, but would require workers, retries and idempotency, making all E2E tests asynchronous). ABAC policy engine (a whole subproject competing with the sales domain for attention).

## 3. Module map and build order

```
Shared Kernel → Identity & Access → Catalog → Cart → Ordering → Payment
```

The dependency graph is acyclic, which allows building in this order without temporary stubs.

- **Shared Kernel** first: `Entity`, `ValueObject`, `Either` are the vocabulary everything else is written in.
- **Identity & Access** second: ownership is transversal. `Cart` and `Order` are created owned by someone; adding `CustomerId` and permission checks later would force rewriting signatures of all already-tested use cases.
- **Catalog** before Cart: the cart references `ProductId` and queries price and stock.
- **Cart** before Ordering: checkout transforms a cart into an order.
- **Payment** last: it's the only module that depends on an existing, valid `Order`.

### Scope of each module

**Identity & Access** — Aggregate `User` (with `Role[]`), VOs `Email`, `PasswordHash`, `Permission`, entity `RefreshToken`. Use cases: `RegisterCustomer`, `AuthenticateUser`, `RefreshSession`. Ports: `HashGenerator`, `HashComparer`, `TokenSigner`, `Clock`. Roles (`customer`, `admin`) and their permissions are seed data, not CRUD.

**Catalog** — Aggregate `Product` (id, name, `Money` price, stock quantity) with `decreaseStock()` protecting the non-negative stock invariant. Use cases: `GetProduct`, `ListProducts`. Seed creates a product. **No admin CRUD at this stage** — the module exists to create a real boundary between contexts, not to be complete.

**Cart** — Aggregate `Cart` (customerId, items with `ProductId` + `Quantity`). Invariants: quantity always positive; adding the same product twice increases quantity instead of duplicating a line; empty cart cannot be checked out. Use cases: `AddItemToCart`, `ChangeItemQuantity`, `RemoveItemFromCart`, `GetCart`. **Cart does not store price** — it stores only product and quantity; price is resolved at checkout to avoid stale prices.

**Ordering** — Aggregate `Order` (customerId, items with unit price frozen at purchase time, total, status `PENDING_PAYMENT | PAID | CANCELLED`), with `isOwnedBy()`. Main use case: `CheckoutCart`, which reads the cart, resolves price and stock via the `ProductCatalogPort` (an anti-corruption adapter over Catalog), creates the order and emits `OrderPlaced`. `OrderPlaced` handlers: Catalog decrements stock, Cart clears the cart — all within the same Unit of Work transaction.

**Payment** — Aggregate `Payment` (orderId, `Money`, gateway reference) with state machine `PENDING → AUTHORIZED → CAPTURED`, plus `FAILED` and `REFUNDED`; invalid transitions return `left`. Port `PaymentGateway` (`authorize`, `capture`, `refund`) with `FakePaymentGateway` for tests and demo. Use cases: `InitiatePayment`, `ConfirmPayment`. `InitiatePayment` is triggered **explicitly by the client** on an order in `PENDING_PAYMENT` (not by an `OrderPlaced` handler), keeping checkout and charging as separate steps. It emits `PaymentCaptured`, whose handler in Ordering marks the order as `PAID`.

## 4. Folder structure

```
src/
  shared/
    kernel/                    # pure domain, no external dependencies
      entity.ts  value-object.ts  unique-entity-id.ts  either.ts  domain-error.ts
    application/               # cross-cutting ports — only when they appear
    infra/
      prisma/prisma-client.ts
      env/env.ts
      http/                    # Fastify bootstrap, global error handler

  modules/
    identity/
      domain/
        entities/user.ts  refresh-token.ts
        value-objects/email.ts  password-hash.ts  role.ts  permission.ts
        errors/invalid-credentials-error.ts
        repositories/user-repository.ts          # interface (outbound port)
        services/
      application/
        use-cases/authenticate-user/
          authenticate-user.ts
          authenticate-user.spec.ts
        ports/hash-comparer.ts  token-signer.ts  clock.ts
      infra/
        prisma/user-prisma-repository.ts  mappers/user-mapper.ts
        cryptography/bcrypt-hasher.ts  jwt-signer.ts
        http/controllers/authenticate-controller.ts
             routes/identity.routes.ts
             presenters/user-presenter.ts
      test/
        factories/make-user.ts
        repositories/in-memory-user-repository.ts

    catalog/  cart/  ordering/  payment/         # same shape

  main/
    factories/                 # assembles each use case with real dependencies
    routes.ts
    server.ts

test/                          # e2e tests: start server + real Postgres
prisma/schema.prisma
docker-compose.yml
```

Two conventions deserve explicit justification because they are where many "Clean Architecture" projects slip:

**Repository interfaces belong in `domain/`; technical ports belong in `application/`.** A repository is domain vocabulary — the business model talks about it naturally ("does a user with this email exist?"). `HashComparer` and `TokenSigner` are mechanism details needed only by the use case; the domain doesn't know that a password is hashed. Practical rule: if removing the interface would make the domain language incomplete, it belongs to the domain.

**Each module contains its own `test/` with fakes.** The `InMemoryUserRepository` is not second-class code: it makes application tests run in milliseconds without a database, and is living proof dependency inversion works. If Prisma is swapped one day and application tests don't change a line, the architecture was right.

## 5. Minimal Shared Kernel and expansion schedule

The kernel starts minimal and grows **only** when a module requires the abstraction. Nothing is written "for later".

| Abstraction | Introduced with |
|---|---|
| `Entity`, `UniqueEntityId`, `ValueObject`, `Either`, `DomainError` | v0, before Identity |
| `Money` | Catalog |
| `AggregateRoot` with event accumulation, `DomainEvent`, dispatcher | Cart (first emitted event) |
| `UnitOfWork` | Ordering (first multi-aggregate transaction) |

## 6. Error policy by layer

- **Domain**: `Either` for business rules; exceptions only for invariant violation (bug, not flow).
- **Use cases**: `Either` for every expected business failure.
- **Infra**: library exceptions are acceptable internally but converted to domain or application errors at the adapter boundary. No exception from Prisma, bcrypt or jwt escapes.
- **HTTP**: controller pattern-matches the `Either` and chooses the status (401, 403, 404, 409, 422). Fastify global error handler deals **only** with the unexpected.

Useful consequence: if something reaches the global handler in production, it's a bug, not a business rule.

Value Objects are created with a private constructor and `create()` factory returning `Either`. An invalid `Email` cannot exist anywhere in the system — validation happens once at the boundary and the rest of the code never asks again.

## 7. ACL: RBAC + ownership

Access decision is intentionally split into two halves, each located where the information to decide resides:

**Capability** — "does this role, in principle, execute `order:refund`?" — belongs to Identity. `Permission` is a VO in the `resource:action` format; `Role` aggregates permissions; `User.can(permission)` answers.

**Scope** — "but is this order theirs?" — cannot live in Identity, which doesn't know orders. It belongs to the aggregate owning the resource: `order.isOwnedBy(customerId)`.

The use case composes both explicitly:

```ts
if (!actor.can('order:read')) return left(new NotAllowedError())
const order = await this.orders.findById(orderId)
if (!order) return left(new ResourceNotFoundError())
if (!order.isOwnedBy(actor.id) && !actor.can('order:read:any'))
  return left(new NotAllowedError())
```

The `:any` suffix distinguishes administrative permission from permission over one's own resource.

**Authorization is a business rule and lives in the use case, not in middleware.** Fastify's `preHandler` hook only *authenticates*: it validates the JWT and builds the `Actor` (id + permissions). Authorizing in middleware would make the rule untestable in unit tests and would turn any new route that forgot the decorator into a security hole. The approach above makes omission impossible — without the check there's no successful response.

The `Actor` is the public contract Identity exposes to other modules; no other module imports the `User` aggregate.

## 8. Build strategy and TDD cycle

Strategy: **inside-out per module**. Each module progresses domain → application → infra → HTTP before the next begins. Inside-out is preserved where it matters — inside the module, dependency always points inward — and each module becomes a closed deliverable with green tests and a working route.

Deliberate exception: once `AuthenticateUser` is green, create **one** thin vertical slice (`POST /sessions`) to validate Fastify + Prisma + composition root. The skeleton crosses layers with a real use case, not a technical route — this validates plumbing and the model at once. This matters because Fastify is new to the author: better to discover the framework on one route, with a tested use case behind it, than across fifteen routes at the end of the project.

### Cycle inside each module

1. **Value Objects** — depend on nothing. Tests describe the rule, not the constructor: "email without @ is rejected", "zero quantity is rejected", "two `Money` values with same amount and currency are equal".
2. **Entity / aggregate** — test state transitions and invariants, never getters. For `Cart`, a good test isn't "adds item", it's "adding the same product twice increases quantity" and "empty cart cannot be checked out". No DB, no HTTP: rewriting the model three times in an afternoon is cheap.
3. **Use case with fakes** — the use case is created together with the ports it needs, and the ports arise from what the test requires. Write `execute()`, the test doesn't compile because `UserRepository` is missing, and *then* declare the minimal interface that test needs. Consumer-discovered interfaces, not provider-designed ones: the "D" of SOLID as a consequence of TDD, not as decree.
4. **Infra adapters** — `Mapper` and Prisma repository running **the same cases** as the fake, now as integration tests against real Postgres, proving the translation loses nothing. Each technical port gets its adapter, converting library exceptions into domain errors at the boundary.
5. **HTTP** — the dumbest layer: validate the body with Zod, call the use case, `match` the `Either`, choose the HTTP status. A business-rule `if` in the controller means layer leakage.
6. **Composition root** — factory in `main/factories`, the only place that instantiates concrete classes.

Temporal dependencies (the clock) are injected into the domain and via the `Clock` port in the use case. `new Date()` inside the domain would make expiration tests dependent on the machine clock.

## 9. Reference example: refresh token rotation

**Red, in the entity** — repository, use case and JWT don't exist yet:

```ts
it('refuses to rotate an already-used token', () => {
  const token = makeRefreshToken({ expiresAt: inOneDay })
  token.rotate(now)
  const result = token.rotate(now)
  expect(result.isLeft()).toBe(true)
  expect(result.value).toBeInstanceOf(TokenAlreadyUsedError)
})
```

**Green, with the minimum** — expiration check still doesn't exist because its test doesn't exist yet:

```ts
rotate(now: Date): Either<TokenAlreadyUsedError | TokenExpiredError, void> {
  if (this.usedAt) return left(new TokenAlreadyUsedError())
  this.usedAt = now
  return right(undefined)
}
```

**The test that changes the design** — reuse detection that the entity alone cannot satisfy, because revoking the family involves other tokens:

```ts
it('revokes the entire family when a used token is replayed', async () => {
  await sut.execute({ refreshToken: valid })              // legitimate rotation
  const result = await sut.execute({ refreshToken: valid }) // attacker replays

  expect(result.isLeft()).toBe(true)
  expect(tokensRepository.items.filter(t => t.familyId === family)
    .every(t => t.isRevoked)).toBe(true)
})
```

The use case fetches the token, attempts `rotate()`, and if the `left` is `TokenAlreadyUsedError` interprets it as compromise: calls `tokens.revokeFamily(familyId)` before returning `left`. The entity still knows only its own rule; the policy to respond to the attack is orchestration and belongs to the use case.

In infra, `revokeFamily` becomes an `updateMany` — that's where you discover whether an index on `familyId` makes sense. In the controller, `TokenAlreadyUsedError` and `InvalidCredentialsError` map **both to 401 with the same message**: distinguishing them in the response would give an attacker information that the token existed. The domain decides what; the controller decides only how that becomes HTTP.

## 10. Test strategy

Three levels, with mass concentrated at the base:

- **Unit** (majority) — domain and use cases with in-memory repositories. No I/O, milliseconds, run on every save.
- **Integration** — Prisma repositories and technical adapters against real Postgres via Docker. Re-run cases already covered by the fake.
- **E2E** (few, on money and access paths) — `app.inject()` from Fastify against the mounted application, real DB.

Tooling: Vitest, `tsx`, TypeScript in `strict` mode, Zod for HTTP input validation, Biome for linting/formatting, `docker compose` for Postgres.

## 11. Out of scope

Admin panel, product CRUD, shipping and taxes, coupons and discounts, transactional email, real payment gateway, message queue, observability beyond structured logs. Each item here is a natural extension later — none is a prerequisite to demonstrate the project's goals.

## 12. Success criteria

1. No file in `modules/*/domain/` imports Fastify, Prisma, Zod or any infra library.
2. Domain and application tests run without Docker and without environment variables.
3. Replacing `InMemoryUserRepository` with `UserPrismaRepository` does not change a line of a use case.
4. Every authorization decision is in the use case and covered by unit tests.
5. `docker compose up` + `npm run dev` brings the app up; `npm test` runs everything green.
6. Each module is delivered complete (domain → HTTP) before the next starts.
