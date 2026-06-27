import type {
  Age,
  Org,
  Pet,
  PetImage,
  Prisma,
  Size,
} from "@generated/prisma/client.js";
import type {
  CreatePetInput,
  CreatePetOutput,
  CreatePetParams,
  FindManyByCityParams,
  FindPetByIdOutput,
  FindPetByIdParams,
  ToggleAdoptedOutput,
  UpdatePetInput,
  UpdatePetOutput,
} from "./DTOs/pet.dtos.js";
import type { PetWithDetails } from "@/@types/pet-with-details.js";

export interface PetsRepository {
  create(orgId: string, data: CreatePetInput): Promise<CreatePetOutput>;
  findById(params: FindPetByIdParams): Promise<PetWithDetails | null>;
  findManyByCity(params: FindManyByCityParams): Promise<PetWithDetails[]>;
  toggleAdopted(petId: string): Promise<ToggleAdoptedOutput>;
  findManyOfOrg(
    orgId: string,
  ): Promise<(Pet & { org: Org; images: PetImage[] })[]>;
  delete(petId: string): Promise<void>;
  update(petId: string, data: UpdatePetInput): Promise<UpdatePetOutput>;
}
