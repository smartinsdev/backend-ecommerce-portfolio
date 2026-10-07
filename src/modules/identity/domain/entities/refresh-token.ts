import { type Either, left, right } from "@/shared/kernel/either.js";
import { Entity } from "@/shared/kernel/entity.js";
import type { UniqueEntityId } from "@/shared/kernel/unique-entity-id.js";
import { TokenAlreadyUsedError } from "../errors/token-already-used-error.js";
import { TokenExpiredError } from "../errors/token-expired-error.js";

interface RefreshTokenProps {
  expiresAt: Date;
  usedAt: Date | null;
}

type RotateError = TokenAlreadyUsedError | TokenExpiredError;

export class RefreshToken extends Entity<RefreshTokenProps> {
  private constructor(props: RefreshTokenProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(props: RefreshTokenProps, id?: UniqueEntityId): RefreshToken {
    return new RefreshToken(props, id);
  }

  private get isUsed(): boolean {
    return this.props.usedAt !== null;
  }

  private isExpired(now: Date): boolean {
    return now.getTime() >= this.props.expiresAt.getTime();
  }

  rotate(now: Date): Either<RotateError, void> {
    if (this.isUsed) return left(new TokenAlreadyUsedError());
    if (this.isExpired(now)) return left(new TokenExpiredError());

    this.props.usedAt = now;

    return right(undefined);
  }
}
