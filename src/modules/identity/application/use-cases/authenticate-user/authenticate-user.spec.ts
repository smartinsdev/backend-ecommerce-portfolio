import { beforeEach, describe, expect, it } from "vitest";
import { FakeHashComparer } from "@/modules/identity/test/cryptography/fake-hash-comparer.js";
import { makeUser } from "@/modules/identity/test/factories/make-user.js";
import { InMemoryUserRepository } from "@/modules/identity/test/repositories/in-memory-user-repository.js";
import { isLeft, isRight } from "@/shared/kernel/either.js";
import { InvalidCredentialsError } from "../../../domain/errors/invalid-credentials-error.js";
import { AuthenticateUser } from "./authenticate-user.js";

describe("AuthenticateUser", () => {
  let userRepository: InMemoryUserRepository;
  let authenticateUser: AuthenticateUser;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    authenticateUser = new AuthenticateUser(userRepository, new FakeHashComparer());
  });

  it("rejects an email that belongs to no user", async () => {
    const result = await authenticateUser.execute({
      email: "nobody@brand.com",
      password: "any-password",
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(InvalidCredentialsError);
    }
  });

  it("authenticates a registered user whose password matches", async () => {
    userRepository.items.push(
      makeUser({ email: "ana@brand.com", passwordHash: "correct-password-hashed" }),
    );

    const result = await authenticateUser.execute({
      email: "ana@brand.com",
      password: "correct-password",
    });

    expect(isRight(result)).toBe(true);
  });

  it("rejects a wrong password for a registered user", async () => {
    userRepository.items.push(
      makeUser({ email: "ana@brand.com", passwordHash: "correct-password-hashed" }),
    );

    const result = await authenticateUser.execute({
      email: "ana@brand.com",
      password: "wrong-password",
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value).toBeInstanceOf(InvalidCredentialsError);
    }
  });
});
