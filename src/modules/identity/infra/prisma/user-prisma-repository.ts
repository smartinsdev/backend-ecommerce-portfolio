import type { PrismaDatabase } from "@/shared/infra/prisma/prisma-client.js";
import type { User } from "../../domain/entities/user.js";
import type { UserRepository } from "../../domain/repositories/user-repository.js";
import type { Email } from "../../domain/value-objects/email.js";
import { UserPrismaMapper } from "./mappers/user-prisma-mapper.js";

export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaDatabase) {}

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.orm.public.User.where({
      email: email.address,
    }).first();

    if (!record) return null;

    return UserPrismaMapper.toDomain(record);
  }
}
