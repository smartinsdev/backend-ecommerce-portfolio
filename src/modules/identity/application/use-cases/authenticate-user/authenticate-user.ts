import { InvalidCredentialsError } from "@/modules/identity/domain/errors/invalid-credentials-error.js";
import type { UserRepository } from "@/modules/identity/domain/repositories/user-repository.js";
import { Email } from "@/modules/identity/domain/value-objects/email.js";
import { type Either, isLeft, left, right } from "@/shared/kernel/either.js";
import type { HashComparer } from "../../ports/hash-comparer.js";

export class AuthenticateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  async execute(params: {
    email: string;
    password: string;
  }): Promise<Either<InvalidCredentialsError, void>> {
    const emailResult = Email.create(params.email);

    if (isLeft(emailResult)) {
      return left(new InvalidCredentialsError());
    }

    const user = await this.userRepository.findByEmail(emailResult.value);
    if (!user) return left(new InvalidCredentialsError());

    const passwordMatch = await this.hashComparer.compare(params.password, user.passwordHash);

    if (!passwordMatch) return left(new InvalidCredentialsError());

    return right(undefined);
  }
}
