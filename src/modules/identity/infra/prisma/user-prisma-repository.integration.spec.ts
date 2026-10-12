import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { makeUser } from "@/modules/identity/test/factories/make-user.js";
import { prisma } from "@/shared/infra/prisma/prisma-client.js";
import { UserPrismaRepository } from "./user-prisma-repository.js";

describe("UserPrismaRepository", () => {
  let userRepository: UserPrismaRepository;

  beforeEach(async () => {
    await prisma.orm.public.User.where({}).deleteAll();
    userRepository = new UserPrismaRepository(prisma);
  });

  afterAll(async () => {
    await prisma.close();
  });

  it("restores a stored user, identity and credentials intact, from its email", async () => {
    const user = makeUser({ email: "ana@brand.com", passwordHash: "stored-digest" });
    await prisma.orm.public.User.create({
      id: user.id.toValue(),
      email: "ana@brand.com",
      passwordHash: "stored-digest",
    });

    const found = await userRepository.findByEmail(user.email);

    expect(found?.equals(user)).toBe(true);
    expect(found?.email.equals(user.email)).toBe(true);
    expect(found?.passwordHash.equals(user.passwordHash)).toBe(true);
  });
});
