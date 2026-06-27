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
  FindPetByIdOutput,
  FindPetByIdParams,
  UpdatePetInput,
  UpdatePetOutput,
} from "./DTOs/pet.dtos.js";
import type { PetWithDetails } from "@/@types/pet-with-details.js";

interface FindManyByCityParams {
  state: string;
  city: string;
  age?: Age;
  size?: Size;
}

export interface PetsRepository {
  create(orgId: string, data: CreatePetInput): Promise<CreatePetOutput>;
  findById(params: FindPetByIdParams): Promise<PetWithDetails | null>;
  findManyByCity(
    params: FindManyByCityParams,
  ): Promise<(Pet & { org: Org; images: PetImage[] })[]>;
  toggleAdopted(petId: string): Promise<Pet>;
  findManyOfOrg(
    orgId: string,
  ): Promise<(Pet & { org: Org; images: PetImage[] })[]>;
  delete(petId: string): Promise<void>;
  update(petId: string, data: UpdatePetInput): Promise<UpdatePetOutput>;
}
