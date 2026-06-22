import type {
  Age,
  Org,
  Pet,
  PetImage,
  Prisma,
  Size,
} from "@generated/prisma/client.js";
import type { UpdatePetInput, UpdatePetOutput } from "./DTOs/pet.dtos.js";

interface FindManyByCityParams {
  state: string;
  city: string;
  age?: Age;
  size?: Size;
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  findById(
    id: string,
  ): Promise<(Pet & { org: Org; images: PetImage[] }) | null>;
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
