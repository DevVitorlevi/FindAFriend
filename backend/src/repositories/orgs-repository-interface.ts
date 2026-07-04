import type { Org, Prisma } from "@generated/prisma/client.js";
import type {
  CreateOrgInput,
  CreateOrgOutput,
  MeOrgOutput,
  MeOrgParams,
} from "./DTOs/org.dtos.js";

export interface OrgsRepository {
  create(data: CreateOrgInput): Promise<CreateOrgOutput>;
  findByEmail(email: string): Promise<Org | null>;
  me(id: MeOrgParams): Promise<MeOrgOutput | null>;
}
