import type { User } from "../../domain/entities/user.js";
import type { UserRepository } from "../../domain/repositories/user-repository.js";
import type { Email } from "../../domain/value-objects/email.js";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];
  async findByEmail(email: Email): Promise<User | null> {
    return this.items.find(user => user.email.equals(email)) ?? null;
  }
}
